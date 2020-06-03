import React, { Fragment } from 'react';

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

  getLocationQueryField = () => {
    const { fields } = this.form;
    let ret = null;

    Object.entries(fields).map(([key, value]) => {
      let { locationQuery } = value;

      if (locationQuery) {
        ret = key;
      }

      return null;
    });

    return ret;
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

  component = () => {
    const { fields } = this.form;
    return (
      <>
        {Object.entries(fields).map(([key, value]) => {
          return (
            <Fragment key={key}>
              <value.component />
            </Fragment>
          );
        })}
      </>
    );
  }
}

export default FormBase;