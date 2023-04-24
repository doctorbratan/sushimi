import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './classes/auth.guard';

import { LoginPageComponent } from './login-page/login-page.component';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { MapPageComponent } from './admin-layout/map-page/map-page.component';
import { PlaceEditComponent } from './admin-layout/place-edit/place-edit.component';
import { PlaceCategoriesComponent } from './admin-layout/place-categories/place-categories.component';
import { PlacePositionsComponent } from './admin-layout/place-positions/place-positions.component';
import { PlaceCitiesComponent } from './admin-layout/place-cities/place-cities.component';
import { CategoryPageComponent } from './admin-layout/category-page/category-page.component';
import { CityPageComponent } from './admin-layout/city-page/city-page.component';
import { PositionPageComponent } from './admin-layout/position-page/position-page.component';
import { UserEditComponent } from './admin-layout/user-edit/user-edit.component';
import { TelegramPageComponent } from './admin-layout/telegram-page/telegram-page.component';
import { ClientPageComponent } from './admin-layout/client-page/client-page.component';

import { SellerLayoutComponent } from './seller-layout/seller-layout.component';
import { OrdersPageComponent } from './seller-layout/orders-page/orders-page.component';
import { OrderHistoryPageComponent } from './admin-layout/order-history-page/order-history-page.component';



const routes: Routes = [

  {path: "enter", component:LoginPageComponent},

  {path: "", component: AdminLayoutComponent, canActivate: [AuthGuard], children: [
    {path: '',  redirectTo: "/enter", pathMatch: "full" },
    {path: 'map', component: MapPageComponent},
    {path: 'place-edit', component: PlaceEditComponent},
    {path: 'place-categories', component: PlaceCategoriesComponent},
    {path: 'place-positions', component: PlacePositionsComponent},
    {path: 'place-cities', component: PlaceCitiesComponent},
    {path: 'category-edit', component: CategoryPageComponent},
    {path: 'position-edit', component: PositionPageComponent},
    {path: 'city-edit', component: CityPageComponent},
    {path: 'user-edit', component: UserEditComponent},
    {path: 'client-edit', component: ClientPageComponent},
    {path: 'telegram-edit', component: TelegramPageComponent},
    {path: 'order-history', component: OrderHistoryPageComponent}
  ]},
  
  {path: "", component: SellerLayoutComponent, canActivate: [AuthGuard], children: [
    { path: '', redirectTo: "/enter", pathMatch: "full" },
    {path: 'orders', component: OrdersPageComponent},
  ]},


  { path: '**', redirectTo: "/enter", pathMatch: "full" }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
