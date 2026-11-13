import {DOCUMENT, inject, Injectable} from "@angular/core";
import {DARK_MODE_CLASS} from "../../theme.preset";

/**
 * Theme selection service. PrimeNG switches to its dark color scheme while
 * the dark mode class is set on the <html> element.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);

  public darkTheme(val: boolean): void {
    this.document.documentElement.classList.toggle(DARK_MODE_CLASS, val);
  }

  public isDarkTheme(): boolean {
    return this.document.documentElement.classList.contains(DARK_MODE_CLASS);
  }
}
