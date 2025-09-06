import { all } from 'redux-saga/effects';
// Sagas
import authSagas from "./auth-saga";

// Export the root saga
export default function* rootSaga() {

    yield all([...authSagas]);
}