import {
  getAccessToken,
} from '../services/oauth';
import { OA_CLIENT_ID, OA_CLIENT_SECRET } from '../utils/util';

export default {
  namespace: 'oauth',

  state: {
    accessToken: '',
    userInfo: {
      staff_sn: 119401,
      realname: '魏颖',
      mobile: '18281208081',
      brand_id: 1,
      brand: {
        id: 1,
        name: '集团公司',
      },
      department_id: 7,
      department: {
        id: 7,
        full_name: 'IT部',
        manager_sn: '110096',
        manager_name: '沈勇',
      },
      position_id: 24,
      position: {
        id: 24,
        name: '初级专员',
        level: 16,
      },
      shop_sn: '',
      shop: null,
      status_id: 1,
      status: {
        id: 1,
        name: '试用期',
      },
      hired_at: '2018-04-16',
      employed_at: null,
      left_at: null,
      gender_id: 2,
      birthday: '1994-06-14',
      property: 0,
      education: '',
    },
  },

  effects: {
    * getAccessTokenByAuthCode({ payload }, { call, put }) {
      const params = {
        grant_type: 'authorization_code',
        client_id: OA_CLIENT_ID(),
        client_secret: OA_CLIENT_SECRET(),
        ...payload,
      };
      const response = yield call(getAccessToken, params);
      if (response && !response.error) {
        yield put({
          type: 'saveAccessToken',
          payload: response,
        });
        // payload.cb ? payload.cb() : ''
      }
    },
    * refreshAccessToken({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('OA_refresh_token'),
        client_id: OA_CLIENT_ID(),
        client_secret: OA_CLIENT_SECRET(),
        scope: '',
        ...payload,
      };

      const response = yield call(getAccessToken, params);
      if (response && !response.error) {
        yield put({
          type: 'saveAccessToken',
          payload: response,
        });
      }
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveAccessToken(state, action) {
      localStorage.setItem('OA_access_token', action.payload.access_token);
      localStorage.setItem('OA_access_token_expires_in', new Date().getTime() + ((action.payload.expires_in - 10) * 1000));
      localStorage.setItem('OA_refresh_token', action.payload.refresh_token);
      return {
        ...state,
        accessToken: action.payload.access_token,
      };
    },
  },
};
