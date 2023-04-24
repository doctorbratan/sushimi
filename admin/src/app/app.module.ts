import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
registerLocaleData(localeRu);

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {TokenInterceptor} from './classes/token.interceptor';
import { DatePipe } from '@angular/common';

import { AppRoutingModule} from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';

import { PositionFilterPipe } from "./position-filter.pipe";

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CategoryPageComponent } from './admin-layout/category-page/category-page.component';
import { CityPageComponent } from './admin-layout/city-page/city-page.component';
import { PlaceEditComponent } from './admin-layout/place-edit/place-edit.component';
import { PositionPageComponent } from './admin-layout/position-page/position-page.component';

import { SellerLayoutComponent } from './seller-layout/seller-layout.component';


import { LoaderComponent } from './shared/loader/loader.component';
import { PlaceCategoriesComponent } from './admin-layout/place-categories/place-categories.component';
import { PlacePositionsComponent } from './admin-layout/place-positions/place-positions.component';
import { PlaceCitiesComponent } from './admin-layout/place-cities/place-cities.component';
import { UserEditComponent } from './admin-layout/user-edit/user-edit.component';
import { OrdersPageComponent } from './seller-layout/orders-page/orders-page.component';
import { TelegramPageComponent } from './admin-layout/telegram-page/telegram-page.component';
import { OrderHistoryPageComponent } from './admin-layout/order-history-page/order-history-page.component';
import { ClientPageComponent } from './admin-layout/client-page/client-page.component';


@NgModule({
  declarations: [
    PositionFilterPipe,
    
    AppComponent,
    AdminLayoutComponent,
    SellerLayoutComponent,
    LoginPageComponent,
    LoaderComponent,
    CategoryPageComponent,
    CityPageComponent,
    PlaceEditComponent,
    PositionPageComponent,
    PlaceCategoriesComponent,
    PlacePositionsComponent,
    PlaceCitiesComponent,
    UserEditComponent,
    OrdersPageComponent,
    TelegramPageComponent,
    OrderHistoryPageComponent,
    ClientPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
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
