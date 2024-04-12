import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePickerComponent } from './layout/theme-picker/theme-picker.component';
import { LanguagePickerComponent } from './layout/language-picker/language-picker.component';
import { MenubarComponent } from './layout/menubar/menubar.component';



@NgModule({
  declarations: [
    ThemePickerComponent,
    LanguagePickerComponent,
    MenubarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
