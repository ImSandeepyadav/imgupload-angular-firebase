import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from 'firebase/app';
import { Observable } from "rxjs";
import { User } from '../models/user.model';


@Injectable()
export class AuthenticationService {
    private User: Observable<firebase.User>;

    constructor(private afAuth: AngularFireAuth){
        this.User = afAuth.authState;

    }

    login(user: User){
        return this.afAuth.signInWithEmailAndPassword(user.email, user.password);

    }
    logout(){
        return this.afAuth.signOut();
    }

    authUser(){
        return this.User;
    }
}