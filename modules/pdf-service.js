const name = "pdfService";

const puppeteer = require('puppeteer')

exports.printPdf = async function ({ browser, url, options }) {
  const page = await browser.newPage();
  await page.goto(url);
  return page.pdf(options);
}


exports.launchBrowser = function () {
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}
