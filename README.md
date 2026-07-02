# Ahmed Mokhtar — Portfolio

A modern, responsive one-page portfolio for **Ahmed Mokhtar**, *Hospitality Technology &
AI Automation Specialist*. Built with plain **HTML, CSS, and JavaScript** — no framework,
no build step — so it deploys to **GitHub Pages** as-is.

## Features

- Premium dark theme with a one-click **light/dark toggle** (remembers your choice).
- Fully **responsive** (mobile, tablet, desktop) with a collapsing mobile menu.
- Smooth scrolling, scroll-spy navigation, scroll-reveal animations, and animated stat counters.
- Sections: Hero · Stats · About · Expertise · Experience · Projects · Toolbox · Contact.

## File structure

```
Portfolio/
├── index.html          # Page markup and all content
├── styles.css          # Theme, layout, and responsive styles
├── script.js           # Theme toggle, nav, scroll reveal, counters
├── README.md           # This file
└── assets/
    └── favicon.svg      # Site icon (replace with a real photo, see below)
```

## Run it locally

No tooling required — just open `index.html` in a browser.

For a nicer local preview (recommended, so paths behave exactly like on GitHub Pages),
serve the folder with any static server, e.g.:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

You can publish for free at `https://<your-username>.github.io/<repo-name>/`.

### 1. Create a GitHub repository
- Go to <https://github.com/new>.
- Name it (e.g. `portfolio`), set it **Public**, and click **Create repository**.

### 2. Push these files to the repo
From inside the `Portfolio` folder:

```bash
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin https://github.com/Ahmed-Mokhtar12/portfolio.git
git push -u origin main
```

> Replace the remote URL with your repo if you named it something other than `portfolio`.

### 3. Enable GitHub Pages
- In the repo, open **Settings → Pages** (left sidebar).
- Under **Build and deployment → Source**, choose **Deploy from a branch**.
- Set **Branch** to `main` and folder to **`/ (root)`**, then click **Save**.
- Wait ~1 minute. Your site will be live at:
  `https://Ahmed-Mokhtar12.github.io/portfolio/`

### Optional: use a `<username>.github.io` root URL
If you name the repository exactly `Ahmed-Mokhtar12.github.io`, the site is served from the
root: `https://Ahmed-Mokhtar12.github.io/` (no `/portfolio` suffix). Everything else is the same.

## Replace the "AM" photo placeholder with a real photo

The hero currently shows an **"AM" monogram** as a placeholder. To use your own photo:

1. Add your image to the `assets/` folder, e.g. `assets/ahmed.jpg`
   (a square image, around 600×600px, looks best).
2. Open `index.html` and find this block (inside the hero section):

   ```html
   <div class="avatar" id="avatar">
     <div class="avatar__ring" aria-hidden="true"></div>
     <div class="avatar__monogram">AM</div>
   </div>
   ```

3. Replace the `avatar__monogram` line with an image tag:

   ```html
   <div class="avatar" id="avatar">
     <div class="avatar__ring" aria-hidden="true"></div>
     <img class="avatar__photo" src="assets/ahmed.jpg" alt="Ahmed Mokhtar" />
   </div>
   ```

   The `.avatar__photo` style is already included, so the photo will fit the circular
   frame with the animated accent ring automatically.

4. (Optional) To use the photo as the browser tab icon too, replace `assets/favicon.svg`
   with a square image and update the `<link rel="icon" ...>` line in `index.html`.

## Customizing content

- **Text** — all copy lives in `index.html`; edit it directly.
- **Colors / theme** — change the CSS variables at the top of `styles.css`
  (`--accent`, `--bg`, etc.) under `:root` (dark) and `[data-theme="light"]` (light).
- **Links** — LinkedIn, GitHub, and email links appear in the hero and contact sections
  of `index.html`.

## Links

- LinkedIn: <https://www.linkedin.com/in/ahmed-mokhtar-hospitality-ai/>
- GitHub: <https://github.com/Ahmed-Mokhtar12>
- Email: ahmed.mokhtar12@gmail.com

---

© Ahmed Mokhtar — Hospitality Technology & AI Automation.
