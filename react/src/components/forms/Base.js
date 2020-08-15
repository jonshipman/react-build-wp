import React, { useCallback } from "react";

import FormError from "../elements/FormError";
import Input from "../elements/Input";

export const TemplateText = ({
  errorMessage,
  hasError,
  key,
  name,
  ...props
}) => {
  return (
    <Input id={name} {...props}>
      {hasError && <FormError>{errorMessage}</FormError>}
    </Input>
  );
};

export const TemplateSelect = ({
  errorMessage,
  hasError,
  key,
  name,
  ...props
}) => {
  return (
    <Input type="select" id={name} {...props}>
      {hasError && <FormError>{errorMessage}</FormError>}
    </Input>
  );
};

export const TemplateTextarea = ({
  errorMessage,
  hasError,
  key,
  name,
  ...props
}) => {
  return (
    <Input type="textarea" id={name} {...props}>
      {hasError && <FormError>{errorMessage}</FormError>}
    </Input>
  );
};

export default class {
  getButton = () => {
    return this.form.button || "Submit";
  };

  getMutation = () => {
    return this.form.mutation;
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

  buildState = () => {
    const { fields } = this.form;
    const emptyFormValues = {};

    Object.entries(fields).map(([key]) => {
      emptyFormValues[key] = "";

      return null;
    });

    return emptyFormValues;
  };

  component = ({ updateState, values, errors = {} }) => {
    const { fields } = this.form;
    return (
      <>
        {Object.entries(fields).map(([key, value]) => {
          const updater = useCallback((v) => updateState(key, v), [key]);

          return (
            <value.component
              value={values[key]}
              onChange={updater}
              key={`${this.name}-${key}`}
              errorMessage={this.form.fields[key]?.errorMessage}
              hasError={errors[key]}
            />
          );
        })}
      </>
    );
  };
}
