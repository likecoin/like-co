import * as Axios from 'axios';

const FormData = require('form-data');

const config = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const {
  KYC_TOKEN,
  KYC_HOST,
  KYC_APP,
  KYC_DOMAIN,
  KYC_QUERY_PATH,
  KYC_CREATE_PATH,
  KYC_UPLOAD_PATH,
  KYC_CHECK_PATH,
  KYC_REPORT_PATH,
} = config;

const formDataConfig = form => ({
  headers: {
    'WEB2PY-USER-TOKEN': KYC_TOKEN,
    ...form.getHeaders(),
  },
});

const axios = Axios.create({
  baseURL: `${KYC_HOST}/${KYC_APP}/`,
  headers: { 'WEB2PY-USER-TOKEN': KYC_TOKEN },
});

export async function getKYCAPIStatus(user) {
  const { data } = await axios.get(`${KYC_QUERY_PATH}?domain_name=${KYC_DOMAIN}&rfrID=${user}`);
  return data.approval_status || 'NOT_FOUND';
}

export async function callKYCAPI(payload) {
  const {
    user,
    firstName,
    lastName,
    nationality,
    country,
    selfieFile,
    passportFile,
    email,
  } = payload;
  const status = await getKYCAPIStatus(id);
  if (status && status !== 'NOT_FOUND') {
    return status;
  };

  const rfrID = user;
  const createPayload = {
    domain_name: KYC_DOMAIN,
    rfrID,
    first_name: firstName,
    last_name: lastName,
    nationality,
    country_of_residence: country,
    emails: [email],
    ssic_code: 'UNKNOWN',
    ssoc_code: 'UNKNOWN',
    onboarding_mode: 'NON FACE-TO-FACE',
    payment_mode: 'VIRTUAL CURRENCY',
    product_service_complexity: 'COMPLEX',
  };
  const { data: createData } = await axios.post(KYC_CREATE_PATH, createPayload);
  console.log(`Advanced KYC ${user}: ${createData}`);

  const selfieForm = new FormData();
  selfieForm.append('document_type', 'SELFIE');
  selfieForm.append('cust_rfr_id', rfrID);
  selfieForm.append('file', selfieFile.buffer, selfieFile.originalname);

  const passportForm = new FormData();
  passportForm.append('document_type', 'PASSPORT');
  passportForm.append('cust_rfr_id', rfrID);
  passportForm.append('file', passportFile.buffer, passportFile.originalname);
  const [{ data: selfieData }, { data: passportData }] = await Promise.all([
    axios.post(KYC_UPLOAD_PATH, selfieForm, formDataConfig(selfieForm)),
    axios.post(KYC_UPLOAD_PATH, passportForm, formDataConfig(passportForm)),
  ]);
  console.log(`Advanced KYC ${user}: ${selfieData}`);
  console.log(`Advanced KYC ${user}: ${passportData}`);

  const faceForm = new FormData();
  faceForm.append('cust_rfr_id', rfrID);
  faceForm.append('source_doc_id', passportData.id);
  faceForm.append('target_doc_id', selfieData.id);
  const { data: faceData } = await axios.post(KYC_CHECK_PATH, faceForm, formDataConfig(faceForm));
  console.log(`Advanced KYC ${user}: ${faceData}`);

  const { data: reportData } = await axios.post(KYC_REPORT_PATH, {
    cust_rfr_id: rfrID,
  });
  console.log(`Advanced KYC ${user}: ${reportData}`);

  return getKYCAPIStatus(user);
}
