import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";

export const addSignature = async () => {
  const existingPdfBytes = fs.readFileSync("./uploads/sample.pdf");

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText("Signed by Madan Mohan", {
    x: 200,
    y: 350,
    size: 18,
    color: rgb(0, 0, 0),
  });

  // 🔥 Final PDF generate karo
  const pdfBytes = await pdfDoc.save();

  // 🔥 Save to disk
  const outputPath = "./uploads/signed-output.pdf";
  fs.writeFileSync(outputPath, pdfBytes);

  console.log("Signed PDF saved successfully:", outputPath);

  return outputPath;
};