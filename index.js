const pdfService = require('./modules/pdf-service');

const express = require('express');
const cors = require('cors');
const booleanParser = require('express-query-boolean');
const numberParser = require('express-query-int');

const app = express()
const port = 3000

app.use(booleanParser());
app.use(numberParser());

app.get('/pdfs', cors(), async (request, response) => {
  const browser = await pdfService.launchBrowser();
  const { filename, options } = parseRequest(request);
  const res = await pdfService.printPdf({ htmlContents: request.body, browser, options });
  await browser.close();
  response.attachment(`${filename}.pdf`).send(res);
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