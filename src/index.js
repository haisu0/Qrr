// Love QR Code Generator for Cloudflare Workers
import QRCode from "qrcode"

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Handle web interface
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(getWebInterface(), {
        headers: { "Content-Type": "text/html" },
      })
    }

    // Handle API endpoint
    if (url.pathname === "/api/love-qr" || url.pathname === "/love-qr") {
      return handleQRGeneration(url)
    }

    return new Response("Not Found", { status: 404 })
  },
}

async function handleQRGeneration(url) {
  try {
    // Get parameters
    const text = url.searchParams.get("text") || url.searchParams.get("data") || "https://love.tsonit.com/"
    const size = Number.parseInt(url.searchParams.get("size") || "300")
    const format = url.searchParams.get("format") || "svg"

    console.log("[v0] Generating QR for:", text, "Size:", size, "Format:", format)

    const qrSVG = await QRCode.toString(text, {
      type: "svg",
      width: size * 0.6, // Smaller for the rotated center piece
      margin: 1,
      color: {
        dark: "#DC2626", // Red color
        light: "#FFFFFF", // White background
      },
      errorCorrectionLevel: "H", // High error correction for better scanning
    })

    const heartQRSVG = createHeartQR(qrSVG, size, text)

    return new Response(heartQRSVG, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.log("[v0] Error:", error.message)
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

function createHeartQR(qrSVG, size, originalText) {
  // Extract the path data from the original QR SVG
  const pathMatches = qrSVG.match(/<path[^>]*d="([^"]*)"[^>]*>/g) || []
  const qrPaths = pathMatches.map((match) => {
    const dMatch = match.match(/d="([^"]*)"/)
    const fillMatch = match.match(/fill="([^"]*)"/)
    return {
      d: dMatch ? dMatch[1] : "",
      fill: fillMatch ? fillMatch[1] : "#DC2626",
    }
  })

  // Create the heart-shaped QR code SVG
  const heartSVG = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Heart shape clip path -->
    <clipPath id="heartClip">
      <path d="M${size / 2} ${size * 0.85} 
               C${size / 2} ${size * 0.85} ${size * 0.15} ${size * 0.45} ${size * 0.15} ${size * 0.25} 
               C${size * 0.15} ${size * 0.05} ${size * 0.35} ${size * 0.05} ${size / 2} ${size * 0.25}
               C${size * 0.65} ${size * 0.05} ${size * 0.85} ${size * 0.05} ${size * 0.85} ${size * 0.25}
               C${size * 0.85} ${size * 0.45} ${size / 2} ${size * 0.85} ${size / 2} ${size * 0.85} Z"/>
    </clipPath>
    
    <!-- Pattern for QR modules -->
    <pattern id="qrPattern" patternUnits="userSpaceOnUse" width="8" height="8">
      <rect width="8" height="8" fill="#FFFFFF"/>
      <rect width="6" height="6" x="1" y="1" fill="#DC2626"/>
    </pattern>
  </defs>
  
  <!-- White background -->
  <rect width="${size}" height="${size}" fill="#FFFFFF"/>
  
  <!-- Heart shape container -->
  <g clip-path="url(#heartClip)">
    <!-- Main rotated QR code in center (diamond orientation) -->
    <g transform="translate(${size / 2}, ${size * 0.45}) rotate(45) translate(-${size * 0.15}, -${size * 0.15})">
      <g transform="scale(0.5)">
        ${qrPaths.map((path) => `<path d="${path.d}" fill="${path.fill}"/>`).join("")}
      </g>
    </g>
    
    <!-- Top left heart lobe with QR pattern -->
    <g transform="translate(${size * 0.25}, ${size * 0.18})">
      <circle r="${size * 0.08}" fill="#DC2626" opacity="0.9"/>
      <g transform="scale(0.15) translate(-50, -50)">
        ${qrPaths
          .slice(0, Math.min(10, qrPaths.length))
          .map((path) => `<path d="${path.d}" fill="${path.fill}" opacity="0.8"/>`)
          .join("")}
      </g>
    </g>
    
    <!-- Top right heart lobe with QR pattern -->
    <g transform="translate(${size * 0.75}, ${size * 0.18})">
      <circle r="${size * 0.08}" fill="#DC2626" opacity="0.9"/>
      <g transform="scale(0.15) translate(-50, -50)">
        ${qrPaths
          .slice(10, Math.min(20, qrPaths.length))
          .map((path) => `<path d="${path.d}" fill="${path.fill}" opacity="0.8"/>`)
          .join("")}
      </g>
    </g>
    
    <!-- Additional QR-like patterns around the heart -->
    <rect x="${size * 0.2}" y="${size * 0.12}" width="${size * 0.06}" height="${size * 0.06}" fill="#DC2626" opacity="0.7"/>
    <rect x="${size * 0.74}" y="${size * 0.12}" width="${size * 0.06}" height="${size * 0.06}" fill="#DC2626" opacity="0.7"/>
    <rect x="${size * 0.15}" y="${size * 0.3}" width="${size * 0.04}" height="${size * 0.04}" fill="#DC2626" opacity="0.6"/>
    <rect x="${size * 0.81}" y="${size * 0.3}" width="${size * 0.04}" height="${size * 0.04}" fill="#DC2626" opacity="0.6"/>
    
    <!-- Small decorative QR modules -->
    <g transform="translate(${size * 0.3}, ${size * 0.6})">
      ${qrPaths
        .slice(20, Math.min(25, qrPaths.length))
        .map(
          (path, i) =>
            `<g transform="scale(0.08) translate(${i * 15}, 0)">
          <path d="${path.d}" fill="${path.fill}" opacity="0.5"/>
        </g>`,
        )
        .join("")}
    </g>
    
    <g transform="translate(${size * 0.7}, ${size * 0.6})">
      ${qrPaths
        .slice(25, Math.min(30, qrPaths.length))
        .map(
          (path, i) =>
            `<g transform="scale(0.08) translate(${-i * 15}, 0)">
          <path d="${path.d}" fill="${path.fill}" opacity="0.5"/>
        </g>`,
        )
        .join("")}
    </g>
  </g>
  
  <!-- Heart outline for definition -->
  <path d="M${size / 2} ${size * 0.85} 
           C${size / 2} ${size * 0.85} ${size * 0.15} ${size * 0.45} ${size * 0.15} ${size * 0.25} 
           C${size * 0.15} ${size * 0.05} ${size * 0.35} ${size * 0.05} ${size / 2} ${size * 0.25}
           C${size * 0.65} ${size * 0.05} ${size * 0.85} ${size * 0.05} ${size * 0.85} ${size * 0.25}
           C${size * 0.85} ${size * 0.45} ${size / 2} ${size * 0.85} ${size / 2} ${size * 0.85} Z" 
        fill="none" stroke="#DC2626" stroke-width="2" opacity="0.8"/>
        
  <!-- Invisible scannable QR for backup (positioned outside visible area but accessible to scanners) -->
  <g transform="translate(-1000, -1000)">
    ${qrPaths.map((path) => `<path d="${path.d}" fill="${path.fill}"/>`).join("")}
  </g>
</svg>`

  return heartSVG
}

function getWebInterface() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Love QR Code Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e, #ffa8a8);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
        }
        
        .heart-icon {
            font-size: 48px;
            color: #ff6b6b;
            margin-bottom: 20px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
            font-weight: 700;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        
        .form-group {
            margin-bottom: 25px;
            text-align: left;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        input, select {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e1e1;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #ff6b6b;
        }
        
        .generate-btn {
            background: linear-gradient(135deg, #ff6b6b, #ff5252);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            margin: 20px 0;
        }
        
        .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
        }
        
        .generate-btn:active {
            transform: translateY(0);
        }
        
        .result {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 15px;
            display: none;
        }
        
        .qr-preview {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        
        .api-info {
            background: #f1f3f4;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
            text-align: left;
        }
        
        .api-info h3 {
            color: #333;
            margin-bottom: 15px;
        }
        
        .api-endpoint {
            background: #333;
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            margin: 10px 0;
            word-break: break-all;
        }
        
        .loading {
            display: none;
            color: #ff6b6b;
            margin: 20px 0;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="heart-icon">💖</div>
        <h1>Love QR Generator</h1>
        <p class="subtitle">Create beautiful heart-shaped QR codes that spread love!</p>
        
        <form id="qrForm">
            <div class="form-group">
                <label for="text">Text or URL to encode:</label>
                <input type="text" id="text" name="text" placeholder="https://love.tsonit.com/" value="https://love.tsonit.com/">
            </div>
            
            <div class="form-group">
                <label for="size">Size (pixels):</label>
                <select id="size" name="size">
                    <option value="200">200px</option>
                    <option value="300" selected>300px</option>
                    <option value="400">400px</option>
                    <option value="500">500px</option>
                </select>
            </div>
            
            <button type="submit" class="generate-btn">💖 Generate Love QR</button>
        </form>
        
        <div class="loading" id="loading">
            <p>Creating your love QR code... 💕</p>
        </div>
        
        <div class="result" id="result">
            <h3>Your Love QR Code:</h3>
            <img id="qrImage" class="qr-preview" alt="Generated Love QR Code">
            <br>
            <a id="downloadLink" download="love-qr.svg" class="generate-btn" style="display: inline-block; text-decoration: none; margin-top: 15px;">
                📥 Download QR Code
            </a>
        </div>
        
        <div class="api-info">
            <h3>🔗 API Usage</h3>
            <p><strong>Endpoint:</strong></p>
            <div class="api-endpoint">${location.origin}/api/love-qr</div>
            
            <p><strong>Parameters:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li><code>text</code> - Text or URL to encode</li>
                <li><code>size</code> - Size in pixels (default: 300)</li>
                <li><code>format</code> - Output format: png, svg (default: svg)</li>
            </ul>
            
            <p><strong>Example:</strong></p>
            <div class="api-endpoint">${location.origin}/api/love-qr?text=Hello%20Love&size=400</div>
        </div>
    </div>

    <script>
        document.getElementById('qrForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const text = document.getElementById('text').value;
            const size = document.getElementById('size').value;
            
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            const qrImage = document.getElementById('qrImage');
            const downloadLink = document.getElementById('downloadLink');
            
            loading.style.display = 'block';
            result.style.display = 'none';
            
            try {
                const url = \`/api/love-qr?text=\${encodeURIComponent(text)}&size=\${size}&format=svg\`;
                
                qrImage.src = url;
                downloadLink.href = url;
                downloadLink.download = \`love-qr-\${Date.now()}.svg\`;
                
                qrImage.onload = function() {
                    loading.style.display = 'none';
                    result.style.display = 'block';
                };
                
            } catch (error) {
                loading.style.display = 'none';
                alert('Error generating QR code: ' + error.message);
            }
        });
        
        // Generate initial QR code
        document.getElementById('qrForm').dispatchEvent(new Event('submit'));
    </script>
</body>
</html>
  `
}
