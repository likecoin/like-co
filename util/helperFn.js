import moment from 'moment';
import { SALE_DATE, SALE_END_DATE } from '@/constant';

export const getIsTokenSaleStarted = () => moment().isBefore(SALE_DATE);

export const getIsTokenSaleEnded = () => moment().isAfter(SALE_END_DATE);
