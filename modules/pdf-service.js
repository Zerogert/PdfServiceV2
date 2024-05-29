const name = "pdfService";

const puppeteer = require('puppeteer')

exports.getPdfFromUrl = async function ({ browser, url, options }) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: options.waitUntil });

  return page.pdf(options);
}

exports.getPdfFromHtml = async function ({ browser, htmlContents, options }) {
  const page = await browser.newPage();
  await page.setContent(htmlContents, { waitUntil: options.waitUntil });

  return page.pdf(options);
}
