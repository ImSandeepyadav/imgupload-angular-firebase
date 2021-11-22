import { Injectable } from "@angular/core";
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs/operators";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth'; 


@Injectable()
export class AuthenticationGuard {
    user: Observable<firebase.User>;

    constructor(private afauth: AngularFireAuth, private router: Router){
              this.user = afauth.authState;
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ){
         return this.user.pipe(map((auth) => {
             if(!auth){
                 this.router.navigateByUrl('/login');
                 return false;
             }
             return true;
         })).pipe(take(1));
    }

    
}