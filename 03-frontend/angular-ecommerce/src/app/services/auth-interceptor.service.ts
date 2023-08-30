import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }
  
  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // 只添加一個 access token 去存取 protected endpoints
    const theEndpoint = environment.ecommerceApiUrl + '/orders';
    const securedEndpoints = [theEndpoint];

    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
      // get access token
      const accessToken = this.oktaAuth.getAccessToken();

      // 複製 request - 因爲是 immutable
      // 將 access token 放進 header
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken // 確保 Bearer 後面有空一格
        }
      });
    }

    return await lastValueFrom(next.handle(req));
  }
}
