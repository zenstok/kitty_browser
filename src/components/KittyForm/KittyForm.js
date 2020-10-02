import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './KittyForm.css';

const ValidationSchema = Yup.object().shape({
  kittyId: Yup.number()
    .integer()
    .min(1, 'Id must be at least 1!')
    .required('Kitty ID is required!'),
});

export const KittyForm = ({onSubmit}) => (
  <div className='kitty-form'>
    <h3>Kitty ID:</h3>
    <Formik
      initialValues={{
        kittyId: '',
      }}
      validationSchema={ValidationSchema}
      onSubmit={values => {
        onSubmit(values.kittyId);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="form-group">
            <Field name="kittyId" />
            {errors.kittyId && touched.kittyId ? (
              <div className="form-errors">{errors.kittyId}</div>
            ) : null}
          </div>
          <button type="submit">FIND KITTY</button>
        </Form>
      )}
    </Formik>
  </div>
);

export default KittyForm;
