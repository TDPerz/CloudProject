import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData, DatePipe } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthTokenInterceptor } from './service/interceptor/auth-token-interceptor.interceptor'


import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

//ngx-DropZone
import { NgxDropzoneModule } from 'ngx-dropzone';

//Componetns
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CookieService } from 'ngx-cookie-service';
import { InventoryComponent } from './components/dashboard/content/inventory/inventory.component';
import { ShopComponent } from './components/dashboard/content/shop/shop.component';
import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/home/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { ActiveAccountComponent } from './components/active/active-account/active-account.component';
import { OkSendMessageComponent } from './components/active/ok-send-message/ok-send-message.component';
import { RestorePasswordComponent } from './components/active/restore-password/restore-password.component';
import { NotFoundPageComponent } from './components/home/not-found-page/not-found-page.component';
import { ProductsComponent } from './components/home/products/products.component';
import { FilterPipe } from './service/pipe/filter.pipe';
import { ViewProductComponent } from './components/home/view-product/view-product.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    InventoryComponent,
    ShopComponent,
    HomeComponent,
    MainComponent,
    RegisterComponent,
    ActiveAccountComponent,
    OkSendMessageComponent,
    RestorePasswordComponent,
    NotFoundPageComponent,
    ProductsComponent,
    FilterPipe,
    ViewProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzSpaceModule,
    NzGridModule,
    NzTableModule,
    NzPageHeaderModule,
    NzModalModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzUploadModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzDropDownModule,
    NgxDropzoneModule,
    NzAvatarModule,
    NzTypographyModule,
    NzDividerModule,
    NzImageModule,
    NzIconModule,
    NzCarouselModule,
    NzListModule,
    NzCardModule,
    NzCheckboxModule,
    NzResultModule,
    NzSpinModule,
    NzSkeletonModule,
    NzInputNumberModule,
    NzPaginationModule,
    NzEmptyModule,
    NzRateModule,
    NzTagModule,
    NzDescriptionsModule,
    NzCommentModule,
    NzBreadCrumbModule,
    NzToolTipModule
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES },
    {provide:JWT_OPTIONS, useValue:JWT_OPTIONS},
    JwtHelperService, CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
