import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./main/auth/login/login.component";
import {RegisterComponent} from "./main/auth/register/register.component";
import {AdminHomeComponent} from "./main/admin-home/admin-home.component";
import {UserHomeComponent} from "./main/user-home/user-home.component";
import {adminGuard, authGuard} from "./shared/guard/auth.guard";

/**
 * Basic application routes.
 */
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-home', component: AdminHomeComponent, canActivate: [adminGuard]},
  {path: 'user-home', component: UserHomeComponent, canActivate: [authGuard]},
  {path: '', component: LoginComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
