import {Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import {User} from '../models/user';
import { Response } from '@angular/http';
import { error } from 'selenium-webdriver';
@Component({
   
    selector:'user-edit',
    templateUrl: '../views/user-edit.html',
    providers:[UserService]

})

export class UserEditComponent implements OnInit{
    public titulo: string;
    public user:User;
    public token;
    public identity;
    public alertMessage;
    constructor(
        private _userService: UserService

    ){
        this.titulo="Actualizar mis datos";
        
        //LocalStorage
        this.identity = this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.user = this.identity;
        
    };
    ngOnInit(){
        console.log("Cargando user-edit");
     
    }
    onSubmit(){
        
        
        this._userService.updateUser(this.user).subscribe(
            response =>{
                
                    if(!response){
                        this.alertMessage = "El usuario no se a actualizado";
                    }else{
                       // this.user = response.user;
                        localStorage.setItem('identity',JSON.stringify(this.user));
                        document.getElementById('identity_name').innerHTML=this.user.name;
                        this.alertMessage = "Datos actualizados correctamente";
                    }
            },
            error => {
                var errorMensaje = <any>error;
                
                if(errorMensaje !=null){
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                  console.log(error);
                 
                }
              }
        );
        console.log(this.user);
    }

}