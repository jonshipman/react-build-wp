import React, { Component } from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/react-components';

import PageWidth from './elements/PageWidth';
import { PrimaryClasses } from './elements/Button';

import Config, { USERNAME } from '../config';

/**
 * GraphQL mutation used for logging in
 * Returns an authToken and nickname
 */
const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $username: String!
    $password: String!
    $clientMutationId: String!
  ) {
    login(
      input: {
        clientMutationId: $clientMutationId
        username: $username
        password: $password
      }
    ) {
      authToken
      user {
        nickname
      }
    }
  }
`;

/**
 * Login component that uses a graphql mutation
 */
class Login extends Component {
  state = {
    username: '',
    password: '',
    message: '',
  };

  componentDidMount() {
    const { history } = this.props;
    const redirect = localStorage.getItem('redirect');
    const authToken = Config.getAuthToken();

    if (authToken) {
      if (redirect) {
        localStorage.removeItem('redirect');
        history.push(redirect);
      } else {
        history.push(`/`);
      }
    }
  }

  confirm = async data => {
    const { history } = this.props;
    const { authToken, user } = data.login;
    const redirect = localStorage.getItem('redirect');

    Config.setAuthToken(authToken);
    localStorage.setItem(USERNAME, user.nickname);

    if (redirect) {
      localStorage.removeItem('redirect');
      history.push(redirect);
    } else {
      history.push(`/`);
    }
  };

  handleError = () => {
    const message =
      ' - Sorry, that username and password combination is not valid.';
    this.setState({ message });
  };

  render() {
    const { username, password, message } = this.state;
    const clientMutationId =
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36);
    return (
      <PageWidth className="content">
        <div>
          <h1>Log in</h1>
          <p><strong>Log in to view hidden posts only available to authenticated users.</strong></p>
          <p className="message mb3"><strong>{message}</strong></p>
          <input
            className="db w-100 pa3 mv3 br6 ba b--black"
            value={username}
            onChange={e => this.setState({ username: e.target.value })}
            type="text"
            placeholder="Username"
          />
          <input
            className="db w-100 pa3 mv3 br6 ba b--black"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Password"
          />
          <Mutation
            mutation={LOGIN_MUTATION}
            variables={{ username, password, clientMutationId }}
            onCompleted={data => this.confirm(data)}
            onError={() => this.handleError()}
          >
            {mutation => (
              <button className={`bn ${PrimaryClasses}`} type="button" onClick={mutation}>
                {'Log in'}
              </button>
            )}
          </Mutation>
        </div>
      </PageWidth>
    );
  }
}

export default Login;
