const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(__dirname, '../assets/icon.png');
const outputDir = path.join(__dirname, '../pwa/icons');

// 確保輸出目錄存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成不同尺寸的圖示
async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} icon`);
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 