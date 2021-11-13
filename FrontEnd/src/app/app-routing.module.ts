import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveAccountComponent } from './components/active/active-account/active-account.component';
import { OkSendMessageComponent } from './components/active/ok-send-message/ok-send-message.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/home/main/main.component';
import { NotFoundPageComponent } from './components/home/not-found-page/not-found-page.component';
import { ProductsComponent } from './components/home/products/products.component';
import { ViewProductComponent } from './components/home/view-product/view-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GetRoleGuard } from './service/guards/get-role.guard';
import { IsLoginGuard } from './service/guards/is-login.guard';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'account/active/message-send', component:OkSendMessageComponent},
  {path:'account/active-Account/:token', component:ActiveAccountComponent},
  {path:'admin/dashboard', component:DashboardComponent, canActivate:[IsLoginGuard,GetRoleGuard]},
  {path:'', component:HomeComponent, children:[
    {path:'', component:MainComponent},
    {path:'404', component:NotFoundPageComponent},
    {path:'products', component:ProductsComponent},
    {path:'product/:product', component:ViewProductComponent}
  ]},
  {path:'**', redirectTo:'/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
