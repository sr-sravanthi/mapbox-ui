import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpUrls } from '../services/auth/httpUrl';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.includes(httpUrls.POSTIMAGE)) {
      const headers = new HttpHeaders({
        "Accept": "*/*"
      });

      const options = { reportProgress: true, headers: headers }

      let clone = request.clone(options);
      return next.handle(clone);

    }

    else {
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Accept": "application/json",
        "Access-Control-Allow-Origin" : "*",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",

      });


      let clone = request.clone({ headers: headers });
      return next.handle(clone);
    }


  }
}
