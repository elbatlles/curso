import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

//import user
import {UserEditComponent} from './components/user-edit.component';
//import artist
import {ArtistListComponent} from './components/artist-list-component'
import {ArtistAddComponent} from './components/artist-add.component'
import {ArtistEditComponent} from './components/artist-edit.component'
import {ArtistDetailComponent} from './components/artist-detail.component'
//importHome
import {HomeComponent} from './components/home.component'
//import albums
import {AlbumAddComponent} from './components/album-add.component'
import {AlbumEditComponent} from './components/album-edit.component'
import {AlbumDetailComponent} from './components/album-detail.component'
//Import song
import {SongAddComponent} from './components/song-add.component'
import {SongEditComponent} from './components/song-edit.components'
const appRoutes : Routes = [
   // {path:'',redirectTo:'artists/1',pathMatch:'full'},
    {path:'',component:HomeComponent},
    {path: 'crear-artista',component: ArtistAddComponent},
    {path: 'editar-artista/:id',component: ArtistEditComponent},
    {path: 'artistas/:page',component: ArtistListComponent},
   // {path: '',component: ArtistListComponent},
   {path: 'crear-album/:artist',component:AlbumAddComponent },
   {path: 'editar-album/:album',component:AlbumEditComponent },
   {path: 'album/:id',component:AlbumDetailComponent },
    {path: 'mis-datos',component: UserEditComponent},
    {path: 'artista/:id',component: ArtistDetailComponent},
    {path: 'crear-tema/:album',component: SongAddComponent},
    {path: 'editar-tema/:id',component: SongEditComponent},
    {path: '**',component: HomeComponent},
    
   
];

export const appRoutingProviders: any[]=[];
export const routing :ModuleWithProviders = RouterModule.forRoot(appRoutes);
