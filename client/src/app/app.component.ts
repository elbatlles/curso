import { Component,OnInit } from '@angular/core';
import { User } from './models/user';
import {  UserServices } from './services/user.services';
import { Response } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserServices]
})
export class AppComponent implements OnInit {
 public  title = 'MUSIFY';
 public user: User;
 public identity;
 public token;

constructor(private _userService: UserServices){
  this.user = new User('','','','','','ROLE_USER','');
}
  ngOnInit(){
 
    
  
  }

public onSubmit(){
  this._userService.singup(this.user).subscribe(
    response =>{
      console.log(response);
      
    },
    error =>{
      var errorMensaje = <any>error;
      if(errorMensaje !=null){
        console.log(error);
      }
    }
 );
}
}
