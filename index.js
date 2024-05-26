const pdfService = require('./modules/pdf-service');

const express = require('express');
const cors = require('cors');
const booleanParser = require('express-query-boolean');
const numberParser = require('express-query-int');
const {queryParser}  = require('express-query-parser');

const app = express()
const port = 3000

app.use(booleanParser());
app.use(numberParser());
app.use(queryParser({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true
}));

app.get('/pdfs', cors(), async (request, response) => {
  const browser = await pdfService.launchBrowser();
  const res = await pdfService.printPdf({ url: request.query.url, browser, options: {} });
  await browser.close();
  response.attachment(`name.pdf`).send(res);
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