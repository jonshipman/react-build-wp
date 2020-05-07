
import React, { Component } from 'react';
import { gql, ApolloConsumer } from '@apollo/client';

/**
 * GraphQL query should return the Recaptcha site key as string
 **/
const CHECK_RECAPTCHA = gql`
  query {
    headlessSettings {
      googleSiteKey
    }
  }
`;

const RECAPTCHA_SCRIPT_URL = 'https://recaptcha.net/recaptcha/api.js';
const RECAPTCHA_SCRIPT_REGEX = /(http|https):\/\/(www)?.+\/recaptcha/;
const RECAPTCHA_RECHECK_MS = 300000; // 5 minutes

/**
 * Note: this is not resetting the token
 */

class _resetToken {
  reset() {
    this._reset = true;
  }

  hasBeenReset() {
    return this._reset;
  }

  rearm() {
    this._reset = false;
  }
}

export const resetToken = new _resetToken();

class Recaptcha extends Component {
  constructor(props) {
    super(props);

    this.state = {
      googleSiteKey: null,
      token: null
    }

    this.loaded = false;
    this.built = (new Date().getTime());
  }

  componentDidMount = async () => {
    const { googleSiteKey, token } = this.state;

    if (this.client) {
      if (!googleSiteKey) {
        const result = await this.client.query({
          query: CHECK_RECAPTCHA,
        });

        if (result.data) {
          this.setState({ googleSiteKey: result.data.headlessSettings.googleSiteKey });

          if (result.data.headlessSettings.googleSiteKey && !this.scriptLoaded()) {
            this.loadScript();
          }
        }
      }
    }

    /**
     * This statement will allow the recaptcha to generate a new token after 5 minutes
     * To change the time, change the const RECAPTCHA_RECHECK_MS
     **/
    if (resetToken.hasBeenReset() || (token && (this.built + RECAPTCHA_RECHECK_MS) < (new Date().getTime()))) {
      this.build = (new Date().getTime());
      this.ready();

      if (resetToken.hasBeenReset()) {
        resetToken.rearm();
      }
    }
  }

  fireCallback = () => {
    const { token } = this.state;

    const { callback } = this.props;

    if ( token && callback ) {
      callback(token);
    }
  }

  scriptLoaded = () => {
    if (this.loaded) {
      return true;
    }

    return Array.from(document.scripts).reduce((isPresent, script) => {
      if (isPresent) {
        this.loaded = true;
      }

      return (isPresent ? isPresent : RECAPTCHA_SCRIPT_REGEX.test(script.src))
    },this.loaded);
  }

  loadScript() {
    window._recaptchaLoadingCB = this.ready.bind(this);
    const { googleSiteKey } = this.state;

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `${RECAPTCHA_SCRIPT_URL}?onload=_recaptchaLoadingCB&render=${googleSiteKey}`;
    document.body.appendChild(script);

    this.loaded = true;
  }

  ready() {
    const { grecaptcha } = window;
    const { googleSiteKey } = this.state;

    const _ready = () => {
      grecaptcha.execute(googleSiteKey, {action: 'homepage'}).then(this.processToken.bind(this));
    }

    grecaptcha.ready(_ready.bind(this));
  }

  processToken(token) {
    this.setState({ token });
  }

  render() {
    this.fireCallback();

    return (
      <ApolloConsumer>
        {client => {this.client = client;}}
      </ApolloConsumer>
    );
  }
};

export default Recaptcha;