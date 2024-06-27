import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  otpCode: Yup.string().required("The OTP Code is required")
});
