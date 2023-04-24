import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu);

import { AngularYandexMapsModule } from 'angular8-yandex-maps';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {TokenInterceptor} from './classes/token.interceptor'
import { DatePipe } from '@angular/common';

import { PositionFilterPipe } from "./position-filter.pipe";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreLayoutComponent } from './store-layout/store-layout.component';
import { LoginPageComponent } from './store-layout/login-page/login-page.component';
import { MenuPageComponent } from './store-layout/menu-page/menu-page.component';
import { LoaderComponent } from './loader/loader.component';
import { PlaceSelectPageComponent } from './place-select-page/place-select-page.component';
import { PositionPageComponent } from './store-layout/position-page/position-page.component';
import { OrderPageComponent } from './store-layout/order-page/order-page.component';
import { ContactsPageComponent } from './store-layout/contacts-page/contacts-page.component';
import { RegistrationPageComponent } from './store-layout/registration-page/registration-page.component';
import { UserPageComponent } from './store-layout/user-page/user-page.component';

@NgModule({
  declarations: [
    PositionFilterPipe,
    LoaderComponent,

    AppComponent,
    StoreLayoutComponent,
    LoginPageComponent,
    MenuPageComponent,
    PlaceSelectPageComponent,
    PositionPageComponent,
    OrderPageComponent,
    ContactsPageComponent,
    RegistrationPageComponent,
    UserPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    AngularYandexMapsModule
  ],
  providers: [
    DatePipe,
    { 
      provide: LOCALE_ID, 
      useValue: 'ru' 
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
