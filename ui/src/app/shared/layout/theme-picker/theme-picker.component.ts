import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemeService} from "../../service/theme.service";
import {InputSwitchModule} from "primeng/inputswitch";
import {FormsModule} from "@angular/forms";

/**
 * Dark/Light theme switch.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [
    InputSwitchModule,
    FormsModule
  ],
  templateUrl: './theme-picker.component.html'
})
export class ThemePickerComponent {
  @Input() public darkTheme: boolean = false;
  @Output() public onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private themeService: ThemeService) {
  }

  public onThemeChange() {
    if (this.darkTheme) {
      this.themeService.switchTheme('soho-dark');
      this.onChange.emit(true);
    } else {
      this.themeService.switchTheme('soho-light');
      this.onChange.emit(false);
    }
  }
}
