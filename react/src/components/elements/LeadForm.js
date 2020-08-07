import React, { useState, useEffect, useCallback } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import DefaultForm from "../forms/DefaultForm";
import LoadingError from "./LoadingError";
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

export default ({ form = DefaultForm, className = "" }) => {
  const [state, setState] = useState({
    formValues: form.buildState(),
    showRecaptcha: false,
    nonce: "",
    token: "",
  });

  const [mutation, { loading, data: mutationData }] = useMutation(
    form.getMutation()
  );
  const { data, error } = useQuery(FORM_DATA, { errorPolicy: "all" });
  const { formValues, showRecaptcha, nonce, token } = state;
  const { formData } = data || {};

  useEffect(() => {
    let { wpNonce } = formData || {};

    let nonce = "";

    wpNonce &&
      wpNonce.some((n) => {
        if ("default" === n.form) {
          nonce = n.wpNonce;
        }

        if (form.name === n.form) {
          nonce = n.wpNonce;
          return true;
        }

        return false;
      });

    setState((p) => ({ ...p, nonce }));
  }, [setState, formData, form.name]);

  const validate = useCallback(
    (key, value) => {
      const valid = form.isValid(key, value);

      if (!valid) {
        form.setError(key);
      } else {
        form.removeError(key);
      }

      // Trigger the recaptcha loading.
      setState((p) => ({
        ...p,
        showRecaptcha: form.triggerRecaptcha(key, value),
      }));
    },
    [form, setState]
  );

  let successMessage = "";
  let errorMessage = error?.message || "";
  let resetRecaptcha = 1;

  if (mutationData) {
    const { success, errorMessage: eMsg } = form.getMutationData(mutationData);

    if (success) {
      resetRecaptcha++;
      successMessage = "Form submitted. Thank you for your submission.";
    }

    if (eMsg) {
      errorMessage = eMsg;
    }
  }

  return (
    <div className={`lead-form relative ${className}`}>
      {errorMessage && <LoadingError error={errorMessage} />}

      {successMessage && (
        <>
          <div className="success-message gold fw7 f6 mb3">
            {successMessage}
          </div>
          <div className="absolute absolute--fill" />
        </>
      )}

      {showRecaptcha && (
        <Recaptcha
          reset={resetRecaptcha}
          callback={(token) => setState((p) => ({ ...p, token }))}
        />
      )}

      <div className="form-groups">
        <form.component
          values={formValues}
          updateState={(field, value) => {
            setState((prev) => {
              validate(field, value);

              prev.formValues[field] = value;
              return prev;
            });
          }}
        />
      </div>

      <Button
        form={true}
        loading={loading}
        onClick={() => {
          if (form.noErrors()) {
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
