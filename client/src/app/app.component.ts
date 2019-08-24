import { Component,OnInit } from '@angular/core';
import { User } from './models/user';
import {  UserService } from './services/user.service';
import { Response } from '@angular/http';
import {GLOBAL} from './services/global'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
 public  title = 'MUSIFY';
 public user: User;
 public identity;
 public token;
 public errorMensaje;
 public user_register: User;
 public alertRegister;
 public url;
constructor(private _userService: UserService){
  this.user = new User('','','','','','ROLE_USER','');
  this.user_register = new User('','','','','','ROLE_USER','');
  this.url = GLOBAL.url;
}
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token=this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

 onSubmit(){
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
                this.user = new User('','','','','','ROLE_USER','');
              //Conseguir el token para enviarselo a cada peticion
            }
            
          },
          error =>{
            var errorMensaje = <any>error;
            
            if(errorMensaje !=null){
              var body = JSON.parse(error._body);
              this.errorMensaje = body.message;
              console.log(error);
             
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
       
      }
    }
 );
}

logout(){
  localStorage.removeItem('identity');
  localStorage.removeItem('token');
  localStorage.clear();
  this.identity=null;
  this.token=null;
}


onSubmitRegister(){
  console.log(this.user_register);
  this._userService.register(this.user_register).subscribe(
    response =>{
        let user = response.user;
        this.user_register = user;
        if(!user._id){
          this.alertRegister = "Error al registrarse";
        }else{
          this.alertRegister = "EL registro se a ha realizado correctamente, identificate con"+this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER','');
        }
    },
    error => {
      var errorMensaje = <any>error;
      
      if(errorMensaje !=null){
        var body = JSON.parse(error._body);
        this.alertRegister = body.message;
        console.log(error);
       
      }
    }
  )
}
}
