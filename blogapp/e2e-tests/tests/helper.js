const logIn = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};
const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};
const addLikes = async (page, expect, text, numberOfLikes) => {
  await page.getByText(text).getByRole("button", { name: "view" }).click();
  for (let i = 0; i < numberOfLikes; i++) {
    await page.getByText(text).getByRole("button", { name: "like" }).click();
    await expect(page.getByText(text).getByTestId("likes-count")).toHaveText(
      (i + 1).toString(),
    );
  }
};
export default {
  createBlog,
  logIn,
  addLikes,
};
