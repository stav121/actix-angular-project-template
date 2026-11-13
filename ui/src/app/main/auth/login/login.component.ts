import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/service/auth.service";
import {LoginRequest} from "../../../shared/model/auth.model";
import {MessageService} from "primeng/api";
import {SecurityService} from "../../../shared/service/security.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Subscription} from "rxjs";
import {NgClass} from "@angular/common";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputTextModule} from "primeng/inputtext";
import {TooltipModule} from "primeng/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ThemePickerComponent} from "../../../shared/layout/theme-picker/theme-picker.component";
import {LanguagePickerComponent} from "../../../shared/layout/language-picker/language-picker.component";

/**
 * User login component.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    NgClass,
    TooltipModule,
    TranslatePipe,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    RippleModule,
    ThemePickerComponent,
    LanguagePickerComponent
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  /* Form */
  public form = this.formBuilder.group(
    {
      identifier: new FormControl<string>('', [Validators.required]),
      password: new FormControl<string>('', [Validators.required])
    }
  );

  /* Errors */
  public isLoggedIn = false;
  public error: string = '';
  public errorCode: string = '';

  public isLoggedInSubscription!: Subscription;

  public constructor(private formBuilder: FormBuilder,
                     private authService: AuthService,
                     private messageService: MessageService,
                     private securityService: SecurityService,
                     private router: Router) {
  }

  public ngOnInit(): void {
    this.isLoggedInSubscription = this.securityService.isLoggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
      if (this.isLoggedIn) {
        const role = this.securityService.getUser().role;
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-home']);
        } else {
          this.router.navigate(['/user-home']);
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.isLoggedInSubscription.unsubscribe();
  }

  /** Of form submit, log the user in */
  public onSubmit(): void {
    this.error = '';
    this.errorCode = '';
    const request: LoginRequest = {
      identifier: this.form.get('identifier')?.value!,
      password: this.form.get('password')?.value!,
    };

    this.authService.login(request).subscribe({
      next: _ => {
        /* Save the token and navigate the user to the appropriate home */
        this.authService.profile().subscribe({
          next: user => {
            this.securityService.saveUser(user);
            const role = this.securityService.getUser().role;
            if (role === 'ADMIN') {
              this.router.navigate(['/admin-home']);
            } else {
              this.router.navigate(['/user-home']);
            }
          }
        });
      },
      error: err => {
        if (!!err.error.code) {
          this.error = err.error.code;
          this.errorCode = err.error.code;
          if (this.errorCode === 'AUTH003') {

          }
        } else {
          this.messageService.add({
            severity: 'error',
            detail: 'An error occurred',
          })
        }
      }
    })
  }

}
