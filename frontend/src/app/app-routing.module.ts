import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostcodeComponent } from './postcode/postcode.component';
import { PostcodesComponent } from './postcodes/postcodes.component';
import { USOComponent } from './uso/uso.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'postcodes', component: PostcodesComponent},
  { path: 'postcodes/:_id', component: PostcodeComponent},
  { path: 'uso', component: USOComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
