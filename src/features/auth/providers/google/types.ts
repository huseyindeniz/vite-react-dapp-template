export interface GoogleOAuth2CodeClientConfig {
  client_id: string;
  scope: string;
  ux_mode?: 'popup' | 'redirect';
  redirect_uri?: string;
  callback?: (response: GoogleOAuth2CodeResponse) => void;
  error_callback?: (error: GoogleOAuth2Error) => void;
}

export interface GoogleOAuth2CodeClient {
  requestCode: () => void;
}

export interface GoogleOAuth2CodeResponse {
  code: string;
  scope: string;
  authuser?: string;
  prompt?: string;
}

export interface GoogleOAuth2Error {
  type: string;
  instance?: string;
}

export interface GoogleIdConfiguration {
  client_id: string;
  callback?: (credentialResponse: GoogleIdCredentialResponse) => void;
  error_callback?: (error: { type?: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
}

export interface GoogleIdCredentialResponse {
  credential: string;
  select_by: string;
}

export interface GoogleIdRenderButtonOptions {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string | number;
  locale?: string;
  click_listener?: () => void;
}

export interface PromptMomentNotification {
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
  getDismissedReason?: () =>
    | 'credential_returned'
    | 'cancel_called'
    | 'flow_restarted';
  getSkippedReason?: () =>
    | 'auto_cancel'
    | 'user_cancel'
    | 'tap_outside'
    | 'issuing_failed';
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

export interface GoogleUserProfile {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale?: string;
  iat: number;
  exp: number;
}