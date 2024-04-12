import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {DropdownModule} from "primeng/dropdown";

/**
 * Language selection component.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-language-picker',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule
  ],
  templateUrl: './language-picker.component.html'
})
export class LanguagePickerComponent {
  public languages: string[];
  @Input() public selectedLang: string;
  @Output() public onChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private translateService: TranslateService) {
    this.languages = this.translateService.getLangs();
    this.selectedLang = this.translateService.currentLang;
  }

  public onLanguageChange() {
    this.translateService.use(this.selectedLang);
    this.onChange.emit(this.selectedLang);
  }

  public langToFlag(lang: string): string {
    if (lang === 'en') {
      return 'gb';
    }
    return lang;
  }
}
