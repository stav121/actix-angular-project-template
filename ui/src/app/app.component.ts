import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActuatorService} from "./shared/service/actuator.services";
import {TranslateService} from "@ngx-translate/core";
import {SecurityService} from "./shared/service/security.service";
import {Subscription} from "rxjs";
import {AuthService} from "./shared/service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoggedIn: boolean = false;
  public isLive: boolean = false;
  public actuatorSubscription!: Subscription;
  public securitySubscription!: Subscription;

  constructor(private actuator: ActuatorService,
              private securityService: SecurityService,
              private translateService: TranslateService) {
    this.translateService.addLangs(['en']);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  public ngOnInit(): void {
    this.securityService.tokenExpired();

    this.actuatorSubscription = this.actuator.healthCheck().subscribe({
      next: () => this.isLive = true,
      error: () => this.isLive = false
    });

    this.securitySubscription = this.securityService.isLoggedIn$.subscribe(state => this.isLoggedIn = state);

  }

  public ngOnDestroy(): void {
    this.actuatorSubscription.unsubscribe();
    this.securitySubscription.unsubscribe();
  }
}
