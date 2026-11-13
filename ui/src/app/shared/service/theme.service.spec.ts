import {TestBed} from '@angular/core/testing';
import {DOCUMENT} from "@angular/core";
import {ThemeService} from "./theme.service";
import {DARK_MODE_CLASS} from "../../theme.preset";

describe('ThemeService', () => {
  let service: ThemeService;
  let html: HTMLElement;

  beforeEach(() => {
    service = TestBed.inject(ThemeService);
    html = TestBed.inject(DOCUMENT).documentElement;
    html.classList.remove(DARK_MODE_CLASS);
  });

  it('adds and removes the dark mode class on <html>', () => {
    service.darkTheme(true);
    expect(html.classList.contains(DARK_MODE_CLASS)).toBe(true);
    expect(service.isDarkTheme()).toBe(true);

    service.darkTheme(false);
    expect(html.classList.contains(DARK_MODE_CLASS)).toBe(false);
    expect(service.isDarkTheme()).toBe(false);
  });
});
