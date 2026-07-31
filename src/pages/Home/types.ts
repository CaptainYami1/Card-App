export type Card = {
  id: string;
  maskedPan: string;
  cardholder?: string;
  expiry: string;
  scheme?: string;
  imageBytes?: string;
  imageContentType?: string;
  activeWindowExpiresAt?: string | null;
};
