import { openErrorDialog } from "../../utils/ui-components/pop-ups/ErrorDialog";
import { getLogout, getState } from "../../redux/actions/actions";
import { ExZodusClient } from "@assassinonz/exzodus-client";
import { paths } from "../../kubb/zod/operations";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const dev = import.meta.env.VITE_API_DEV;
const prod = import.meta.env.VITE_API_PROD;

const interceptor = new ExZodusClient<typeof paths>(
  import.meta.env.MODE === "development" ? dev : prod
);

interceptor.axios.interceptors.request.use(
  (req) => {
    if (store?.getState()?.auth?.authData) {
      const decryptedDefaultData = getState(store?.getState()?.auth?.authData);
      // console.log(decryptedDefaultData);
      req.headers["Authorization"] = `Bearer ${decryptedDefaultData.token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interceptor.axios.interceptors.response.use(
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
      openErrorDialog(error?.response?.statusText, response.message);
      store.dispatch(getLogout("/login"));
    } else {
      openErrorDialog("Something went wrong", response?.message);
    }
    return Promise.reject(error);
  }
);

export default interceptor;
