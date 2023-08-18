export default {

    oidc: {
        clientId: '0oaaruf9zqCaC1w525d7', // 由 Okta(IdP) 提供的 clientId，用來識別本應用程式
        issuer: 'https://dev-05292609.okta.com/oauth2/default', // 告訴 app 去哪裡(url)驗證用戶身份
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }

}
