import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class JwtInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('blog-token');

        if (token) {
            return next.handle(req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            }))
        }

        return next.handle(req);
    }
}