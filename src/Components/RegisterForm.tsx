
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Mock data for city autocomplete
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  tel: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .required("Phone number is required"),
  city: Yup.string().required("City is required"),
});

const MyForm = () => {
  return (
    <Formik
      initialValues={{ name: "", tel: "", city: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form submitted:", values);
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <div>
            <label htmlFor="name">Name</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="tel">Phone Number</label>
            <Field type="tel" id="tel" name="tel" />
            <ErrorMessage name="tel" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="city">City</label>
            <Field
              type="text"
              id="city"
              name="city"
              list="city-list"
              onChange={(e: { target: { value: string; }; }) => setFieldValue("city", e.target.value)}
            />
            <datalist id="city-list">
              {cities.map((city, index) => (
                <option key={index} value={city} />
              ))}
            </datalist>
            <ErrorMessage name="city" component="div" className="error" />
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default MyForm;
