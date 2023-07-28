/**
 * Inject initial theme class to `html` element.
 *
 * NOTE - This file is manually compiled and minifed with esbuild to
 * `/static/scripts/setInitialTheme.js`, because Astro doesn't support
 * transpiling `is:inline` scripts.
 *
 * See: https://github.com/withastro/roadmap/discussions/995
 */
(function () {
  const themes = {
    light: "theme-sky-light",
    dark: "theme-sky-dark",
  };

  function getInitialTheme(): string {
    // Return theme from local storage if it exists and is not "auto".
    const themeName = window.localStorage.getItem("vueuse-color-scheme") ?? "";
    if (themeName in themes) {
      return themes[themeName as keyof typeof themes];
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? themes.dark
      : themes.light;
  }

  // Remove class added by SSR and replace it with detected theme.
  document.documentElement.classList.remove(themes.light);
  document.documentElement.classList.add(getInitialTheme());
})();
