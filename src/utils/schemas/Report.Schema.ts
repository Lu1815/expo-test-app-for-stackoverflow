import * as Yup from "yup";

export const reportValidationSchema = Yup.object().shape({
    reportDescription: Yup.string().required("Report description is required"),
});