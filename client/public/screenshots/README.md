# PWA Screenshots

## Required Screenshots
The manifest.json references these screenshots:

- `desktop-screenshot.png` (1280x720) - Wide form factor
- `mobile-screenshot.png` (375x667) - Narrow form factor

## How to Create Screenshots

### Option 1: Manual Screenshots
1. Run the development server: `npm run dev`
2. Open the app in Chrome/Edge
3. Use browser dev tools to simulate different screen sizes
4. Take screenshots and save them as:
   - `desktop-screenshot.png` (1280x720)
   - `mobile-screenshot.png` (375x667)

### Option 2: Using Puppeteer (Automated)
```bash
npm install puppeteer
node generate-screenshots.js
```

### Option 3: Using Playwright
```bash
npm install playwright
npx playwright install
node generate-screenshots-playwright.js
```

## Screenshot Content Suggestions
- Desktop: Show the main dashboard with appointments list
- Mobile: Show the mobile-optimized interface with navigation

## Temporary Placeholders
For now, placeholder files are created. Replace with actual screenshots for better app store listings.
