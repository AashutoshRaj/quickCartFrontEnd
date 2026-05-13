/**
 * Professional MSG91 SendOTP Utility
 */

export const initMsg91Widget = ({
  phoneNumber,
  onSuccess,
  onFailure,
}) => {
  const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID;

  const tokenAuth = import.meta.env.VITE_MSG91_TOKEN_AUTH;

  // Validate ENV
  if (!widgetId || !tokenAuth) {
    console.error(
      "MSG91 Configuration Error: Missing Widget ID or Token Auth"
    );

    return;
  }

  // Check SDK Loaded
  if (typeof window.initSendOTP !== "function") {
    console.error(
      "MSG91 SDK Error: otp-provider.js not loaded"
    );

    return;
  }

  // Remove spaces/special chars
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  // Add country code
  const formattedPhone = cleanPhone.startsWith("91")
    ? cleanPhone
    : `91${cleanPhone}`;

  // Widget Config
  const widgetConfig = {
    widgetId,
    tokenAuth,

    identifier: formattedPhone,

    exposeMethods: true,

    success: (data) => {
      console.log("MSG91 Success:", data);

      // access token
      const accessToken = data.message;

      if (onSuccess) {
        onSuccess(accessToken);
      }
    },

    failure: (error) => {
      console.error("MSG91 Failure:", error);

      if (onFailure) {
        onFailure(error);
      }
    },
  };

  // Open Widget
  window.initSendOTP(widgetConfig);
};