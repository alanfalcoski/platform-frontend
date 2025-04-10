import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import {googleAuthConfig} from '../../services/authentication/google-config';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(googleAuthConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.oauthService.loadUserProfile();
      }
    });
  
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe(() => {
        this.oauthService.loadUserProfile();
      });
  }

  get userName(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return "null";
    return claims['given_name'];
  }

  get userEmail(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return "null";
    return claims['email'];
  }

  get userPicture(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return "null";
    return claims['picture'];
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  login() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((loggedIn) => {
      if (loggedIn) {
        this.oauthService.loadUserProfile(); // carrega claims
      } else {
        this.oauthService.initCodeFlow(); // redireciona para login
      }
    });
  }

  logout() {
    this.oauthService.logOut();
  } 
  refresh() {
    this.oauthService.refreshToken();
  }
  get hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
  get events() {
    return this.oauthService.events;
  }
}
