import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required('Phone number required')
});
