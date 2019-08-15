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
 public errorMensaje;

constructor(private _userService: UserServices){
  this.user = new User('','','','','','ROLE_USER','');
}
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token=this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

public onSubmit(){
  //Conseguir los datos del usuario identificado
  this._userService.singup(this.user).subscribe(
    response =>{
      let identity = response.user;
      this.identity = identity;
      if(!this.identity._id){
        alert("El usuario no esta correctamente identificado");
      }else{
        //SESSION crear elemento en localstorage para tener el usuario en sesión
          localStorage.setItem('identity',JSON.stringify(identity));
        //Conseguir el token para enviarselo a cada peticion http
        this._userService.singup(this.user,'true').subscribe(
          response =>{
            let token = response.token;
            this.token = token;
            if(this.token.length <=0 ){
              alert("El token no se ha generado");
            }else{

              //SESSION crear elemento en localstorage para tener disponible
              console.log("genera token");
                console.log(token);
                console.log(identity);
                localStorage.setItem('token',token);
              //Conseguir el token para enviarselo a cada peticion
            }
            
          },
          error =>{
            var errorMensaje = <any>error;
            
            if(errorMensaje !=null){
              var body = JSON.parse(error._body);
              this.errorMensaje = body.message;
              console.log(error);
              console.log("batlless?");
            }
          }
       );
        //Conseguir el token para enviarselo a cada peticion
      }
      
    },
    error =>{
      var errorMensaje = <any>error;
      
      if(errorMensaje !=null){
        var body = JSON.parse(error._body);
        this.errorMensaje = body.message;
        console.log(error);
        console.log("batlless?");
      }
    }
 );
}
}
