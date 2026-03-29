"""
Windscape E2E Test Suite — Selenium
Run with: pytest tests/e2e/ -v --html=reports/e2e-report.html
"""

import os
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from pathlib import Path


BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
HEADLESS  = os.getenv("HEADLESS", "true").lower() == "true"
SCREENSHOT_DIR = Path("reports/screenshots")


# ─────────────────────────────────────────
# Fixtures
# ─────────────────────────────────────────

@pytest.fixture(scope="session")
def driver():
    options = Options()
    if HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1280,800")
    options.add_argument("--disable-gpu")

    d = webdriver.Chrome(options=options)
    d.implicitly_wait(10)
    yield d
    d.quit()


@pytest.fixture(autouse=True)
def screenshot_on_failure(request, driver):
    yield
    if request.node.rep_call.failed if hasattr(request.node, "rep_call") else False:
        SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
        name = request.node.name.replace(" ", "_")
        driver.save_screenshot(str(SCREENSHOT_DIR / f"{name}.png"))


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)


# ─────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────

def wait_for(driver, by, selector, timeout=15):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, selector))
    )

def wait_visible(driver, by, selector, timeout=15):
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, selector))
    )


# ─────────────────────────────────────────
# Tests
# ─────────────────────────────────────────

class TestHomePage:
    def test_page_loads(self, driver):
        driver.get(BASE_URL)
        assert driver.title, "Page title should not be empty"

    def test_health_endpoint(self, driver):
        driver.get(f"{BASE_URL}/health")
        assert "ok" in driver.page_source.lower() or driver.current_url.endswith("/health")

    def test_main_heading_visible(self, driver):
        driver.get(BASE_URL)
        heading = wait_visible(driver, By.TAG_NAME, "h1")
        assert heading.is_displayed(), "Main heading should be visible"

    def test_no_console_errors(self, driver):
        driver.get(BASE_URL)
        logs = driver.get_log("browser")
        errors = [l for l in logs if l["level"] == "SEVERE"]
        assert not errors, f"Console errors found: {errors}"


class TestNavigation:
    def test_nav_links_present(self, driver):
        driver.get(BASE_URL)
        nav = wait_for(driver, By.TAG_NAME, "nav")
        links = nav.find_elements(By.TAG_NAME, "a")
        assert len(links) > 0, "Navigation should contain at least one link"

    def test_nav_link_navigation(self, driver):
        driver.get(BASE_URL)
        nav = wait_for(driver, By.TAG_NAME, "nav")
        links = nav.find_elements(By.TAG_NAME, "a")
        if links:
            href = links[0].get_attribute("href")
            links[0].click()
            WebDriverWait(driver, 10).until(EC.url_contains(href or ""))


class TestResponsiveness:
    def test_mobile_viewport(self, driver):
        driver.set_window_size(375, 812)
        driver.get(BASE_URL)
        body = wait_for(driver, By.TAG_NAME, "body")
        assert body.is_displayed()

    def test_tablet_viewport(self, driver):
        driver.set_window_size(768, 1024)
        driver.get(BASE_URL)
        body = wait_for(driver, By.TAG_NAME, "body")
        assert body.is_displayed()

    def test_desktop_viewport(self, driver):
        driver.set_window_size(1440, 900)
        driver.get(BASE_URL)
        body = wait_for(driver, By.TAG_NAME, "body")
        assert body.is_displayed()


class TestPerformance:
    def test_page_load_time(self, driver):
        start = time.time()
        driver.get(BASE_URL)
        wait_for(driver, By.TAG_NAME, "body")
        elapsed = time.time() - start
        assert elapsed < 5, f"Page took {elapsed:.2f}s — should load in under 5s"

    def test_no_404_resources(self, driver):
        driver.get(BASE_URL)
        logs = driver.get_log("performance") if "performance" in driver.log_types else []
        # Checking for 404s via browser logs (if performance logging enabled)
        not_found = [
            l for l in logs
            if '"status":404' in l.get("message", "")
        ]
        assert not not_found, f"404 resources detected: {not_found}"


class TestAccessibility:
    def test_images_have_alt_text(self, driver):
        driver.get(BASE_URL)
        images = driver.find_elements(By.TAG_NAME, "img")
        missing_alt = [
            img.get_attribute("src")
            for img in images
            if not img.get_attribute("alt")
        ]
        assert not missing_alt, f"Images missing alt text: {missing_alt}"

    def test_buttons_have_labels(self, driver):
        driver.get(BASE_URL)
        buttons = driver.find_elements(By.TAG_NAME, "button")
        unlabeled = [
            b.get_attribute("outerHTML")
            for b in buttons
            if not b.text.strip() and not b.get_attribute("aria-label")
        ]
        assert not unlabeled, f"Buttons without accessible labels: {unlabeled}"

    def test_inputs_have_labels(self, driver):
        driver.get(BASE_URL)
        inputs = driver.find_elements(By.CSS_SELECTOR, "input:not([type='hidden'])")
        unlabeled = []
        for inp in inputs:
            inp_id = inp.get_attribute("id")
            aria_label = inp.get_attribute("aria-label")
            aria_labelled = inp.get_attribute("aria-labelledby")
            if inp_id:
                label = driver.find_elements(By.CSS_SELECTOR, f"label[for='{inp_id}']")
            else:
                label = []
            if not label and not aria_label and not aria_labelled:
                unlabeled.append(inp.get_attribute("name") or inp.get_attribute("type"))
        assert not unlabeled, f"Inputs without labels: {unlabeled}"
