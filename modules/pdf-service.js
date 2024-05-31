const name = "pdfService";

const puppeteer = require('puppeteer')

exports.getPdfFromUrl = async function ({ browser, url, options }) {
  const page = await browser.newPage();
  try{
    await page.goto(url, { waitUntil: options.waitUntil });
    const result = await page.pdf(options);

    return result
  }
  finally{
    await page.close();
  }
}

exports.getPdfFromHtml = async function ({ browser, htmlContents, options }) {
  const page = await browser.newPage();
  try{
    await page.setContent(htmlContents, { waitUntil: options.waitUntil });
    const result = await page.pdf(options);

    return result
  }
  finally{
    await page.close();
  }
}
