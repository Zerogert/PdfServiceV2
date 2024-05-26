const name = "pdfService";

const puppeteer = require('puppeteer')

exports.getPdfFromUrl = async function ({ browser, url, options }) {
  const page = await browser.newPage();
  //https://pptr.dev/api/puppeteer.puppeteerlifecycleevent
  await page.goto(url, { waitUntil: options.waitUntil });

  return page.pdf(options);
}

exports.getPdfFromHtml = async function ({ browser, htmlContents, options }) {
  const page = await browser.newPage();
  //https://pptr.dev/api/puppeteer.puppeteerlifecycleevent
  await page.setContent(htmlContents, { waitUntil: options.waitUntil });

  return page.pdf(options);
}

exports.launchBrowser = async function () {
  return await puppeteer.launch({
    headless: 'new',
    dumpio: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--single-process'],
  });
}