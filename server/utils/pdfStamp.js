const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

async function stampPDF(inputPath, outputPath, x, y) {
  const existingPdfBytes = fs.readFileSync(inputPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const page = pdfDoc.getPages()[0];
  const { height } = page.getSize();

  page.drawText("Signed", {
    x: x,
    y: height -y,
    size: 20,
    color: rgb(0, 0, 1),
  });

  const pdfBytes = await pdfDoc.save();

  fs.writeFileSync(outputPath, pdfBytes);
}

module.exports = stampPDF;