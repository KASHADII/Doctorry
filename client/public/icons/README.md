# PWA Icon Generation Instructions

## Required Icon Sizes
The following icon sizes are needed for the PWA manifest:

- 16x16px (favicon)
- 32x32px (favicon)
- 72x72px (Android)
- 96x96px (Android)
- 128x128px (Android)
- 144x144px (Windows)
- 152x152px (iOS)
- 192x192px (Android)
- 384x384px (Android)
- 512x512px (Android)

## How to Generate Icons

### Option 1: Using Online Tools
1. Go to https://realfavicongenerator.net/
2. Upload the `icon.svg` file
3. Download the generated icons
4. Place them in the `client/public/icons/` directory

### Option 2: Using ImageMagick (if installed)
```bash
# Install ImageMagick first
# Then run these commands from the client/public/icons/ directory:

magick icon.svg -resize 16x16 icon-16x16.png
magick icon.svg -resize 32x32 icon-32x32.png
magick icon.svg -resize 72x72 icon-72x72.png
magick icon.svg -resize 96x96 icon-96x96.png
magick icon.svg -resize 128x128 icon-128x128.png
magick icon.svg -resize 144x144 icon-144x144.png
magick icon.svg -resize 152x152 icon-152x152.png
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 384x384 icon-384x384.png
magick icon.svg -resize 512x512 icon-512x512.png
```

### Option 3: Using Node.js with sharp
```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon-16x16.png --resize 16 16
sharp -i icon.svg -o icon-32x32.png --resize 32 32
sharp -i icon.svg -o icon-72x72.png --resize 72 72
sharp -i icon.svg -o icon-96x96.png --resize 96 96
sharp -i icon.svg -o icon-128x128.png --resize 128 128
sharp -i icon.svg -o icon-144x144.png --resize 144 144
sharp -i icon.svg -o icon-152x152.png --resize 152 152
sharp -i icon.svg -o icon-192x192.png --resize 192 192
sharp -i icon.svg -o icon-384x384.png --resize 384 384
sharp -i icon.svg -o icon-512x512.png --resize 512 512
```

## Temporary Placeholder Icons
For now, I'll create placeholder files so the PWA can function. Replace these with actual generated icons.
