import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productsReducer from "./productsSlice";
import userReducer from "./userSlice";

import {
  getProfileReducer,
  updateprofileReducer,
} from "./Reducers/userReducers";

// const persistProductsConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const persistUserConfig = {
//   key: "root",
//   version: 1,
//   storage,
// }

// storage.removeItem('persist:root')

const initialState = {
  userInfo: {
    profile: {},
    whishlist: [],
    cart: [],
  },
  products: [],
};

// const persistedProductsReducer = persistReducer(persistProductsConfig, productsReducer);
// const persistedUserReducer = persistReducer(persistUserConfig, userReducer);

const rootReducer = {
  productsReducer,
  userReducer,
  userprofile: getProfileReducer,
  profileupdate: updateprofileReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

// export let persistor = persistStore(store);
export default store;
