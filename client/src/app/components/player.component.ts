 import { Component, OnInit } from '@angular/core';
 import {Song} from '../models/song';
 import {GLOBAL} from '../services/global'

@Component({
    selector: 'player',
    template: `<div class="album-image">
    <span *ngIf="song.album"> 
    <img id="play-image-album" class="img-fluid" src="{{url+'get-image-album/'+song.album.image}}">
    </span>
    <span *ngIf="!song.album">
    <img id="play-image-album" class="img-fluid" src="assets/images/reproductor.jpeg">
    </span>
    </div>
    <p>Reproduciendo</p>
    <div class="audio-file">  
    <span id="play-song-title">
    {{song.name}}
    </span>
       
        <span id="play-song-artist">
        <span *ngIf="song.album.artist">
            {{song.album.artist.name}}
            </span>
        </span>
        <audio controls id="player">
        <source id="mp3-source" src="{{url+'get-song-file/'+song.file}}" type="audio/mpeg" />
        Tu navegador no es compatible
        </audio>
      
    </div>`
})

export class PlayerComponent implements OnInit {

    public url:string;
    public song;

    constructor() {
        this.url=GLOBAL.url
        this.song= new Song(1,'','','','');
     }

    ngOnInit() { 
        console.log("player cargado");

        var song = JSON.parse(localStorage.getItem('sound-song'));
        if(song){
         this.song=song;
        }else{
            this.song= new Song(1,'','','','');
        }
    }

}