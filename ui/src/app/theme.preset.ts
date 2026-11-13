import {definePreset} from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

/** CSS class on <html> that switches the PrimeNG theme to dark mode. */
export const DARK_MODE_CLASS = 'app-dark';

/**
 * Aura with a violet primary palette, which is the closest match to the
 * purple primary color of the old Soho theme.
 */
export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}'
    }
  }
});
