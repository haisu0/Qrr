# Love QR Code Generator API

A Cloudflare Workers API that generates heart-shaped QR codes, perfect for spreading love! 💖

## Features

- 🎯 **Functional QR Codes**: All generated codes are scannable
- 💖 **Heart Shape**: QR code rotated 45° with heart-shaped design
- 🎨 **Red Theme**: Beautiful red color scheme
- 🌐 **Web Interface**: Easy-to-use web form
- 🔗 **API Endpoints**: RESTful API for integration
- 📱 **Mobile Friendly**: Responsive design

## Deployment

1. Install Wrangler CLI:
\`\`\`bash
npm install -g wrangler
\`\`\`

2. Login to Cloudflare:
\`\`\`bash
wrangler login
\`\`\`

3. Deploy to Workers:
\`\`\`bash
npm run deploy
\`\`\`

## API Usage

### Web Interface
Visit your deployed URL to use the web interface.

### API Endpoint
\`\`\`
GET /api/love-qr
\`\`\`

**Parameters:**
- `text` (string): Text or URL to encode (default: "https://love.tsonit.com/")
- `size` (number): Size in pixels (default: 300)
- `format` (string): Output format - png, svg (default: png)

**Examples:**
\`\`\`
https://your-worker.workers.dev/api/love-qr?text=Hello%20Love&size=400
https://your-worker.workers.dev/api/love-qr?text=https://example.com&size=300&format=svg
\`\`\`

## Features

- ✅ Heart-shaped QR codes
- ✅ Rotated 45° diamond orientation
- ✅ Additional patterns for heart lobes
- ✅ Scannable and functional
- ✅ Red color theme
- ✅ Web interface
- ✅ API endpoints
- ✅ Mobile responsive

## How It Works

1. Generates a standard QR code in red color
2. Rotates the QR code 45 degrees (diamond shape)
3. Adds additional QR patterns to form heart lobes
4. Clips everything to a heart shape
5. Returns as SVG or PNG format

Perfect for Valentine's Day, love messages, or any romantic occasion! 💕
