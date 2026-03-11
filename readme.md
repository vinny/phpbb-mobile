# MobilePro Theme for phpBB

MobilePro is a modern, mobile-first, highly optimized style for phpBB 3.3+, built with Tailwind CSS. It is designed to modernize the forum experience, making it feel like a modern web application, especially on mobile devices.

## Features

- **Mobile-First Design:** Fully responsive layout prioritizing mobile user experience.
- **Tailwind CSS Powered:** Utilizes the utility-first framework for rapid, consistent, and maintainable styling.
- **Dark Mode Support:** Built-in seamless dark mode integration using Tailwind's `dark:` classes.
- **Modern Typography:** Uses Google's "Plus Jakarta Sans" for exceptional readability.
- **Iconography:** Employs crisp "Material Symbols Outlined".
- **App-like Navigation:** Replaces the traditional footer with a sticky bottom navigation bar.
- **Bento Card Layouts:** Content blocks (forums, topics, stats) are organized in elegant, rounded cards.
- **phpBB Compatibility:** Carefully refactored to wrap, but not remove, essential phpBB `<!-- EVENT ... -->` hooks and loops to ensure seamless operation with extensions.

## Architecture & Technology Stack

- **Base:** Forked from phpBB's default `prosilver`. Structure remains intact.
- **CSS Framework:** Tailwind CSS 3.x (Pre-compiled locally into a minified `tailwind.css` file for maximum performance).
- **Icons:** Material Symbols Outlined (Downloaded and served locally via `fonts.css`).
- **Fonts:** Plus Jakarta Sans (Downloaded and served locally via `fonts.css`).

## Usage & Modification

### Modifying the Theme Colors (No Compilation Needed)
The primary color of the theme is controlled via native CSS variables. To change the theme color, you do not need to recompile Tailwind.

1. Open `theme/stylesheet.css`.
2. Locate the `:root` block at the top.
3. Change the `--color-primary` RGB values (e.g. `18 163 235` for blue).
4. Save the file and purge the phpBB cache.

### Compiling Tailwind CSS (For Advanced Developers)
If you wish to modify the `.html` templates and use new Tailwind classes that haven't been compiled yet, you must rebuild the CSS file:

1. Ensure you have Node.js installed.
2. In the `styles/MobilePro` directory, run `npm install` to download Tailwind dependencies.
3. To build the CSS once, run: `npx tailwindcss -i theme/tailwind-input.css -o theme/tailwind.css --minify`
4. For active development, watch for changes: `npx tailwindcss -i theme/tailwind-input.css -o theme/tailwind.css --watch`

### Custom CSS Overrides
Any styles that absolutely cannot be handled by Tailwind's utility classes or require deep, overriding specificity should be placed in `theme/stylesheet.css`. The default prosilver CSS imports have been disconnected to prevent conflicts, letting Tailwind drive the primary styling format.

## License
Provided under the GNU General Public License v2 (GPL-2.0-only). See the parent phpBB software licensing for more details on base structural use.
