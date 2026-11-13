import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {SelectModule} from "primeng/select";

/**
 * Language selection component.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-language-picker',
  imports: [
    SelectModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './language-picker.component.html'
})
export class LanguagePickerComponent {
  public languages: string[];
  @Input() public selectedLang: string;
  @Output() public onChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private translateService: TranslateService) {
    this.languages = [...this.translateService.getLangs()];
    this.selectedLang = this.translateService.getCurrentLang() ?? '';
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
