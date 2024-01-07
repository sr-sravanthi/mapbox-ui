import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Accept": "application/json",
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",


    });
    let clone = request.clone({ headers: headers });
    return next.handle(clone);
  }
}
