import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./main/auth/login/login.component";
import {RegisterComponent} from "./main/auth/register/register.component";
import {AdminHomeComponent} from "./main/admin-home/admin-home.component";
import {UserHomeComponent} from "./main/user-home/user-home.component";
import {AdminGuard, AuthGuard} from "./shared/guard/auth.guard";

/**
 * Basic application routes.
 */
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin-home', component: AdminHomeComponent, canActivate: [AdminGuard]},
  {path: 'user-home', component: UserHomeComponent, canActivate: [AuthGuard]},
  {path: '', component: LoginComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
