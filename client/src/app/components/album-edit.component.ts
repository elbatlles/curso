import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.services';
import {UploadService} from '../services/upload.service';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
@Component({
    selector:'album-edit',
    templateUrl: '../views/album-add.html',
    providers:[UserService,AlbumService,UploadService]
})

export class AlbumEditComponent implements OnInit{
   
    public titulo: string;

    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public fileToUpload : Array <File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _albumService:AlbumService,
        private _uploadService:UploadService,
        
    ){
        this.titulo="Editar Album";
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album("","",2019,"","");
        this.is_edit=true;
    }
    ngOnInit(): void {
       console.log("component album edit");
       //Conseguir el album
      this.getAlbum();
    }
    getAlbum(){
        this._route.params.forEach((params: Params) =>{
           
            let id = params['album'];
            
            this._albumService.getAlbum(this.token,id).subscribe(
                response =>{
              
                    if(!response.album){
                       // this.alertMessage="Error en el servidor";
                       this._router.navigate(['/']);
                       
                    }else{
                        console.log(response.album);
                        this.album = response.album;
                        
                  }
                },
                error => {
                    var errorMensaje = <any>error;
                    
                    if(errorMensaje !=null){
                        var body = JSON.parse(error._body);
                     
                      console.log(error);
                     
                    }
                  }

            )
        });
    }
    
    onSubmit(){
        this._route.params.forEach((params: Params) =>{
            let id = params['album'];
          
            this._albumService.editAlbum(this.token,id,this.album).subscribe(
          
                response =>{
              
                    if(!response.albumupdate){
                        this.alertMessage="Error en el servidor";
                    }else{
                        this.alertMessage="el album se ha actualizado correctamente";
                      //  this.album = response.albumupdate;
                        if(!this.fileToUpload){
                       //Redirguir
                       this._router.navigate(['/artista',response.albumupdate.artist]);
                        }else{
                            this._uploadService.makeFileRequest(this.url+"upload-image-album/"+id,[],this.fileToUpload,this.token,'image')
                            .then(
                                (result) =>{
                                  // console.log("way");
                                   // console.log(this.album);
                                    this._router.navigate(['/artista',response.albumupdate.artist]);
                                },
                                (error) => {
                                    console.log(error);
                                } 
                                );
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
            
    
      
    });
}

   
    fileChangeEvent(fileInput : any){
        this.fileToUpload =<Array<File>>fileInput.target.files;
    }
}
 