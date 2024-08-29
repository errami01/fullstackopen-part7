import helper from "./helper";
const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "nki",
        username: "abdo",
        password: "salainen",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByTestId("login-form")).toBeVisible();
  });
  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await helper.logIn(page, "abdo", "salainen");
      await expect(page.getByText("nki abdo is logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await helper.logIn(page, "abdo", "salain");
      await expect(page.getByText("Wrong username or passowrd")).toBeVisible();
    });
  });
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      helper.logIn(page, "abdo", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await helper.createBlog(page, "Tirge", "ahmed", "cocot.com");
      await expect(
        page.getByTestId("blogs-list").getByText("Tirge ahmed"),
      ).toBeVisible();
    });
    test("blogs are arranged in the order with the most likes first", async ({
      page,
    }) => {
      await helper.createBlog(page, "title1", "author1", "url1");
      await expect(page.locator(".blog-container")).toHaveCount(1);
      await helper.createBlog(page, "title2", "author2", "url2");
      await expect(page.locator(".blog-container")).toHaveCount(2);
      await helper.createBlog(page, "title3", "author3", "url3");
      await expect(page.locator(".blog-container")).toHaveCount(3);
      await helper.addLikes(page, expect, "title1 author1", 0);
      await helper.addLikes(page, expect, "title2 author2", 3);
      await helper.addLikes(page, expect, "title3 author3", 1);
      await expect(page.locator(".blog-container").nth(0)).toHaveText(/title2/);
      await expect(page.locator(".blog-container").nth(1)).toHaveText(/title3/);
      await expect(page.locator(".blog-container").nth(2)).toHaveText(/title1/);
    });
    describe("when blog created", () => {
      beforeEach(async ({ page }) => {
        await helper.createBlog(page, "Tirge", "ahmed", "cocot.com");
      });
      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByRole("button", { name: "like" })).toBeVisible();
      });
      test("a blog can be deleted by the creator user", async ({ page }) => {
        await page
          .getByText("Tirge ahmed")
          .getByRole("button", { name: "view" })
          .click();
        page.on("dialog", (dialog) => dialog.accept());
        await page
          .getByText("Tirge ahmed")
          .getByRole("button", { name: "remove" })
          .click();
        await expect(page.getByText("Tirge ahmed")).toHaveCount(0);
      });
      test("only the user who added the blog sees the blog's delete button", async ({
        page,
        request,
      }) => {
        await request.post("http://localhost:3003/api/users", {
          data: {
            name: "qwe",
            username: "asd",
            password: "zxc",
          },
        });
        await page
          .getByText("Tirge ahmed")
          .getByRole("button", { name: "view" })
          .click();
        await expect(
          page.getByText("Tirge ahmed").getByRole("button", { name: "remove" }),
        ).toHaveCount(1);
        await page.getByRole("button", { name: "logout" }).click();
        await helper.logIn(page, "asd", "zxc");
        await page
          .getByText("Tirge ahmed")
          .getByRole("button", { name: "view" })
          .click();
        await expect(
          page.getByText("Tirge ahmed").getByRole("button", { name: "remove" }),
        ).toHaveCount(0);
      });
    });
  });
});
