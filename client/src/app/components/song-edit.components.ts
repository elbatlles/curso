import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.services';
import {SongService} from '../services/song.service';
import {UploadService} from '../services/upload.service';
//import {ArtistService} from '../services/artist.service';
 
import {Artist} from '../models/artist';
//import {Album} from '../models/album';
import {Song} from '../models/song';
@Component({
    selector:'song-edit',
    templateUrl: '../views/song-add.html',
    providers:[UserService,SongService,UploadService]
})

export class SongEditComponent implements OnInit{
   
    public titulo: string;
    public artist: Artist;

    public identity;
    public token;
    public url: string;
    public alertMessage;
    public song: Song;
    public is_edit;
    public fileToUpload;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _songService:SongService,
        private _uploadService:UploadService,
        
   
        
    ){
        this.titulo="Editar Canción";
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,"","","","");
        this.is_edit=true;
      
    }
    ngOnInit(): void {
       console.log("component song edit");
       //sacar cancion a editar
       this.getSong();
    }
    getSong(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];
            this._songService.getSong(this.token,id).subscribe(
                response =>{
                    if(!response.song){
                        this._router.navigate(['/'])
                    }else{
                        this.song= response.song;
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

  onSubmit(){
  
     this._route.params.forEach((params: Params) =>{
            let id = params['id'];
        
            console.log(this.song);
           
             this._songService.updateSong(this.token,id,this.song).subscribe(
                response =>{
                    console.log(response);
                    if(!response.songupdated){
                        this.alertMessage="Error en el servidor";
                    }else{
                        this.song = response.songupdated;
                        this.alertMessage="La canción se ha actualizado correctamente";
                        if(!this.fileToUpload){
                            this._router.navigate(['/album',response.songupdated.album]);
                        }
                            else{
                                this._uploadService.makeFileRequest(this.url+"upload-file-song/"+id,[],this.fileToUpload,this.token,'image')
                                .then(
                                    (result) =>{
                                      // console.log("way");
                                       // console.log(this.album);
                                        this._router.navigate(['/album',response.songupdated.album]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    } 
                                    );
                            }
                       
                     // this._router.navigate(['/editar-album',response.albumStore._id]);
                     //subir el fichero de audio
                    
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

    public fileChangeEvent(fileInput:any){
        this.fileToUpload = <Array<File>>fileInput.target.files;
    }
}