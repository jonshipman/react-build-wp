import React, { Component } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Formik, Form } from 'formik';

import DefaultForm from '../forms/DefaultForm';
import Loading from './Loading';
import Recaptcha, { resetToken } from '../external-scripts/Recaptcha';
import withApolloClient from '../hoc/withApolloClient';

/**
 * To add a new form - copy ./forms/DefaultForm and pass it as the prop
 * form to the component. Add the form to the wp theme by looking at
 * $themeFolder/inc/form-actions.php.
 */

const FORM_DATA = gql`
  query {
    formData {
      wpNonce {
        form
        wpNonce
      }
      recatchaSiteKey
    }
  }
`;

const Mutation = props => {
  const [
    submitForm,
    results,
  ] = useMutation(
    props.mutation,
    { onCompleted: props.onCompleted, onError: props.onError }
  );

  const onSubmit = opts => {
    submitForm(opts);
  }

  return props.children(onSubmit, results);
}

class LeadForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      showRecaptcha: false
    };

    this.token = '';
    this.nonce = '';
    this.Form = props.form;

    if (!this.Form) {
      this.Form = DefaultForm;
    }

    this.state.formValues = this.Form.buildState();
  }

  componentDidMount() {
    this.executeLocationQuery();
  }

  executeLocationQuery = async () => {
    if (this.props.client) {
      const result = await this.props.client.query({
        query: FORM_DATA,
      });

      const { formValues } = this.state;

      let { wpNonce } = result.data.formData;

      let defaultNonce = '';

      wpNonce.forEach(n => {
        if ( this.Form.name === n.form ) {
          this.nonce = n.wpNonce;
        }

        if ('default' === n.form) {
          defaultNonce = n.wpNonce;
        }
      });

      if (!this.nonce) {
        this.nonce = defaultNonce;
      }

      if (this.props.isMounted()) {
        this.setState({ formValues });
      }
    }
  };

  executeValidation = (values) => {
    const errors = {};

    Object.entries(values).map(([key, value]) => {
      let valid = this.Form.isValid(key, value);

      if (!valid) {
        errors[key] = this.Form.getError(key);
      }

      return null;
    });

    this.setState({ showRecaptcha: this.Form.triggerRecaptcha(values) });

    return errors;
  }

  processToken = token => {
    this.token = token;
  }

  render() {
    const { formValues, showRecaptcha } = this.state;
    const { className } = this.props;

    let localMutation = this.Form.getMutation();
    let localErrorMessage = '';
    let localSuccessMessage = '';

    return (
      <div className={`lead-form relative ${className || ''}`}>
        <Mutation mutation={localMutation}>
          {(mutation, { loading, data }) => {
            if (data) {
              const { success, errorMessage } = this.Form.getMutationData(data);

              if (success) {
                resetToken.reset();
                localSuccessMessage = "Form submitted. Thank you for your submission.";
              }

              if (errorMessage) {
                localErrorMessage = errorMessage;
              }
            }

            return (
              <Formik
              initialValues={formValues}
                validate={this.executeValidation}
                onSubmit={values => {
                  values.gToken = this.token;
                  values.wpNonce = this.nonce;
                  values.clientMutationId = this.token + this.nonce;

                  mutation({ variables: values });
                }}
              >
                <Form>
                  {localErrorMessage && (
                    <div className="error-message red fw7 f7 mb3">{localErrorMessage}</div>
                  )}

                  {localSuccessMessage && (
                    <>
                      <div className="success-message green fw7 f6 mb3">{localSuccessMessage}</div>
                      <div className="absolute absolute--fill"/>
                    </>
                  )}

                  {showRecaptcha && (
                    <Recaptcha callback={this.processToken}/>
                  )}

                  <div className="form-groups">
                    <this.Form.component />
                  </div>

                  {loading
                  ? <Loading />
                  : (
                    <button className="pointer f6 link bg-animate hover-bg-blue br2 ph4 pv2 mb2 dib white bg-green bn" type="submit" disabled={loading}>
                      {this.Form.getButton()}
                    </button>
                  )}
                </Form>
              </Formik>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withApolloClient(LeadForm);
