const pdfService = require('./modules/pdf-service');
const browserProvider = require('./modules/browser-provider');

const express = require('express');
const cors = require('cors');
const booleanParser = require('express-query-boolean');
const numberParser = require('express-query-int');
const bodyParser = require('body-parser');
const { queryParser } = require('express-query-parser');

const app = express()
const port = 3000

const isCloseBrowser = process.env.IS_CLOSE_BROWSER === "true" || false;
//possible values https://pptr.dev/api/puppeteer.puppeteerlifecycleevent
const isWaitUntil = process.env.IS_WAIT_UNTIL || 'networkidle0';

app.use(booleanParser());
app.use(numberParser());
app.use(bodyParser.text({ type: 'text/html' }));
app.use(queryParser({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true
}));

async function processCloseBrowser(browser){
  if(isCloseBrowser){
    console.info('Close browser');
    await browser.close();
  }
}

function getOptions(request) {
  return { format: 'a4', landscape: false, printBackground: true, waitUntil: isWaitUntil, ...request.query, path: null };
}

app.get('/pdfs', cors(), async (request, response) => {
  options = getOptions(request);
  const browser = await browserProvider.getInstance();
  try {
    const result = await pdfService.getPdfFromUrl({ url: request.query.url, browser, options: options });
    response.attachment(`document.pdf`).send(result);
    return;
  }
  catch (err) {
    console.error('ERROR: ', err);
    response.sendStatus(400);
    return;
  }
  finally {
    await processCloseBrowser(browser);
  }
});

app.get('/healthcheck', cors(), async (request, response) => {
  const browser = await browserProvider.getInstance();
  const result = await pdfService.getPdfFromUrl({ url: 'https://www.google.com/', browser, options: {} });
  await processCloseBrowser(browser);
  response.sendStatus(200);
});

app.get('/', cors(), async (request, response) => {
  response.sendStatus(200);
});

app.post('/pdfs', cors(), async (request, response) => {
  options = getOptions(request);
  const browser = await browserProvider.getInstance();
  try {
    const result = await pdfService.getPdfFromHtml({ htmlContents: request.body, browser, options: options });
    response.attachment(`document.pdf`).send(result);
    return;
  } catch (err) {
    console.error('ERROR: ', err);
    response.sendStatus(400);
    return;
   }
  finally {
    await processCloseBrowser(browser);
  }
});

app.options('/*', cors());

app.use((err, _, response, __) => {
  response.status(500).send(err.stack);
});

app.listen(port, (err) => {
  if (err) {
    return console.error('ERROR: ', err);
  }

  console.log(`HTML to PDF converter listening on port: ${port}`);
});