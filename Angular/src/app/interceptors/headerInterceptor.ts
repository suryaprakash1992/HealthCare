
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  private AUTH_HEADER = "Authorization";
  private token = "";

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger;
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }
    if(req.url=='https://localhost:44379/register' || req.url=='https://localhost:44379/signin'){
      debugger;
      console.log(req);
    }
    else{
      debugger;
        req = this.addAuthenticationToken(req);
    }   
    
    console.log(req);
    return next.handle(req);

  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    this.token=localStorage.getItem('token');
    // should add authorization token into headers except login and signup
    debugger;
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + this.token)
    });

    
  }

}

