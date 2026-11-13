import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {provideHttpClient, withInterceptors, withXhr} from "@angular/common/http";
import {providePrimeNG} from "primeng/config";
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {authInterceptor} from "./shared/interceptor/auth.interceptor";
import {MenubarComponent} from "./shared/layout/menubar/menubar.component";
import {MainModule} from "./main/main.module";
import {AppPreset, DARK_MODE_CLASS} from "./theme.preset";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    ToastModule,
    MenubarComponent
  ],
  providers: [
    MessageService,
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: '/assets/i18n/', suffix: '.json'}),
      fallbackLang: 'en'
    }),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.' + DARK_MODE_CLASS
        }
      },
      license: environment.PRIMEUI_LICENSE || undefined
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
