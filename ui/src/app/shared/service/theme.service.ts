import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";

/**
 * Theme selection service.
 *
 * @author Stavros Grigoriou <unix121@protonmail.com>
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  public darkTheme(val: boolean): void {
    this.switchTheme(val ? 'soho-dark' : 'soho-light');
  }

  public switchTheme(theme: string): void {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }
}
