import {Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import {User} from '../models/user';
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
    ngOnInit(){
        console.log("Cargando user-edit");
     
    }
    constructor(
        private _userService: UserService

    ){
        this.titulo="Actualizar mis datos";
        this.identity = this._userService.getIdentity();
        this.token=this._userService.getToken();
    };

}