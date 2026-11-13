import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThemeService} from "../../service/theme.service";
import {ToggleSwitchModule} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";

/**
 * Dark/Light theme switch.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Component({
  selector: 'app-theme-picker',
  imports: [
    ToggleSwitchModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './theme-picker.component.html'
})
export class ThemePickerComponent implements OnInit {
  @Input() public darkTheme: boolean = false;
  @Output() public onChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private themeService: ThemeService) {
  }

  public ngOnInit(): void {
    // Keep the switch in sync when moving between pages that each have a picker
    this.darkTheme = this.themeService.isDarkTheme();
  }

  public onThemeChange() {
    this.themeService.darkTheme(this.darkTheme);
    this.onChange.emit(this.darkTheme);
  }
}
