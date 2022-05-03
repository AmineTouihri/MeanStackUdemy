import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()

export class authInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token=this.authService.getToken();
        const authRequest=req.clone({   
            headers:req.headers.set("authorization","bearer "+token)
        });
        return next.handle(authRequest)
    }
    
}