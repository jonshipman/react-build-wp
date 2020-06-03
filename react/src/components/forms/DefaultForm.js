import React from 'react';
import { gql } from '@apollo/client';
import { Field, ErrorMessage } from 'formik';
import { isPhone, isEmail } from '../utils/String';

import FormError from '../elements/FormError';
import Base from './Base';

class Form extends Base {
  name = 'default';

  form = {
    button: 'Contact',
    mutation:
      gql`
        mutation DefaultForm(
          $clientMutationId: String!
          $wpNonce: String!
          $gToken: String
          $yourName: String
          $email: String!
          $phone: String!
          $message: String
        ) {
          defaultFormMutation(
            input: {
              clientMutationId: $clientMutationId
              wpNonce: $wpNonce
              gToken: $gToken
              yourName: $yourName
              email: $email
              phone: $phone
              message: $message
            }
          ) {
              clientMutationId
              success
              errorMessage
            }
        }
      `,
    fields: {
      yourName: {
        component: () => (
          <div className="form-group w-100 mb4 fl-l f5">
            <label htmlFor="yourName" className="fw7 ttu db w-100 mb2 pl2">Full Name</label>
            <Field type="text" id="yourName" name="yourName" placeholder="Your Name" className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2" />
            <ErrorMessage name="yourName" component={FormError} />
          </div>
        ),
        validity: v => {
          return v && v.length > 0;
        },
        errorMessage: 'Required.'
      },
      email: {
        component: () => (
          <div className="form-group mb4 w-100 w-50-l fl-l f5 pr3-l">
            <label htmlFor="email" className="fw7 ttu db w-100 mb2 pl2">Email Address</label>
            <Field type="email" id="email" name="email" placeholder="Your Email" className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2" />
            <ErrorMessage name="email" component={FormError} />
          </div>
        ),
        validity: v => {
          return isEmail(v);
        },
        errorMessage: 'Invalid email address.'
      },
      phone: {
        component: () => (
          <div className="form-group mb4 w-100 w-50-l fl-l f5 pl3-l">
            <label htmlFor="phone" className="fw7 ttu db w-100 mb2 pl2">Phone</label>
            <Field type="text" id="phone" name="phone" placeholder="Your Phone" className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2" />
            <ErrorMessage name="phone" component={FormError} />
          </div>
        ),
        validity: v => {
          return isPhone(v);
        },
        errorMessage: 'Invalid phone number.'
      },
      message: {
        component: () => (
          <div className="form-group w-100 mb4 fl-l f5">
            <label htmlFor="message" className="fw7 ttu db w-100 mb2 pl2">Message</label>
            <Field component="textarea" id="message" name="message" placeholder="Your Message" className="w-100 b--light-silver br0 bb-1 bl-0 br-0 bt-0 pa pl2 pb2 h3" />
            <ErrorMessage name="message" component={FormError} />
          </div>
        ),
        validity: () => {
          return true;
        }
      }
    }
  }

  getMutationData = data => {
    const { defaultFormMutation } = data;
    return defaultFormMutation;
  }
}

export default new Form();
