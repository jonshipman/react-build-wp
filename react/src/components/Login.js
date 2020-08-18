import React, { useState, useEffect, useCallback } from "react";
import { Link, Switch, Route, useHistory, useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import Button from "./elements/Button";
import Config from "../config";
import Input from "./elements/Input";
import PageWidth from "./elements/PageWidth";

// Login Mutation.
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

// Registration Mutation.
const REGISTRATION = gql`
  mutation RegisterMutation(
    $clientMutationId: String!
    $username: String!
    $email: String!
  ) {
    registerUser(
      input: {
        clientMutationId: $clientMutationId
        username: $username
        email: $email
      }
    ) {
      user {
        id
        name
      }
    }
  }
`;

// Forgot Password Mutation.
const FORGOTPASS = gql`
  mutation ForgotPasswordMutation(
    $clientMutationId: String!
    $username: String!
  ) {
    sendPasswordResetEmail(
      input: { clientMutationId: $clientMutationId, username: $username }
    ) {
      user {
        id
      }
    }
  }
`;

// Reset Password Mutation.
const RESETPASS = gql`
  mutation ForgotPasswordMutation(
    $clientMutationId: String!
    $key: String!
    $login: String!
    $password: String!
  ) {
    resetUserPassword(
      input: {
        clientMutationId: $clientMutationId
        key: $key
        login: $login
        password: $password
      }
    ) {
      user {
        id
      }
    }
  }
`;

const generatePassword = (props) => {
  const { length = 12, specialChars = true, extraSpecialChars = false } =
    props || {};
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (specialChars) {
    chars += "!@#$%^&*()";
  }
  if (extraSpecialChars) {
    chars += "-_ []{}<>~`+=,.;:/?|";
  }

  const max = chars.length;
  const min = 0;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.substr(Math.floor(Math.random() * (max - min) + min), 1);
  }

  return password;
};

const useLogin = ({ setMessage = () => true }) => {
  const history = useHistory();

  useEffect(() => {
    const redirect = Config.getRedirect();
    const authToken = Config.getAuthToken();

    if (authToken) {
      if (redirect) {
        Config.removeRedirect();
        history.push(redirect);
      } else {
        history.push("/dashboard");
      }
    }
  }, [history]);

  const confirm = useCallback(
    (data) => {
      const { authToken } = data?.login || {};
      if (authToken) {
        const redirect = Config.getRedirect();

        Config.setAuthToken(authToken);

        if (redirect) {
          Config.removeRedirect();
          history.push(redirect);
        } else {
          history.push("/dashboard");
        }
      }
    },
    [history]
  );

  const [mutation, { error, loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: confirm,
    errorPolicy: "all",
  });

  useEffect(() => {
    if (error && "Internal server error" !== error.message) {
      setMessage(error);
    }
  }, [error, setMessage]);

  const clientMutationId =
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

  return {
    login: (username, password) =>
      mutation({ variables: { username, password, clientMutationId } }),
    loading,
  };
};

const LoginRender = ({ setMessage }) => {
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const { login, loading } = useLogin({ setMessage });

  const { username, password } = state;

  return (
    <div>
      <Input
        className="f4"
        value={username}
        onChange={(username) => setState((p) => ({ ...p, username }))}
        onEnter={() => login(username, password)}
        placeholder="Username or Email Address"
      />

      <Input
        className="f4"
        value={password}
        onChange={(password) => setState((p) => ({ ...p, password }))}
        onEnter={() => login(username, password)}
        type="password"
        placeholder="Password"
      />

      <Button
        loading={loading}
        className="db tc"
        onClick={() => login(username, password)}
      >
        Log In
      </Button>

      <div className="mt3 tc tl-l flex-l justify-between-l">
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/register" className="db mt3 mt0-l">
          Sign up for an Account
        </Link>
      </div>
    </div>
  );
};

