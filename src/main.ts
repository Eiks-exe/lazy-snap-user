import puppeteer, { Browser, Page } from "puppeteer";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const getFriends =async (browser: Browser, page: Page) => {
    async function example() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
      
        // Navigate to a page
      
        // Get all elements with the text content "More information"
        const elements = await page.evaluate(() => {
          const textToFind = '💎';
          const xpath = `//*[contains(text(), '${textToFind}')]`;
          const nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
          const elements = [];
          let node;
          while (node = nodes.iterateNext()) {
            elements.push(node);
          }
          return elements;
        });
      
        // Do something with the elements
        for (const element of elements) {
        //@ts-ignore
          const text = await element.evaluate(e => e.innerText);
          console.log(text);
        }
      
        await browser.close();
      }
      
      example().catch(console.error);
}

const main = async ()=>{
    const browser =await  puppeteer.launch({headless: false, executablePath: process.env.CHROMIUM_PATH});
    const context = await browser.createIncognitoBrowserContext();
    const page = await  context.newPage();
    await page.goto("https://accounts.snapchat.com/accounts/v2/login?continue=%2Faccounts%2Fsso%3Freferrer%3Dhttps%253A%252F%252Fweb.snapchat.com%252F%26client_id%3Dweb-calling-corp--prod");
    
    let url: string;

    url = await page.url();
    while (url != "https://web.snapchat.com/") {
        await Promise.all([
            page.waitForNavigation({waitUntil: "networkidle0", timeout: 180000})
        ])
        url = await page.url();
        console.log(page.url())
    }
    await context.overridePermissions('https://example.com', ['microphone', 'camera']);
    console.log("ok")
    await page.waitForSelector('button.mBiMV');

    // click the button
    await page.click('button.mBiMV');

    await page.waitForSelector('button.FBYjn')
    await page.click('button.FBYjn')

};

main()