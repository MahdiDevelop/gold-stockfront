import { createIntl, createIntlCache } from "react-intl";

// ترجمه‌ها
import enMessages from "../locales/en/translation.json";  // فایل ترجمه انگلیسی
import daMessages from "../locales/da/translation.json";  // فایل ترجمه فارسی
import paMessages from "../locales/pa/translation.json";  // فایل ترجمه فارسی

// کش کردن ترجمه‌ها برای عملکرد بهتر
const cache = createIntlCache();

// ساخت یک instance از intl برای مدیریت ترجمه‌ها
const intl = createIntl(
  {
    locale: "da",  // زبان پیش‌فرض
    messages: daMessages,  // پیام‌ها برای زبان پیش‌فرض
  },
  cache
);

export const setLocale = (locale) => {
  // تغییر زبان
  if (locale === "fa") {
    intl.update({ locale: "da", messages: daMessages });
  } else {
    intl.update({ locale: "en", messages: enMessages });
  }
};

export default intl;
