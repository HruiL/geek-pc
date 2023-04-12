import React from "react";
import ReactDOM from "react-dom/client";
import App from "@src/App";
import { Provider } from "react-redux";
import { store } from "@src/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@css/base.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const persistor = persistStore(store);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      <ToastContainer />
    </PersistGate>
  </Provider>
);
