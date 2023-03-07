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
  
  const ShotButton = await page.waitForSelector("button.FBYjn");
  
  console.log("waiting...")
  const camSquare = await page.waitForSelector(".J_Y1K")
  const camSquareClassList = (await camSquare?.getProperty("className"))?.toString()

  
  const CamShot = async () => {
    console.log("cam already turned on shooting", camSquareClassList)
    await ShotButton?.click().then(async ()=>{
      console.log("picture taken!")
      const sendingButton = await page.$('button.eiRwx')
      await sendingButton?.click().then(async ()=>{
        console.log("select users:")
        const searchInput = await page.$$("input.dmsdi")
        await searchInput[1]?.type("💎")
        const radioSelectors = await page.$$("div.Ewflr")
        console.log(radioSelectors.length)
        for(const radio of radioSelectors){
          const radioProperty = (await radio.getProperty('className')).toString()
          console.log(radioProperty)
          await radio.click()
        }
      const finalSendButton = await page.$("button.xjFne")
      await finalSendButton?.click().then(()=>{
        console.log("image sended")
        setTimeout(()=>{
          browser.close()
        }, 3000)
      })
      })
    } )
  }
  const turnOnCam = async () => {
    console.log("turning on camera...", camSquareClassList)
    await camSquare?.click().then(
      async ()=>{
        if(!camSquareClassList?.includes("pky39")) console.log("cam turned on")
        CamShot();
      }
    )


  }

  setTimeout(async () => {
    if (!camSquare) return;
    camSquareClassList?.includes("pky39") ? turnOnCam() : CamShot();
    const cls = (await ShotButton?.getProperty("className"))?.toString()
    if(!cls) return;
    console.log(cls)
    console.log("done!")
  }, 1000);


  
};

main()

setInterval(()=>{
  main()
}, 1000*3600*8)