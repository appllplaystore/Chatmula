ChatMula V19 — simulated app-store gate update

Based on the provided ZambiaCash Play Store-themed HTML as a design/behavior reference and the existing ChatMula PWA package. Existing ChatMula app files and assets are retained.

Install: uses the browser beforeinstallprompt when available. Cancel returns to Install and does not claim success. Accepted requests wait for the browser appinstalled event; acceptance alone is not reported as successful installation. If Chrome does not offer the prompt, use Chrome menu > Install app/Add to Home screen.
Open: does not redirect to app.html or open the website in a browser tab. It instructs the user to launch the installed icon, because a webpage cannot reliably force-launch a PWA on Android.

Upload all files in this ZIP to the GitHub Pages repository root, replacing the existing files. Test on the published HTTPS site in Chrome. Browser installation prompts depend on manifest/service worker eligibility and browser support.
