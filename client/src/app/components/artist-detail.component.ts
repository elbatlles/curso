import {Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import{GLOBAL} from '../services/global';
import {UserService} from '../services/user.service';
import {ArtistService} from '../services/artist.service';
import {AlbumService} from '../services/album.services';
import {Artist} from '../models/artist';
import {Album} from '../models/album';
@Component({
    selector:'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers:[UserService,ArtistService,AlbumService]
})

export class ArtistDetailComponent implements OnInit{
    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public albums: Album[];
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService:UserService,
        private _artistService:ArtistService,
        private _albumService:AlbumService,
   
    ){
       
        this.identity=this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
       
       
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
                        //Scar los albums de los artistas
                        this._albumService.getAlbums(this.token,response.artist._id).subscribe(
                        response => {
                             
                             if(!response.albums){
                                this.alertMessage = "Este artista no tiene albums";

                            }else{
                                this.albums = response.albums;
                                console.log(response.albums);
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

    onCancelAlbum(){
        this.confirmado=null;
    }   
    
    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token,id).subscribe(
            response => {
                 if(!response.albumremoved){
                     alert("Error en el servidor");
                 }else{
                     this.getArtist();
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

}