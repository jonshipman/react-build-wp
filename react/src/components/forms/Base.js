import React from 'react';
import { Field, ErrorMessage } from 'formik';

import FormError from '../elements/FormError';

class FormBase {
  getButton = () => {
    return this.form.button || 'Submit';
  }

  getMutation = () => {
    return this.form.mutation;
  }

  triggerRecaptcha = values => {
    return values[this.form.recaptchaFieldTrigger] && values[this.form.recaptchaFieldTrigger].length > 0 ? true : false;
  }

  isValid = (key, value) => {
    if (!this.form.fields[key]) {
      console.error(`Key does not exist: ${key}`);

    }
    return this.form.fields[key].validity(value);
  }

  getField = key => {
    return this.form[key] ? this.form[key] : null;
  }

  getError = key => {
    return this.form.fields[key].errorMessage;
  }

  buildState = () => {
    const { fields } = this.form;
    const emptyFormValues = {};

    Object.entries(fields).map(([key]) => {
      emptyFormValues[key] = '';

      return null;
    });

    return emptyFormValues;
  }

  templates = {
    Text: ({ key, name, label, className='', type='text', ...props }) => (
      <div className={`form-group w-100 mb4 drop-last-mb ${className}`} { ...props }>
        <label htmlFor={name} className="fw7 ttu db w-100 mb2 pl2">{$label}</label>
        <Field type={type} id={name} name={name} placeholder={$label} className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2" />
        <ErrorMessage name={name} component={FormError} />
      </div>
    ),
    Select: ({ key, name, label, className='', options, ...props }) => (
      <div className={`form-group w-100 mb4 drop-last-mb ${className}`} { ...props }>
        <label htmlFor={name} className="fw7 ttu db w-100 mb2 pl2">{$label}</label>
        <Field className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2" as="select" name={name}>
          <option value=""></option>
          {options.map(opt => <option key={name + opt.value} value={opt.value}>{opt.label}</option>)}
        </Field>
        <ErrorMessage name={name} component={FormError} />
      </div>
    ),
    Textarea: ({ key, name, label, className='', ...props }) => (
      <div className={`form-group w-100 mb4 drop-last-mb ${className}`} { ...props }>
        <label htmlFor={name} className="fw7 ttu db w-100 mb2 pl2">{label}</label>
        <Field component="textarea" id={name} name={name} placeholder={label} className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2 h3" />
        <ErrorMessage name={name} component={FormError} />
      </div>
    ),
  }

  component = () => {
    const { fields } = this.form;
    return (
      <>
        {Object.entries(fields).map(([key, value]) => {
          return <value.component key={key} />;
        })}
      </>
    );
  }
}

export default FormBase;