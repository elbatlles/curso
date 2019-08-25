import {Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import {User} from '../models/user';
import { Response } from '@angular/http';
import { error } from 'selenium-webdriver';
import {GLOBAL} from '../services/global'
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
    public url: string;
    constructor(
        private _userService: UserService

    ){
        this.titulo="Actualizar mis datos";
        
        //LocalStorage
        this.identity = this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.user = this.identity;
        this.url=GLOBAL.url;
        
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
                        
                        if(!this.fileToUpload){
                            //Redirecion
                        }else{
                            this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.fileToUpload).then(
                                (result:any) => {
                                    this.user.image = result.image;
                                    localStorage.setItem('identity',JSON.stringify(this.user));
                                    console.log(this.user);
                                    let image_path=this.url+"get-image-user/"+this.user.image;
                                    document.getElementById('image-logged').setAttribute('src',image_path);
                                }
                            )
                        }

                       
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

        public fileToUpload : Array<File>;
    fileChangeEvent(fileInput: any){
        this.fileToUpload = <Array<File>>fileInput.target.files; 
       

    }
    makeFileRequest(url: string,params: Array<string>, files:Array<File>){
        var token = this.token;

        return new Promise(function(resolve,reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();
            for(var i =0; i<files.length;i++){
                formData.append('image',files[i],files[i].name);
            }
            xhr.onreadystatechange= function(){
                if(xhr.readyState==4){
                    if(xhr.status==200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                    
                }
            }
            xhr.open('POST',url,true);
            xhr.setRequestHeader('Authorization',token);
            xhr.send(formData);
        });
    }

}