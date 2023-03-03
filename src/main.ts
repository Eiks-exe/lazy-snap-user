import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import UserCookies from "./utils/cookies";
import * as fs from "fs";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox"],
    userDataDir: "./utils/myuserDataDir",
  });
  const context = await browser.defaultBrowserContext();
  const page = await browser.newPage();
  const expectedUrl = "https://web.snapchat.com/";

  await context.clearPermissionOverrides();
  await context.overridePermissions(expectedUrl, ["camera", "microphone"]);
  await page.goto("https://web.snapchat.com/");

  setTimeout(async () => {
    const ShotButton = await page.waitForSelector("button.FBYjn");
    
    await ShotButton?.click().then(async () => {
      if (ShotButton) ShotButton.click();
      console.log("snapped");
      if (ShotButton) ShotButton.click();
      const sendButton = await page.waitForSelector("button.eiRwx");
      await sendButton?.click().then(async () => {
        console.log("sending...");
        const friendsElement = await page.$$('ul.UxcmY>li>div.Ewflr')
        console.log(friendsElement)
        friendsElement.forEach(async (element) => {
          await element.click()
        })
        
        /* const elementsWithEmoji = await page.$$(
          '.UxcmY > .Ewflr:not(iframe):not(script)x'
        );
        const filteredElement = elementsWithEmoji.filter((element)=>{
          return element
        })
  
        
          for(const element of elementsWithEmoji){
            await element.click()
          } */
        
      });
    });
  }, 5000);
};

main();
