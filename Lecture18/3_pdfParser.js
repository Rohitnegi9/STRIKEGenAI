// =====================================================================
// 3_pdfParser.js — STEP 1: PDF → Raw Text Blocks
// =====================================================================
//
// What it does:
//   1. Reads PDF file from disk (as binary bytes)
//   2. Extracts all text from all pages
//   3. Splits by dash separator into individual movie blocks
//
// Input:  "./data/movies.pdf"
// Output: ["Movie Title: Movie 0001\n...", "Movie Title: Movie 0002\n...", ...]
// =====================================================================

import fs from "fs";
import pdf from "pdf-parse";

async function parsePDF(pdfPath) {
  // Read PDF as binary buffer (PDFs are binary, not text)
  const dataBuffer = fs.readFileSync(pdfPath);

  // Extract text from all pages
  const pdfData = await pdf(dataBuffer);
  const rawText = pdfData.text;

  console.log(`📄 PDF parsed: ${pdfData.numpages} pages, ${rawText.length} characters`);

  // Split by separator (10+ dashes in a row)
  // Each movie is separated by: ----------------------------------------
  const movieBlocks = rawText
    .split(/-{10,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0 && block.includes("Movie Title"));

  console.log(`🎬 Found ${movieBlocks.length} movie blocks`);
  return movieBlocks;
}

export { parsePDF };
