import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RegistrationRequest} from "../../../shared/model/auth.model";
import {AuthService} from "../../../shared/service/auth.service";
import {MessageService} from "primeng/api";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {TooltipModule} from "primeng/tooltip";
import {InputTextModule} from "primeng/inputtext";
import {NgClass, NgIf} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LanguagePickerComponent} from "../../../shared/layout/language-picker/language-picker.component";
import {ThemePickerComponent} from "../../../shared/layout/theme-picker/theme-picker.component";

/**
 * User registration component.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        TooltipModule,
        InputTextModule,
        NgClass,
        NgIf,
        RippleModule,
        ButtonModule,
        TranslateModule,
        RouterLink,
        RouterLinkActive,
        LanguagePickerComponent,
        ThemePickerComponent
    ],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  /* The form */
  public form = this.formBuilder.group({
    username: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required])
  });

  /* Error handling */
  public errorCode: string = '';
  public error: string = '';
  public isSuccessful: boolean = false;
  public isSignUpFailed: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService) {
  }

  public ngOnInit(): void {
    // Nothing for now
  }

  /** Submit the form */
  public onSubmit(): void {
    this.error = '';
    this.errorCode = '';

    // Create the form
    const data: RegistrationRequest = {
      username: this.form.get('username')?.value!,
      email: this.form.get('email')?.value!,
      password: this.form.get('password')?.value!,
    };

    this.authService.register(data).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.messageService.add({
          severity: 'info',
          detail: 'Account created!'
        });
      },
      error: err => {
        if (!!err.error.code) {
          this.error = err.error.code; // TODO: Transform
          this.errorCode = err.error.code;
        }
        this.isSignUpFailed = true;
      }
    });
  }
}
