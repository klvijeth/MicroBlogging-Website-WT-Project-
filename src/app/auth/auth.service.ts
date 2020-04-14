import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class AuthService{
  private isAuthenticated = false;
  private userId:string;
  private email:string;
  private token:string;
  private tokenTimer:any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getUserMail(){
    return this.email;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email:string,password:string){
    const authData: AuthData = {
      email:email,
      password:password
    };
    this.http.post("http://localhost:3000/api/user/signup",authData)
      .subscribe(() => {
        this.router.navigate(['/'])
      },error=>{
        this.authStatusListener.next(false);
        console.log(error);
        alert("User Already exists");
      });
  }

  login(email:string, password:string){
    const authData: AuthData = {
      email:email,
      password:password
    };
    this.http.post<{token:string, expiresIn:number, userId:string}>("http://localhost:3000/api/user/login",authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.email = authData.email;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId, this.email);
          this.router.navigate(['/']);
        }

      },error=>{
        this.authStatusListener.next(false);
        alert(error.error.message);
      });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(expiresIn);
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.email = authInformation.email;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);

    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.email = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number){
    console.log("Setting Timer "+duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration*1000);
  }

  private saveAuthData(token:string, expirationDate: Date, userId:string, email:string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userId',userId);
    localStorage.setItem('email',email);

  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    if(!token || !expirationDate){

      return;
    }
    const data = {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      email: email
    }
    return data;
  }
}
