import { fetchZipCodes } from '../../services/ZipCodeService';

export const FETCH_ZIPCODES = 'FETCH_ZIPCODES';
export const FETCH_ZIPCODES_PENDING = 'FETCH_ZIPCODES_PENDING';
export const FETCH_ZIPCODES_FULFILLED = 'FETCH_ZIPCODES_FULFILLED';
export const FETCH_ZIPCODES_REJECTED = 'FETCH_ZIPCODES_REJECTED';

const fetchZipCodesAction = () => ({
    type: FETCH_ZIPCODES,
    payload: fetchZipCodes()
});

export { fetchZipCodesAction as fetchZipCodes };