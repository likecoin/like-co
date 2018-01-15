import EthHelper from '@/util/EthHelper';
import * as types from '@/store/mutation-types';

const web3Error = 'Like function will not work without a wallet, is &nbsp;<a href="https://metamask.io/"> Metamask </a>&nbsp; installed?';
const testnetError = 'You are in wrong ETH network, please switch to testnet '
  + ' &nbsp;<a href="https://www.rinkeby.io/"> Rinkeby </a>&nbsp; in metamask.';
const lockedError = 'Cannot obtain your ETH wallet, please make sure it is UNLOCKED.';

export default ({ store }) => {
  EthHelper.initApp(
    (err) => {
      let errMsg = '';
      if (err === 'web3') errMsg = web3Error;
      else if (err === 'testnet') errMsg = testnetError;
      else if (err === 'locked') errMsg = lockedError;
      store.commit(types.UI_POPUP_ERR, errMsg);
    },
    () => {
      store.commit(types.UI_POPUP_ERR, '');
    },
    (wallet) => {
      store.dispatch('isUser', wallet);
    },
  );
};
