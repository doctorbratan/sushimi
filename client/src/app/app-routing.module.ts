import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreLayoutComponent } from './store-layout/store-layout.component';
import { LoginPageComponent } from './store-layout/login-page/login-page.component';
import { UserPageComponent } from './store-layout/user-page/user-page.component';
import { RegistrationPageComponent } from './store-layout/registration-page/registration-page.component';
import { MenuPageComponent } from './store-layout/menu-page/menu-page.component';
import { PlaceSelectPageComponent } from './place-select-page/place-select-page.component';
import { PositionPageComponent } from './store-layout/position-page/position-page.component';
import { OrderPageComponent } from './store-layout/order-page/order-page.component';
import { ContactsPageComponent } from './store-layout/contacts-page/contacts-page.component';

const routes: Routes = [

  {path: '', redirectTo: '/menu',  pathMatch: 'full' },

  {path: 'select-place',  component: PlaceSelectPageComponent},
  
  { path: '', component: StoreLayoutComponent, children: [
      {path: '', redirectTo: '/menu',  pathMatch: 'full' },
      {path: 'menu',  component: MenuPageComponent},
      {path: 'position/:_id', component: PositionPageComponent},
      {path: 'order', component: OrderPageComponent},
      {path: 'login', component: LoginPageComponent},
      {path: 'user', component: UserPageComponent},
      {path: 'registration', component: RegistrationPageComponent},
      {path: 'about-us', component: ContactsPageComponent}
    ],
  },

  { path: '**', redirectTo: '/menu',  pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
