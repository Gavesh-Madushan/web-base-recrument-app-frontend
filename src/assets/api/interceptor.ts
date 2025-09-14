import { openErrorDialog } from "../../utils/ui-components/pop-ups/ErrorDialog";
import { getLogout, getState } from "../../redux/actions/actions";
import { axiosInstance } from "@kubb/plugin-client/clients/axios";
let store;

export const injectStore = (_store) => {
  store = _store;
};

const dev = (import.meta as any).env.VITE_API_DEV;
const prod = (import.meta as any).env.VITE_API_PROD;

axiosInstance.defaults.baseURL = (import.meta as any).env.MODE === "development" ? dev : prod;

axiosInstance.interceptors.request.use(
  (req) => {
    if (store?.getState()?.auth?.authData) {
      const decryptedDefaultData = getState(store?.getState()?.auth?.authData);
      req.headers["Authorization"] = `Bearer ${decryptedDefaultData.token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error?.response?.status) {
      return;
    }

    let response;

    if (error?.response?.data instanceof Blob) {
      const text = await error?.response?.data.text(); // Convert blob to text
      response = JSON.parse(text);
    } else {
      response = error?.response?.data;
    }
    if (error?.response?.status === 401) {
      openErrorDialog(error?.response?.statusText, response.message?.ENGLISH);
      store.dispatch(getLogout("/login"));
    } else {
      openErrorDialog(error?.response?.statusText, response?.message?.ENGLISH);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
