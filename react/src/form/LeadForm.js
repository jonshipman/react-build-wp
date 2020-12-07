import React, { useEffect, useCallback } from "react";
import { FormGroup, Button } from "react-wp-gql";
import { gql, useMutation } from "@apollo/client";
import { useLeadFormState } from "./useLeadFormState";
import { useFormData } from "./useFormData";
import { ProcessFormComponent } from "./ProcessFormComponent";

const DefaultMutation = gql`
  mutation DefaultForm($input: DefaultFormMutationInput!) {
    defaultFormMutation(input: $input) {
      clientMutationId
      success
      errorMessage
    }
  }
`;

export const LeadFormGroup = ({
  id,
  onChange,
  form,
  triggerRecaptcha,
  ...props
}) => {
  return (
    <FormGroup
      {...{ id }}
      value={form[id]}
      onChange={(value) => onChange(value, id)}
      {...props}
    />
  );
};

export const LeadForm = (props) => {
  const {
    submitionMessage = "Form submitted. Thank you for your submission.",
    buttonLabel = "Submit",
    wrap: GroupWrap = "div",
    mutation = DefaultMutation,
    formName = "default",
    buttonClassName,
    children,
    className,
    form: formProp,
  } = props;

  const {
    nonce,
    errors,
    fields,
    loading,
    form,
    setForm,
    message,
    setMessage,
    completed,
    setCompleted,
    processForm,
    setProcessForm,
    trigger,
    triggerField,
  } = useLeadFormState();

  // Pass on any initial values set in prop.
  useEffect(() => {
    if (formProp && Object.keys(formProp).length !== 0) {
      setForm((x) => ({ ...x, ...formProp }));
    }
  }, [formProp, setForm]);

  // When completed, check for success then display error if not.
  const onCompleted = (data) => {
    loading.current = false;
    const keys = Object.keys(data || {});
    const { errorMessage, success } = data ? data[keys[0]] || {} : {};

    if (success) {
      setCompleted(true);
      setMessage(null);
    } else {
      setMessage(errorMessage);
    }
  };

  // Mutation
  const [mutate] = useMutation(mutation, {
    onCompleted,
    errorPolicy: "all",
  });

  const { token } = useFormData({
    nonce,
    formName,
    trigger: trigger.current,
  });

  const onSubmit = useCallback(() => {
    setProcessForm(true);

    const __f = {};
    fields.current.forEach((key) => {
      if (!form[key]) {
        __f[key] = "";
      }
      setForm((existing) => ({ ...existing, ...__f }));
    });
  }, [fields, form, setForm, setProcessForm]);

  const onChange = (value, field) => {
    setForm((existing) => ({ ...existing, [field]: value }));
  };

  const onInit = useCallback(
    ({ id }) => {
      fields.current.push(id);
    },
    [fields]
  );

  const onCheck = useCallback(
    ({ id, valid }) => {
      if (triggerField.current && triggerField.current === id) {
        trigger.current = valid;
      }

      errors.current = { ...errors.current, [id]: !valid };
    },
    [errors, triggerField, trigger]
  );

  const GroupProps = {
    onChange,
    form,
    onCheck,
    onInit,
  };

  const options = {
    ...props,
    ...{
      nonce,
      errors,
      fields,
      form,
      setForm,
      message,
      setMessage,
      completed,
      setCompleted,
      processForm,
      setProcessForm,
      mutate,
      token,
      loading,
    },
  };

  return (
    <div {...{ className }}>
      <div className="cf">
        {completed && (
          <div className="success-message primary fw7 f6 mb3">
            {submitionMessage}
          </div>
        )}

        {message && (
          <div className="error-message red fw7 f6 mb3">{message}</div>
        )}

        <GroupWrap className="form-groups">
          {!!children &&
            React.Children.toArray(children).map((child, index) => {
              if (child.props.triggerRecaptcha) {
                triggerField.current = child.props.id;
              }

              const replacement = React.cloneElement(child, {
                ...GroupProps,
                key: `leadform-render-${index}`,
              });

              return replacement;
            })}
        </GroupWrap>
      </div>
      <div className="button-wrap tr" style={{ marginBottom: 0 }}>
        <Button
          loading={loading.current}
          disabled={completed}
          onClick={onSubmit}
          className={buttonClassName}
        >
          {buttonLabel}
        </Button>
      </div>
      {processForm && <ProcessFormComponent {...options} />}
    </div>
  );
};
