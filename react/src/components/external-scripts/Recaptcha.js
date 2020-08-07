import { useState, useEffect, useCallback, useRef } from "react";
import { gql, useQuery } from "@apollo/client";

/**
 * GraphQL query should return the Recaptcha site key as string
 **/
const CHECK_RECAPTCHA = gql`
  query Recaptcha {
    formData {
      id
      recatchaSiteKey
    }
  }
`;

const RECAPTCHA_SCRIPT_URL = "https://recaptcha.net/recaptcha/api.js";
const RECAPTCHA_SCRIPT_REGEX = /(http|https):\/\/(www)?.+\/recaptcha/;
const RECAPTCHA_RECHECK_MS = 300000; // 5 minutes

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

export default ({ callback = () => {}, reset = 1 }) => {
  const [key, setKey] = useState();
  const [token, setToken] = useState();
  const [built, setBuilt] = useState(new Date().getTime());
  const [loaded, setLoaded] = useState(false);

  // Sets up the previous reset key.
  const prevReset = useRef();
  useEffect(() => {
    prevReset.current = reset;
  });

  const { data } = useQuery(CHECK_RECAPTCHA);

  // grecaptcha callback.
  const onLoad = useCallback(() => {
    const { grecaptcha } = window;

    const _ready = () => {
      grecaptcha
        .execute(key, { action: "homepage" })
        .then((token) => setToken(token))
        .catch((e) => {
          console.error("Recaptcha error", e);
        });
    };

    grecaptcha.ready(_ready);
  }, [key, setToken]);

  // Loads the script in the browser.
  const loadScript = useCallback(() => {
    window._recaptchaLoadingCB = onLoad;

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `${RECAPTCHA_SCRIPT_URL}?onload=_recaptchaLoadingCB&render=${key}`;
    document.body.appendChild(script);

    setLoaded(true);
  }, [key, onLoad, setLoaded]);

  // Checks to see if recaptcha has loaded.
  const scriptLoaded = useCallback(() => {
    if (loaded) {
      return true;
    }

    return Array.from(document.scripts).reduce((isPresent, script) => {
      if (isPresent) {
        resetToken.setLoaded(true);
      }

      return isPresent ? isPresent : RECAPTCHA_SCRIPT_REGEX.test(script.src);
    }, loaded);
  }, [loaded]);

  // Load scripts.
  useEffect(() => {
    if (key) {
      if (!scriptLoaded()) {
        loadScript();
      }
    }
  }, [key, scriptLoaded, loadScript]);

  // Add the googe key to the state.
  useEffect(() => {
    if (data?.formData?.recatchaSiteKey) {
      setKey(data.formData.recatchaSiteKey);
    }
  }, [setKey, data]);

  // Fire any passed callbacks.
  useEffect(() => {
    callback(token);
  }, [token, callback]);

  // Rearming.
  useEffect(() => {
    const rearm = () => {
      setBuilt(new Date().getTime());
      setToken(null);
      onLoad();
    };

    let interval = setInterval(() => {
      if (token && built + RECAPTCHA_RECHECK_MS < new Date().getTime()) {
        rearm();
      }
    }, RECAPTCHA_RECHECK_MS - 100);

    if (prevReset.current !== reset && token) {
      rearm();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token, built, setBuilt, onLoad, reset, setToken, prevReset]);

  return null;
};
