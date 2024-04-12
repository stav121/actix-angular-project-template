import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {Router, RouterLink} from "@angular/router";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TieredMenuModule} from "primeng/tieredmenu";
import {NgIf} from "@angular/common";
import {heartBeatAnimation} from "angular-animations";
import {interval, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {SecurityService} from "../../service/security.service";
import {TranslateService} from "@ngx-translate/core";
import {ActuatorService} from "../../service/actuator.services";

/**
 * Application menubar
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    ToolbarModule,
    AvatarModule,
    RouterLink,
    TooltipModule,
    ButtonModule,
    RippleModule,
    TieredMenuModule,
    NgIf
  ],
  templateUrl: './menubar.component.html',
  animations: [heartBeatAnimation()]
})
export class MenubarComponent implements OnInit, OnDestroy {
  public menuItems: any = {};
  public animateHeartbeat?: boolean;
  public isAlive: boolean = true;
  public isLoggedIn: boolean = false;
  public authStateSub!: Subscription;
  public heartBeatSub!: Subscription;
  public langChangeSub!: Subscription;

  constructor(private authService: AuthService,
              private securityService: SecurityService,
              private translateService: TranslateService,
              private actuatorService: ActuatorService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.authStateSub = this.securityService.isLoggedIn$.subscribe((state) => this.isLoggedIn = state);

    this.translateMenu();
    this.langChangeSub = this.translateService.onLangChange.subscribe(() => this.translateMenu());

    this.heartBeatSub = interval(10000)
      .subscribe(() => {
        this.heartbeatDo();
      });
  }

  public ngOnDestroy(): void {
    this.authStateSub.unsubscribe();
    this.heartBeatSub.unsubscribe();
    this.langChangeSub.unsubscribe();
  }

  public logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.securityService.clean();
          this.router.navigate(['/login']);
          window.location.reload();
        },
        error: (err) => {
          console.log(err)
        }
      });
  }

  public navigateTo(routerLink: string): void {
    this.router.navigate([`/${routerLink}`]);
  }

  public heartbeatDo(): void {
    this.actuatorService.healthCheck()
      .subscribe({
        next: () => {
          this.isAlive = true;
          this.animate();
        },
        error: () => {
          this.isAlive = false;
          this.securityService.clean();
          this.router.navigate(['login']);
        }
      });
  }

  public animate(): void {
    this.animateHeartbeat = false;
    setTimeout(() => {
      this.animateHeartbeat = true;
    }, 2);
  }

  public translateMenu(): void {
    // Global menu
    this.translateService.get([
      'header.menu.home-btn',
      'header.menu.logout-btn'
    ])
      .subscribe({
        next: () => {
          this.menuItems = [
            {
              label: this.translateService.instant('header.menu.home-btn'),
              icon: 'fa-solid fa-home',
              command: () => this.navigateTo('dashboard')
            },
            {
              label: this.translateService.instant('header.menu.logout-btn'),
              icon: 'fa-solid fa-right-from-bracket',
              command: () => this.logout()
            }
          ];
        }
      });
  }
}
