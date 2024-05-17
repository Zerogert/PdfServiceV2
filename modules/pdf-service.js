const name = "pdfService";

const puppeteer = require('puppeteer')

exports.printPdf = async function ({ browser, htmlContents, options }) {
  const page = await browser.newPage();
  await page.setContent(htmlContents, { waitUntil: 'networkidle0' });
  return page.pdf(options);
}


exports.launchBrowser = function () {
  return puppeteer.launch({
    executablePath: 'chromium',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}
