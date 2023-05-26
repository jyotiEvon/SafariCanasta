import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, ObservableInput, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ModelLocater } from '../modelLocater/modelLocater';
import { LocalDbService } from './local-db.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // httpClient: any;
  errorMsg: string = '';
  localData:any;
  constructor(private httpClient: HttpClient, public model: ModelLocater,private localDb:LocalDbService) {
   
    this.localData = this.localDb.getSessionData();

  }
  // resetLocalDb(){
  //   this.localData={}
  // }

  registerApi(email: any, password: any, username: any,avatar:string): Observable<any> {
    console.log(
      'email ',
      email,
      ' password ',
      password,
      ' username ',
      username,
      'avatar',avatar
    );
    var apiUrl = environment.host + 'auth/register';
    console.log('apiurl', apiUrl);
    // apiUrl = 'http://3.18.57.54:2567/api/auth/register';
      let self = this
    return this.httpClient
      .post(apiUrl, { username: username, email: email, password: password ,avatar:avatar})
      .pipe(
        map((res: any) => res),
        // catchError((err:any)=>this.handlingError(self,err))
      );
  }

 

  login(username: any, password: any) {
    var apiUrl = environment.host + 'auth/login';
    let self = this
    return this.httpClient
      .post(apiUrl, { username: username, password: password })
      .pipe(
        map((res: any) => res),
        // catchError((err:any)=>this.handlingError(self,err))
      );

    // return this.httpClient
    // .post(apiUrl, { username: username, password: password })
   
     
      
   
  }

  //  const headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   Authorization: 'Bearer ' + this.ls.getData('loginDetails').token,
  // });

  // const options = {
  //   headers: headers,
  // };
  // return this.http.post(this.url + 'api/events', data, options);

  getProfileInfo(token:any){

    var apiUrl = environment.host + 'me';
    console.log('lboardApi', apiUrl);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    const options = {
      headers: headers,
    };
   console.log('header',headers,token)
    return this.httpClient.get(apiUrl, options)
    .pipe(map((res: any) => res))
    // catchError((err:any)=>this.handlingError(err))
  }

  updateProfile(
    token:any,
    avatar: string,
    username: string,
    oldpassword?: string,
    newpassword?: string,

   
  ) {
    var apiUrl = environment.host + 'user/updateProfile';
    let self = this
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    console.log('update profile',)
    const options = {
      headers: headers,
    };
    return this.httpClient
      .post(
        apiUrl,
        {
          avatar: avatar,
          username: username,
          oldPassword: oldpassword,
          newPassword: newpassword,
        },
        options
      )
      .pipe(
        map((res: any) => res),
        // catchError((err:any)=>this.handlingError(self,err))
      );
  }

  verificationCode(email: any, code: any) {
    console.log('_verifyEmailApi', email, code);
    var apiUrl = environment.host + 'auth/verifyEmail';
    let self = this
    return this.httpClient
      .post(apiUrl, { email: email, verificationCode: code })
      .pipe(
        map((res: any) => res)
        // catchError(this.handlingError)
      );
  }

  verifyEmail(email: string) {
    console.log('_verifyEmailApi', email);
    var apiUrl = environment.host + 'auth/sendEmailVerificationCode';

    return this.httpClient.post(apiUrl, { email: email }).pipe(
      map((res: any) => res)
      // catchError(this.handlingError)
    );
  }

  resetPassword(email: string, code: string, newPassword: string) {
    console.log('_resetPassword', email, code, newPassword);
    var apiUrl = environment.host + 'auth/resetPassword';
    return this.httpClient
      .post(apiUrl, {
        email: email,
        verificationCode: code,
        newPassword: newPassword,
      })
      .pipe(map((res: any) => res));
  }

  leaderBoard(limit: number,token:any) {
    var apiUrl = environment.host + 'leaderBoard?take=' + limit;
    console.log('lboardApi', apiUrl);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
    const options = {
      headers: headers,
    };
   
    return this.httpClient.get(apiUrl, options).pipe(map((res: any) => res));
  }

  handlingError(err: any) {
    let self = this
    let errorMsg: string = '';
    debugger
    console.log('1_ERRORRRR', err);
    if (err.error.errors instanceof ErrorEvent) {
      self.errorMsg = `Error: ${err.error.message}`;
    } else {
      self.model.authError = this.getServerErrorMessage(err);
      console.log('ERRORRRR..',  self.model.authError);
      // this.setError( this.errorMsg)
    }

    return throwError( self.model.authError);
  } 
  
  private getServerErrorMessage(error: HttpErrorResponse): string {
    
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 401: {
        return error.error.message;
      }
      case 406: {
        return error.error.message;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }
    }
  }


}
