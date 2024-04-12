import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {ChipsModule} from "primeng/chips";
import {TooltipModule} from "primeng/tooltip";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {HttpClientModule} from "@angular/common/http";
import {AvatarModule} from "primeng/avatar";
import {TieredMenuModule} from "primeng/tieredmenu";
import {ToolbarModule} from "primeng/toolbar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TableModule} from "primeng/table";
import {DividerModule} from "primeng/divider";
import {CheckboxModule} from "primeng/checkbox";
import {ToastModule} from "primeng/toast";
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
import { HomeComponent } from './admin/home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { UserHomeComponent } from './user-home/user-home.component';


@NgModule({
  declarations: [
  
    HomeComponent,
       AdminHomeComponent,
       UserHomeComponent
  ],
  imports: [
    CommonModule,
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
  ]
})
export class MainModule {
}
