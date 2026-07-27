/**
 * Global window augmentations for third-party scripts loaded outside the
 * module system (e.g. MSG91's otp-provider.js SDK, loaded via a <script> tag).
 */
export {};

declare global {
  interface Window {
    initSendOTP?: (config: Record<string, unknown>) => void;
  }
}
