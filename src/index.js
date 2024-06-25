const puppeteer = require("puppeteer");

const handler = async () => {
  try {
    const browser = await puppeteer.launch({
      args: [
        "--headless"
      ]
    });
    const page = await browser.newPage();
    await page.goto("https://example.com/", { waitUntil: "networkidle2" });
    await page.pdf({
      path: "/tmp/example.pdf",
      printBackground: true,
      format: "A4"
    });
  
    await browser.close();

    return new Promise((resolve) => {
      setTimeout(resolve, 100000);
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

handler().then(() => console.log("Done"));