const ForgotPasswordRender = ({ setMessage }) => {
  const [state, setState] = useState({
    username: "",
    clientMutationId:
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36),
  });

  const confirm = () => {
    const message = "Check your email for a password recovery email.";
    setMessage(message);
  };

  const [mutation, { error, loading }] = useMutation(FORGOTPASS, {
    onCompleted: confirm,
    errorPolicy: "all",
  });

  useEffect(() => {
    if (error && "Internal server error" !== error.message) {
      setMessage(error);
    }
  }, [error, setMessage]);

  const { username } = state;

  return (
    <div>
      <Input
        className="f4"
        value={username}
        onChange={(username) => setState((p) => ({ ...p, username }))}
        onEnter={() => mutation({ variables: state })}
        placeholder="Username"
      />

      <Button
        loading={loading}
        className="db tc"
        onClick={() => mutation({ variables: state })}
      >
        Request New Password
      </Button>

      <BackToLogin />
    </div>
  );
};

const RegisterRender = ({ setMessage }) => {
  const [state, setState] = useState({
    username: "",
    email: "",
    clientMutationId:
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36),
  });

  const confirm = () => {
    const message = "Registered! Please check your email for confirmation.";
    setMessage(message);
  };

  const [mutation, { error, loading }] = useMutation(REGISTRATION, {
    onCompleted: confirm,
    errorPolicy: "all",
  });

  useEffect(() => {
    if (error && "Internal server error" !== error.message) {
      setMessage(error);
    }
  }, [error, setMessage]);

  const { username, email } = state;

  return (
    <div>
      <Input
        className="f4"
        value={username}
        onChange={(username) => setState((p) => ({ ...p, username }))}
        onEnter={() => mutation({ variables: state })}
        placeholder="Username"
      />

      <Input
        className="f4"
        value={email}
        onChange={(email) => setState((p) => ({ ...p, email }))}
        onEnter={() => mutation({ variables: state })}
        type="email"
        placeholder="Email"
      />

      <Button
        loading={loading}
        className="db tc"
        onClick={() => mutation({ variables: state })}
      >
        Register
      </Button>

      <BackToLogin />
    </div>
  );
};

const ResetPasswordRender = ({ setMessage }) => {
  const { key, login } = useParams();

  const [state, setState] = useState({
    login,
    key,
    password: generatePassword(),
    clientMutationId:
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36),
  });

  const { login: loginMutation } = useLogin({ setMessage });

  const confirm = useCallback(() => {
    loginMutation(state.login, state.password);
  }, [loginMutation, state]);

  const [mutation, { error, loading }] = useMutation(RESETPASS, {
    onCompleted: confirm,
    errorPolicy: "all",
  });

  useEffect(() => {
    if (error && "Internal server error" !== error.message) {
      setMessage(error);
    }
  }, [error, setMessage]);

  const { password } = state;

  return (
    <div>
      <div className="mb2">Enter Your New Password:</div>

      <Input
        className="f4"
        value={password}
        onChange={(password) => setState((p) => ({ ...p, password }))}
        onEnter={() => mutation({ variables: state })}
      />

      <Button
        loading={loading}
        className="db tc"
        onClick={() => mutation({ variables: state })}
      >
        Login
      </Button>

      <BackToLogin />
    </div>
  );
};

const BackToLogin = () => (
  <Link to="/login" className="db tr mt3">
    &lt; Back to Login
  </Link>
);

export default function Login() {
  const [message, setMessage] = useState("");

  return (
    <PageWidth className="login">
      <div>
        <h1>Log in</h1>

        <div
          className="message mb3"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: message }}
        />

        <Switch>
          <Route exact path="/register">
            <RegisterRender setMessage={setMessage} />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPasswordRender setMessage={setMessage} />
          </Route>
          <Route exact path="/rp/:key/:login">
            <ResetPasswordRender setMessage={setMessage} />
          </Route>
          <Route path="*">
            <LoginRender setMessage={setMessage} />
          </Route>
        </Switch>
      </div>
    </PageWidth>
  );
}
