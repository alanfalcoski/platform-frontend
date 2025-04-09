import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/main',
  clientId: '134835713500-n8inkp6mg1l5n6bk4ng637r5lqvl6gft.apps.googleusercontent.com',
  scope: 'openid profile email',
  showDebugInformation: true
};

export const microsoftAuthConfig: AuthConfig = {
  issuer: 'https://login.microsoftonline.com/62c7b02d-a95c-498b-9a7f-6e00acab728d/v2.0',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/main',
  clientId: '31fb7c32-e7db-48fc-a5f1-a80ae1b279cd',
  scope: 'openid profile email',
  oidc: true,
  showDebugInformation: true,
  responseType: 'code',
  customQueryParams: {
    domain_hint: 'senior.com.br'
  }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService, private router: Router) {
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        console.debug('Token recebido:', this.oauthService.getAccessToken());
      }
      if (event.type === 'token_error') {
        console.error('Erro no token:', event);
      }
    });
  }

  async configureAuth(provider: 'google' | 'microsoft') {
    const config = provider === 'google' ? googleAuthConfig : microsoftAuthConfig;
    this.oauthService.configure(config);

    // Carrega o discovery document apenas uma vez
    await this.oauthService.loadDiscoveryDocument().catch(err => {
      console.error('Discovery document failure:', err);
      throw err;
    });
  }

  login() {
    this.oauthService.initLoginFlow(); // redireciona
  }

  getInfos(){
    return this.oauthService.getIdentityClaims();
  }

  logout() {
    this.oauthService.logOut();
    localStorage.removeItem('auth_provider');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}