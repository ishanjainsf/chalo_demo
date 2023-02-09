import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";

// const root = ReactDOM.createRoot(document.getElementById("root"));
ReactDOM.render(
  <React.Suspense fallback={"Loading..."}>
    <Provider store={store}>
      <App />
    </Provider>
  </React.Suspense>,
  document.getElementById("root")
);
