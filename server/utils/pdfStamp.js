const fs = require("fs");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit");
const { PDFDocument, rgb } = require("pdf-lib");

async function stampPDF(inputPath, outputPath, x, y, signer, fontFamily) {
  try {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Register fontkit to support real handwriting fonts
    pdfDoc.registerFontkit(fontkit);

    const pages = pdfDoc.getPages();
    const page = pages[0]; 
    const { width: pdfWidth, height: pdfHeight } = page.getSize();

    console.log("--- Real Signature Font System Active ---");

    let embeddedFont;
    let systemFontPath = "";

    // Windows system's fonts path mapping
    if (fontFamily === "cursive") {
      systemFontPath = "C:\\Windows\\Fonts\\segoesc.ttf";
    } else if (fontFamily === "serif") {
      systemFontPath = "C:\\Windows\\Fonts\\timesi.ttf";
    } else if (fontFamily === "monospace") {
      systemFontPath = "C:\\Windows\\Fonts\\cour.ttf";
    } else if (fontFamily === "fantasy") {
      systemFontPath = "C:\\Windows\\Fonts\\comic.ttf";
    }

    if (systemFontPath && fs.existsSync(systemFontPath)) {
      const fontBuffer = fs.readFileSync(systemFontPath);
      embeddedFont = await pdfDoc.embedFont(new Uint8Array(fontBuffer));
      console.log("SUCCESS: Real font loaded from Windows system directly!");
    }

    // 🛠️ EXACT MOUSE LOCK CALIBRATION FOR REACT-PDF
    // react-pdf का डिफ़ॉल्ट विजुअल पेज विड्थ लगभग 600px होता है।
    const frontendRenderWidth = 600; 
    const scaleFactor = pdfWidth / frontendRenderWidth;

    // फ्रंटएंड के X और Y को वास्तविक PDF स्केल में बदलना
    let pdfX = Number(x) * scaleFactor;
    
    // PDF का ओरिजिन नीचे-बाएँ (Bottom-Left) कोने से शुरू होता है, जबकि ब्राउज़र का ऊपर-बाएँ से।
    // इसलिए ऊँचाई को पलटना (Invert) ज़रूरी है।
    let pdfY = pdfHeight - (Number(y) * scaleFactor); 

    // सिग्नेचर का अपना आकार संतुलित करने के लिए थोड़ा सा ऑफसेट
    pdfY = pdfY - 20; 

    // Keep within PDF bounds strictly
    if (pdfX < 20) pdfX = 20;
    if (pdfX > pdfWidth - 150) pdfX = pdfWidth - 150;
    if (pdfY < 20) pdfY = 20;
    if (pdfY > pdfHeight - 40) pdfY = pdfHeight - 40;

    page.drawText(signer, {
      x: pdfX,
      y: pdfY,
      size: 24, 
      font: embeddedFont || undefined, 
      color: rgb(0, 0, 0.7), // Real blue ink color
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    console.log("PDF Stamped beautifully at the EXACT location!");
  } catch (err) {
    console.error("CRITICAL ERROR IN REAL_FONT ENGINE:", err);
    throw err;
  }
}

module.exports = stampPDF;