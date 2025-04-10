import { AuthConfig } from 'angular-oauth2-oidc';

export const googleAuthConfig: AuthConfig = {

  issuer: 'https://accounts.google.com',
  redirectUri: window.location.origin+'/main',
  clientId: '134835713500-1comacmoj0a9tas4v8icrt6gb9ga70p1.apps.googleusercontent.com',
  responseType: 'id_token token',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: true,
  useSilentRefresh: true,
  clearHashAfterLogin: true,
  oidc: true
};