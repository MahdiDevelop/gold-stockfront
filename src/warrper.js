import Swal from "sweetalert2";
import React from "react";
import { useIntl } from "react-intl";

// تبدیل `showAlert` به یک هوک سفارشی
const useShowAlert = () => {
  const intl = useIntl();  // استفاده از `useIntl` در هوک

  const showAlert = (options) => {
    let finalTitle = options.title;

    // اگر عنوان از `FormattedMessage` باشد، آن را به متن تبدیل می‌کنیم
    if (React.isValidElement(options.title)) {
      finalTitle = intl.formatMessage({ id: options.title.props.id });
    }

    Swal.fire({
      ...options,
      title: finalTitle,
        didOpen: () => {
    const popup = Swal.getPopup();
    if (popup) {
      popup.style.zIndex = '1000000'; // یا هر مقدار دلخواه
    }
  }
      // نمایش عنوان به صورت متن
    });
  };

  return showAlert;
};

export { useShowAlert };
