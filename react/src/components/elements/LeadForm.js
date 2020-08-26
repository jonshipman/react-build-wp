import React, { useState, useEffect, useCallback, useMemo } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import DefaultForm from "../forms/DefaultForm";
import FormError from "./FormError";
import Button from "./Button";
import Recaptcha from "../external-scripts/Recaptcha";

/**
 * To add a new form - copy ./forms/DefaultForm and pass it as the prop
 * form to the component. Add the form to the wp theme by looking at
 * $themeFolder/inc/form-actions.php.
 */

const FORM_DATA = gql`
  query LeadForm {
    formData {
      id
      wpNonce {
        id
        form
        wpNonce
      }
      recatchaSiteKey
    }
  }
`;

const LeadForm = ({ form = DefaultForm, className = "" }) => {
  const initialState = useMemo(() => {
    return form.buildState();
  }, [form]);

  const [state, setState] = useState({ nonce: "", token: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState(initialState);
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const [mutation, { loading, data: mutationData }] = useMutation(
    form.getMutation()
  );
  const { data, error } = useQuery(FORM_DATA, { errorPolicy: "all" });
  const { formData } = data || {};
  const { name: formName } = form;

  useEffect(() => {
    let { wpNonce } = formData || {};

    let nonce = "";

    wpNonce &&
      wpNonce.some((n) => {
        if ("default" === n.form) {
          nonce = n.wpNonce;
        }

        if (formName === n.form) {
          nonce = n.wpNonce;
          return true;
        }

        return false;
      });

    setState((p) => ({ ...p, nonce }));
  }, [setState, formData, formName]);

  const onFormValueChange = useCallback(
    (field, value) => {
      setFormValues((prev) => ({ ...prev, [field]: value }));
      setFormErrors((prev) => ({
        ...prev,
        [field]: !form.isValid(field, value),
      }));

      setShowRecaptcha((prev) => {
        // Trigger the recaptcha loading.
        if (
          form.form.recaptchaFieldTrigger === field &&
          form.isValid(field, value)
        ) {
          return true;
        } else if (!form.form.recaptchaFieldTrigger) {
          return true;
        }

        return prev;
      });
    },
    [form, setFormValues, setFormErrors, setShowRecaptcha]
  );

  const { nonce, token } = state;

  let successMessage = "";
  let errorMessage = error?.message || "";

  if (mutationData) {
    const { success, errorMessage: eMsg } = form.getMutationData(mutationData);

    if (success) {
      successMessage = "Form submitted. Thank you for your submission.";
    }

    if (eMsg) {
      errorMessage = eMsg;
    }
  }

  return (
    <div className={`lead-form relative ${className}`}>
      {errorMessage && <FormError>{errorMessage}</FormError>}

      {successMessage && (
        <>
          <div className="success-message gold fw7 f6 mb3">
            {successMessage}
          </div>
          <div className="absolute absolute--fill" />
        </>
      )}

      {data?.formData?.recatchaSiteKey && showRecaptcha && (
        <Recaptcha callback={(token) => setState((p) => ({ ...p, token }))} />
      )}

      <div className="form-groups">
        <form.component
          name={form.name}
          fields={form.form.fields}
          errors={formErrors}
          values={formValues}
          updateState={onFormValueChange}
        />
      </div>

      <Button
        form={true}
        loading={loading}
        onClick={() => {
          if (!Object.values(formErrors).includes(true)) {
            const clientMutationId =
              Math.random().toString(36).substring(2) +
              new Date().getTime().toString(36);

            mutation({
              variables: {
                ...formValues,
                clientMutationId,
                wpNonce: nonce,
                gToken: token,
              },
            });
          }
        }}
      >
        {form.getButton()}
      </Button>
    </div>
  );
};

export default LeadForm;
