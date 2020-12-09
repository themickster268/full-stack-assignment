import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { PostcodeService} from './services/postcode.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PostcodesComponent } from './postcodes/postcodes.component';
import { PostcodeComponent } from './postcode/postcode.component';
import { USOComponent } from './uso/uso.component';
import { ToastsContainer} from './toasts-container';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PostcodesComponent,
    PostcodeComponent,
    USOComponent,
    ToastsContainer
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService, PostcodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
