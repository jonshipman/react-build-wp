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

function FieldComponentWrapper({
  field,
  render: FieldComponent,
  updateState,
  ...props
}) {
  props.onChange = useCallback(
    (v) => {
      updateState(field, v);
    },
    [updateState, field]
  );
  return <FieldComponent {...props} />;
}

function BaseFormComponent({ name, fields, updateState, errors = {}, values }) {
  return (
    <>
      {Object.entries(fields).map(([field, { component }]) => {
        return (
          <FieldComponentWrapper
            render={component}
            field={field}
            value={values[field]}
            updateState={updateState}
            key={`${name}-${field}`}
            errorMessage={fields[field]?.errorMessage}
            hasError={errors[field]}
          />
        );
      })}
    </>
  );
}

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

  component = BaseFormComponent;
}
