import { test, expect } from "@playwright/test";
import exp from "constants";
const UI_URL = "http://localhost:3000/";
import path from "path";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("kentrellmalone@gmail.com");
  await page.locator("[name=password]").fill("123123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Name");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill("Test Description");
  await page.locator('[name="description"]').fill("This is a Test Description");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();

  await page.locator("[name='adultCount']").fill("2");
  await page.locator("[name='childCount']").fill("4");

  await page.setInputFiles("[name='imageFiles']", [
    path.join(__dirname, "files", "1.jpg"),
    path.join(__dirname, "files", "1.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel Saved")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Test Name")).toBeVisible();
  await expect(page.getByText("Description")).toBeVisible();
  await expect(page.getByText("Test City,Test Country")).toBeVisible();
  await expect(page.getByText("Budget")).toBeVisible();
  await expect(page.getByText("$100 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 4 children")).toBeVisible();
  await expect(page.getByText("3 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Test Name ");
  await page.locator('[name="name"]').fill("kitty");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Updated!")).toBeVisible();

  await page.reload();
  await expect(page.locator('[name="name"]')).toHaveValue("kitty");
  await page.locator('[name="name"]').fill("Test Name");
  await page.getByRole("button", { name: "Save" }).click();
});
