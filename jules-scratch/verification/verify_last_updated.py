from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/wiki")

        # Wait for the "Last updated" text to be visible
        last_updated_text = page.locator('p:has-text("Last updated")')
        expect(last_updated_text).to_be_visible()

        # Take a screenshot of the header
        header_element = page.locator(".bg-gray-800.border.border-gray-700").first
        header_element.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run_verification()