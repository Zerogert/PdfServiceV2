const name = "pdfService";

const puppeteer = require('puppeteer')

exports.getPdfFromUrl = async function ({ browser, url, options }) {
  const page = await browser.newPage();
  //https://pptr.dev/api/puppeteer.puppeteerlifecycleevent
  page.goto(url, {waitUntil: options.waitUntil});

  return page.pdf(options);
}

exports.getPdfFromHtml = async function ({ browser, htmlContents, options }) {
  const page = await browser.newPage();
  //https://pptr.dev/api/puppeteer.puppeteerlifecycleevent
  await page.setContent(htmlContents, { waitUntil: options.waitUntil });
  
  return page.pdf(options);
}

exports.launchBrowser = function () {
  return puppeteer.launch({
    headless: 'new',
    dumpio: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}