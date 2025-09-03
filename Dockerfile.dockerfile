name: Scheduled Playwright Scraper

on:
  schedule:
    - cron: '*/15 * * * *' # Runs every 15 minutes
  workflow_dispatch: {} # Allows manual trigger

jobs:
  run-playwright:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright script
        env:
          USERNAME: ${{ secrets.USERNAME }}
          PASSWORD: ${{ secrets.PASSWORD }}
        run: node fetch_data.js
