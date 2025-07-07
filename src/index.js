import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store, persistor } from "./pages/Redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import Source from "./Source";
import { IntlProvider } from "react-intl";
import enMessages from "./locales/en/translation.json";  // فایل ترجمه انگلیسی
import daMessages from "./locales/da/translation.json";  // فایل ترجمه دانمارکی
import paMessages from "./locales/pa/translation.json";  // فایل ترجمه پنجابی
const messages = {
  en: enMessages,
  da: daMessages,
  pa: paMessages,
};const Root = () => {
  const [locale, setLocale] = useState(localStorage.getItem("language")); // زبان پیش‌فرض
  if(!localStorage.getItem('language')){
    axios.get(Source.getAddress()+'/api/first-setting').then((res)=>{
      localStorage.setItem('language',res.data.language);
      localStorage.setItem('date',res.data.date);
      setLocale(res.data.language);

  }).catch((err)=>{
    console.log(err);
  })
}
return (
  <IntlProvider locale={locale}  messages={messages[locale]}>
      <App />
    </IntlProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root />
    </PersistGate>
  </Provider>
);
