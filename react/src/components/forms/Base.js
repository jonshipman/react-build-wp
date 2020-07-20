import React from "react";

import FormError from "../elements/FormError";
import Input from "../elements/Input";

class FormBase {
  getButton = () => {
    return this.form.button || "Submit";
  };

  getMutation = () => {
    return this.form.mutation;
  };

  triggerRecaptcha = (key, value) => {
    const trigger = this.form.recaptchaFieldTrigger;
    if (!trigger) {
      return true;
    }

    return trigger === key && this.isValid(key, value);
  };

  isValid = (key, value) => {
    if (!this.form.fields[key]) {
      console.error(`Key does not exist: ${key}`);
    }
    return this.form.fields[key].validity(value);
  };

  getField = (key) => {
    return this.form[key] ? this.form[key] : null;
  };

  setError = (key) => {
    return (this.form.fields[key].error = true);
  };

  removeError = (key) => {
    return (this.form.fields[key].error = null);
  };

  noErrors = () => {
    let error = false;
    Object.entries(this.form.fields).map(([key]) => {
      if (true === this.form.fields[key]?.error) {
        error = true;
      }

      return null;
    });

    return !error;
  };

  buildState = () => {
    const { fields } = this.form;
    const emptyFormValues = {};

    Object.entries(fields).map(([key]) => {
      emptyFormValues[key] = "";

      return null;
    });

    return emptyFormValues;
  };

  templates = {
    Text: ({ key, name, ...props }) => (
      <Input id={name} {...props}>
        {this.form.fields[name]?.error && (
          <FormError>{this.form.fields[name]?.errorMessage}</FormError>
        )}
      </Input>
    ),
    Select: ({ key, name, ...props }) => (
      <Input type="select" id={name} {...props}>
        {this.form.fields[name]?.error && (
          <FormError>{this.form.fields[name]?.errorMessage}</FormError>
        )}
      </Input>
    ),
    Textarea: ({ key, name, ...props }) => (
      <Input type="textarea" id={name} {...props}>
        {this.form.fields[name]?.error && (
          <FormError>{this.form.fields[name]?.errorMessage}</FormError>
        )}
      </Input>
    ),
  };

  component = ({ updateState, values }) => {
    const { fields } = this.form;
    return (
      <>
        {Object.entries(fields).map(([key, value]) => {
          return (
            <value.component
              value={values[key]}
              onChange={(v) => updateState(key, v)}
              key={`${this.name}-${key}`}
            />
          );
        })}
      </>
    );
  };
}

export default FormBase;
