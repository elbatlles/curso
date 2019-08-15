import { Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
@Injectable()
export class UserServices{
    public url: string;
    public identity: string;
    public token: string;
    constructor(private _http: Http){
        this.url =GLOBAL.url
    }

    singup(user_to_login,gethash = null){
        
        if(gethash !=null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        console.log(params);
        let headers = new Headers({'Content-Type':'application/json'});

        return this._http.post(this.url+'login',params,{headers})
        .map(res=> res.json());
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        console.log(identity);
        if(identity!='undefined'){
            this.identity=identity;
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');
        console.log(token);
        if(token!="undefined"){
            this.token =token;
        }else{
            this.token=null;
        }
        return this.token;
    }
}