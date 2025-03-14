import { getRequestConfig } from "next-intl/server";
import { IntlErrorCode } from "next-intl";

export default getRequestConfig(async () => {
  const locale = "en";

  return {
    locale,
    messages: (await import(`../../public/locales/${locale}/common.json`))
      .default,
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Missing translations are expected and should only log an error
        console.error(error);
      }
    },

    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join(".");

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return `${path} is not yet translated`;
      }

      return `Dear developer, please fix this message: ${path}`;
    },
  };
});
