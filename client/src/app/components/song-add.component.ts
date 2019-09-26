import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {AlbumService} from '../services/album.services';
import {SongService} from '../services/song.service';
//import {ArtistService} from '../services/artist.service';
 
import {Artist} from '../models/artist';
//import {Album} from '../models/album';
import {Song} from '../models/song';
@Component({
    selector:'song-add',
    templateUrl: '../views/song-add.html',
    providers:[UserService,SongService]
})

export class SongAddComponent implements OnInit{
   
    public titulo: string;
    public artist: Artist;

    public identity;
    public token;
    public url: string;
    public alertMessage;
    public song: Song;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _songService:SongService,
   
        
    ){
        this.titulo="Crea una nueva Canción";
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1,"","","","");
      
    }
    ngOnInit(): void {
       console.log("component song add22");
    }

  onSubmit(){
  
     this._route.params.forEach((params: Params) =>{
            let album_id = params['album'];
            this.song.album= album_id;
            console.log(this.song);
           
             this._songService.addSong(this.token,this.song).subscribe(
                response =>{
                    console.log(response);
                    if(!response.song){
                        this.alertMessage="Error en el servidor";
                    }else{
                        this.song = response.song;
                        this.alertMessage="La canción se ha creado correctamente";
                      this._router.navigate(['/editar-tema',response.song._id]);
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
}