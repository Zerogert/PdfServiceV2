const pdfService = require('./modules/pdf-service');

const express = require('express');
const cors = require('cors');
const booleanParser = require('express-query-boolean');
const numberParser = require('express-query-int');
const bodyParser = require('body-parser');
const { queryParser } = require('express-query-parser');

const app = express()
const port = 3000

app.use(booleanParser());
app.use(numberParser());
app.use(bodyParser.text({ type: 'text/html' }));
app.use(queryParser({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true
}));

function getOptions(request) {
  return { format: 'a4', landscape: false, printBackground: true, waitUntil: 'networkidle0', ...request.query, path: null };
}

app.get('/pdfs', cors(), async (request, response) => {
  options = getOptions(request);
  const browser = await pdfService.launchBrowser();
  try {
    const result = await pdfService.getPdfFromUrl({ url: request.query.url, browser, options: options });
    response.attachment(`document.pdf`).send(result);
    return;
  }
  catch (err) {
    response.sendStatus(400);
    return;
  }
  finally {
    await browser.close();
  }
});

app.get('/healthcheck', cors(), async (request, response) => {
  const browser = await pdfService.launchBrowser();
  const result = await pdfService.getPdfFromUrl({ url: 'https://www.google.com/', browser, options: {} });
  await browser.close();
  response.sendStatus(200);
});

app.get('/', cors(), async (request, response) => {
  response.sendStatus(200);
});

app.post('/pdfs', cors(), async (request, response) => {
  options = getOptions(request);
  const browser = await pdfService.launchBrowser();
  try {
    const result = await pdfService.getPdfFromHtml({ htmlContents: request.body, browser, options: options });
    response.attachment(`document.pdf`).send(result);
    return;
  } catch (err) {
    response.sendStatus(400);
    return;
   }
  finally {
    await browser.close();
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