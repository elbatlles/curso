import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.services';
import { SongService } from 'app/services/song.service';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
import {Song} from '../models/song';

@Component({
    selector:'album-detail',
    templateUrl: '../views/album-detail.html',
    providers:[UserService,AlbumService,SongService]
})

export class AlbumDetailComponent implements OnInit{
    public titulo: string;
    public album:Album; 
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public songs:Song[];

    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _albumService:AlbumService,
        private _songService: SongService
   
    ){
       
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
       
       
    }
    ngOnInit(){
        console.log("Album detail component");
        //Llamar al metodo del api para sacar un artista a un artista en base de su id getartist
       
     //Sacar las canciones de la bbdd

     this.getAlbum();
    }

    getAlbum(){
        console.log("El metodo funciona");
       this._route.params.forEach((params :Params)=> {
            let id= params['id'];
            this._albumService.getAlbum(this.token,id).subscribe(
                response =>{
                   
                    if(!response.album){
                        this._router.navigate(['/'])
                    }else{
                        this.album = response.album;
                    
                        //Scar los albums de los artistas
                        this._songService.getSongs(this.token,response.album._id).subscribe(
                       response => {
                            
                             console.log(response);
                            if(!response.songs){
                                this.alertMessage = "Este album no tiene canciones ";

                            }else{
                                this.songs = response.songs;
                                console.log(response.songs);
                            }
                        }
                            ,error => {
                                var errorMensaje = <any>error;
                                
                                if(errorMensaje !=null){
                                  var body = JSON.parse(error._body);
                                 // this.alertMessage = body.message;
                                  console.log(error);
                                 
                                }
                              }
                            ); 
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
    public confirmado;
    onDeleteConfirm(id){
        this.confirmado=id;
    }      
    onCancelSong(){
        this.confirmado=null;
    }   
    onDeleteSong(id){
        this._songService.deleteSong(this.token,id).subscribe(
            response =>{
                if(!response.songremoved){
                    alert("Error en el servidor");

                }
                console.log("delete song");
                console.log(response);
                this.getAlbum();
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
    } 
    
    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path= this.url+'get-song-file/'+song.file;
        let image_path=this.url+'get-image-album/'+song.album.image;
        localStorage.setItem('sound-song',song_player);
        document.getElementById('mp3-source').setAttribute('src',file_path);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-song-title').innerHTML=song.name;
     document.getElementById('play-song-artist').innerHTML= song.album.artist.name;
      document.getElementById('play-image-album').setAttribute('src',image_path);

    }

}