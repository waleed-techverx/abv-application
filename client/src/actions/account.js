import { BASE_API_URL } from '../utils/constants';
import { getErrors } from './errors';
import { SET_ACCOUNT, UPDATE_ACCOUNT, RESET_ACCOUNT } from '../utils/constants';
import { get, patch, post } from '../utils/api';

export const setAccount = (accountDetails) => ({
  type: SET_ACCOUNT,
  accountDetails
});

export const resetAccount = () => ({
  type: RESET_ACCOUNT
});

export const updateAccountBalance = (amountToChange, operation) => ({
  type: UPDATE_ACCOUNT,
  amountToChange,
  operation
});

export const initiateGetAccntDetails = () => {
  return async (dispatch) => {
    try {
      const account = await get(`${BASE_API_URL}/account`);
      return dispatch(setAccount(account.data));
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const initiateAddAccntDetails = (account_no, bank_name, code) => {
  return async (dispatch) => {
    try {
      return await post(`${BASE_API_URL}/account`, {
        account_no,
        bank_name,
        code
      });
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
    }
  };
};

export const initiateUpdateAccntDetails = (code) => {
  return async (dispatch) => {
    try {
      await patch(`${BASE_API_URL}/account`, {
        code
      });
      return { success: true };
    } catch (error) {
      error.response && dispatch(getErrors(error.response.data));
      return { success: false };
    }
  };
};