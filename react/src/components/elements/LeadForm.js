import React from "react";

import Button from "./Button";
import DefaultForm from "../forms/DefaultForm";
import FormError from "./FormError";
import Recaptcha from "../external-scripts/Recaptcha";
import useForm from "../hooks/useForm";

/**
 * To add a new form - copy ./forms/DefaultForm and pass it as the prop
 * form to the component. Add the form to the wp theme by looking at
 * $themeFolder/inc/form-actions.php.
 */
const LeadForm = ({ form = DefaultForm, className = "" }) => {
  const {
    fields,
    formErrors,
    formName,
    FormRender,
    formValues,
    getButton,
    messageError,
    messageSuccess,
    mutation,
    mutationLoading,
    nonce,
    onFormValueChange,
    recatchaSiteKey,
    setToken,
    showRecaptcha,
    token,
  } = useForm({ form });

  return (
    <div className={`lead-form relative ${className}`}>
      {messageError && <FormError>{messageError}</FormError>}

      {messageSuccess && (
        <>
          <div className="success-message gold fw7 f6 mb3">
            {messageSuccess}
          </div>
          <div className="absolute absolute--fill" />
        </>
      )}

      {recatchaSiteKey && showRecaptcha && (
        <Recaptcha callback={(token) => setToken(token)} />
      )}

      <div className="form-groups">
        <FormRender
          name={formName}
          fields={fields}
          errors={formErrors}
          values={formValues}
          updateState={onFormValueChange}
        />
      </div>

      <Button
        form={true}
        loading={mutationLoading}
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
        {getButton()}
      </Button>
    </div>
  );
};

export default LeadForm;
