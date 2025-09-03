// General Playwright Scraper Template
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Load cookies if saved
  if (fs.existsSync('cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('cookies.json'));
    await context.addCookies(cookies);
    console.log('Loaded saved cookies.');
  }

  const page = await context.newPage();

  // Change these URLs for your site
  const loginUrl = 'https://example.com/login';
  const targetUrl = 'https://example.com/dashboard';

  try {
    // Go to login page
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    console.log(`Opened: ${loginUrl}`);

    const usernameField = page.locator('input[name="username"]');
    const passwordField = page.locator('input[name="password"]');

    // Login if needed
    if (await usernameField.isVisible() && await passwordField.isVisible()) {
      console.log('Login fields found. Logging in...');
      await usernameField.fill(process.env.USERNAME || 'my-username');
      await passwordField.fill(process.env.PASSWORD || 'my-password');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle' });

      // Save cookies
      const cookies = await context.cookies();
      fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
      console.log('Cookies saved.');
    } else {
      console.log('Already logged in or login fields not visible.');
    }

    // Go to target page
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    console.log(`Opened: ${targetUrl}`);

    // Scrape example elements
    const items = await page.locator('.item-selector').allTextContents();
    console.log('Scraped items:', items);

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
})();
