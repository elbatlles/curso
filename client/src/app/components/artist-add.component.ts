import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {Artist} from '../models/artist';
@Component({
    selector:'artist-add',
    templateUrl: '../views/artist-add.html',
    providers:[UserService,ArtistService]
})

export class ArtistAddComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _artistService:ArtistService
    ){
        this.titulo="Crear nuevo Artistas";
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
    }
    ngOnInit(){
        console.log("Cargando Artist  ss ADD");
       
     //GET list artists
    }
    onSubmit(){
        this._artistService.addArtist(this.token,this.artist).subscribe(
            response =>{
              
                if(!response.artist){
                    this.alertMessage="Error en el servidor";
                }else{
                    this.artist = response.artist;
                    this.alertMessage="El artista se ha creado correctamente";
                   this._router.navigate(['/editar-artista',response.artist._id]);
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
        console.log(this.artist);
    }

}