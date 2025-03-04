## API Report File for "@bentley/frontend-authorization-client"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { AccessToken } from '@bentley/itwin-client';
import { AuthorizationClient } from '@bentley/itwin-client';
import { BeEvent } from '@bentley/bentleyjs-core';
import { ClientRequestContext } from '@bentley/bentleyjs-core';
import { IDisposable } from '@bentley/bentleyjs-core';
import { User } from 'oidc-client';
import { UserManager } from 'oidc-client';
import { UserManagerSettings } from 'oidc-client';

// @beta
export class BrowserAuthorizationCallbackHandler extends BrowserAuthorizationBase<BrowserAuthorizationCallbackHandlerConfiguration> {
    // (undocumented)
    protected getUserManager(): Promise<UserManager>;
    protected getUserManagerSettings(basicSettings: BrowserAuthorizationCallbackHandlerConfiguration, advancedSettings?: UserManagerSettings): Promise<UserManagerSettings>;
    static handleSigninCallback(redirectUrl: string): Promise<void>;
    }

// @beta (undocumented)
export interface BrowserAuthorizationCallbackHandlerConfiguration {
    responseMode?: "query" | "fragment" | string;
}

// @beta (undocumented)
export class BrowserAuthorizationClient extends BrowserAuthorizationBase<BrowserAuthorizationClientConfiguration> implements FrontendAuthorizationClient, IDisposable {
    constructor(configuration: BrowserAuthorizationClientConfiguration);
    // (undocumented)
    protected _accessToken?: AccessToken;
    checkSessionStatus(requestContext: ClientRequestContext): Promise<boolean>;
    protected createUserManager(settings: UserManagerSettings): UserManager;
    dispose(): void;
    getAccessToken(requestContext?: ClientRequestContext): Promise<AccessToken>;
    // (undocumented)
    protected getUserManager(requestContext: ClientRequestContext): Promise<UserManager>;
    protected getUserManagerSettings(requestContext: ClientRequestContext, basicSettings: BrowserAuthorizationClientConfiguration, advancedSettings?: UserManagerSettings): Promise<UserManagerSettings>;
    // (undocumented)
    get hasExpired(): boolean;
    // (undocumented)
    get hasSignedIn(): boolean;
    // (undocumented)
    protected initAccessToken(user: User | undefined): void;
    // (undocumented)
    get isAuthorized(): boolean;
    protected loadUser(requestContext: ClientRequestContext): Promise<User | undefined>;
    protected nonInteractiveSignIn(requestContext: ClientRequestContext): Promise<User | undefined>;
    protected _onAccessTokenExpired: () => void;
    protected _onAccessTokenExpiring: () => Promise<void>;
    protected _onSilentRenewError: () => void;
    protected _onUserLoaded: (user: User) => void;
    protected _onUserSignedOut: () => void;
    // (undocumented)
    readonly onUserStateChanged: BeEvent<(token?: AccessToken | undefined) => void>;
    // (undocumented)
    protected _onUserStateChanged: (user: User | undefined) => void;
    protected _onUserUnloaded: () => void;
    signIn(requestContext?: ClientRequestContext): Promise<void>;
    signInPopup(requestContext: ClientRequestContext): Promise<void>;
    signInRedirect(requestContext: ClientRequestContext, successRedirectUrl?: string): Promise<void>;
    signInSilent(requestContext: ClientRequestContext): Promise<void>;
    signOut(requestContext?: ClientRequestContext): Promise<void>;
    // (undocumented)
    signOutPopup(requestContext: ClientRequestContext): Promise<void>;
    // (undocumented)
    signOutRedirect(requestContext: ClientRequestContext): Promise<void>;
}

// @beta (undocumented)
export interface BrowserAuthorizationClientConfiguration {
    readonly authority?: string;
    readonly clientId: string;
    readonly noSilentSignInOnAppStartup?: boolean;
    readonly postSignoutRedirectUri?: string;
    readonly redirectUri: string;
    readonly responseType?: "code" | "id_token" | "id_token token" | "code id_token" | "code token" | "code id_token token" | string;
    readonly scope: string;
}

// @beta (undocumented)
export interface FrontendAuthorizationClient extends AuthorizationClient {
    readonly hasSignedIn: boolean;
    readonly onUserStateChanged: BeEvent<(token: AccessToken | undefined) => void>;
    signIn(requestContext?: ClientRequestContext): Promise<void>;
    signOut(requestContext?: ClientRequestContext): Promise<void>;
}

// @beta
export const isFrontendAuthorizationClient: (client: AuthorizationClient | undefined) => client is FrontendAuthorizationClient;

// @beta (undocumented)
export enum OidcCallbackResponseMode {
    // (undocumented)
    Fragment = 2,
    // (undocumented)
    Query = 1,
    Unknown = 3
}


// (No @packageDocumentation comment for this package)

```
