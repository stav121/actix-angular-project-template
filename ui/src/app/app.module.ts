import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputGroupModule} from "primeng/inputgroup";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {AvatarModule} from "primeng/avatar";
import {TieredMenuModule} from "primeng/tieredmenu";
import {ToolbarModule} from "primeng/toolbar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TableModule} from "primeng/table";
import {DividerModule} from "primeng/divider";
import {CheckboxModule} from "primeng/checkbox";
import {AccordionModule} from "primeng/accordion";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {PanelModule} from "primeng/panel";
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {TabViewModule} from "primeng/tabview";
import {ChipModule} from "primeng/chip";
import {SkeletonModule} from "primeng/skeleton";
import {BadgeModule} from "primeng/badge";
import {FileUploadModule} from "primeng/fileupload";
import {InputSwitchModule} from "primeng/inputswitch";
import {CardModule} from "primeng/card";
import {PasswordModule} from "primeng/password";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ChartModule} from "primeng/chart";
import {AdminGuard, AuthGuard} from "./shared/guard/auth.guard";
import {httpInterceptorProviders} from "./shared/interceptor/auth.interceptor";
import {MenubarComponent} from "./shared/layout/menubar/menubar.component";

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InputTextModule,
    InputGroupModule,
    TooltipModule,
    ButtonModule,
    RippleModule,
    InputGroupAddonModule,
    HttpClientModule,
    AvatarModule,
    TieredMenuModule,
    ToolbarModule,
    BrowserAnimationsModule,
    TableModule,
    DividerModule,
    CheckboxModule,
    ToastModule,
    AccordionModule,
    DialogModule,
    DropdownModule,
    PanelModule,
    MessageModule,
    MessagesModule,
    TabViewModule,
    ChipModule,
    SkeletonModule,
    BadgeModule,
    FileUploadModule,
    InputSwitchModule,
    CardModule,
    PasswordModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ChartModule,
    MenubarComponent,
  ],
  providers: [
    httpInterceptorProviders,
    MessageService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
