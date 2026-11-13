import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminHomeComponent} from './admin-home/admin-home.component';
import {UserHomeComponent} from './user-home/user-home.component';


@NgModule({
  declarations: [
    AdminHomeComponent,
    UserHomeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainModule {
}
