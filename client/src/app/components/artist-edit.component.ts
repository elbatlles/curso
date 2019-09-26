import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {UploadService} from '../services/upload.service';
import {Artist} from '../models/artist';
@Component({
    selector:'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers:[UserService,ArtistService,UploadService]
})

export class ArtistEditComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _artistService:ArtistService,
       private _uploadService:UploadService
    ){
        this.titulo="Modificar artista";
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.is_edit =true;
        this.artist = new Artist('','','');
    }
    ngOnInit(){
        console.log("Cargando Artist EDIT11");
        //Llamar al metodo del api para sacar un artista a un artista en base de su id getartist
       
     //GET list artists

     this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params :Params)=> {
            let id= params['id'];
            this._artistService.getArtist(this.token,id).subscribe(
                response =>{
                   
                    if(!response.artist){
                        this._router.navigate(['/'])
                    }else{
                        this.artist = response.artist;
                    }
                },
                error => {
                    var errorMensaje = <any>error;
                    
                    if(errorMensaje !=null){
                      var body = JSON.parse(error._body);
                     // this.alertMessage = body.message;
                      console.log(error);
                     
                    }
                  }
            );
        });
    }
    onSubmit(){
        
        this._route.params.forEach((params :Params)=> {
            let id= params['id'];
       
        this._artistService.editArtist(this.token,id,this.artist).subscribe(
            response =>{
              
                if(!response.artist){
                    this.alertMessage="Error en el servidor";
                }else{
                  //  this.artist = response.artist;
                  if(!this.fileToUpload){
                    this._router.navigate(['/artista',response.artist._id]);
                  }else{
                    this._uploadService.makeFileRequest(this.url+"upload-image-artist/"+id,[],this.fileToUpload,this.token,'image')
                    .then(
                        (result) =>{
                            this._router.navigate(['/artista',response.artist._id]);
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
                  }
                    this.alertMessage="El artista se ha actualizado correctamente";
                    //subir imagen del artista
                 
                 //   this._router.navigate(['/editar-artista'],response.artist._id);
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
    });

        console.log(this.artist);
    }
    public fileToUpload: Array<File>;
    fileChangeEvent(fileInput:any){
        this.fileToUpload=<Array<File>>fileInput.target.files;
    }

}