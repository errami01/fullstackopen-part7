import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("BlogForm inputs and submit", async () => {
  const createBlog = vi.fn();
  render(<BlogForm createBlog={createBlog} />);
  const titleInput = screen.getByPlaceholderText("title");
  const authorInput = screen.getByPlaceholderText("author");
  const urlInput = screen.getByPlaceholderText("url");
  const sendButton = screen.getByText("create");

  await userEvent.type(titleInput, "title test");
  await userEvent.type(authorInput, "author test");
  await userEvent.type(urlInput, "url test");

  await userEvent.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("title test");
  expect(createBlog.mock.calls[0][0].author).toBe("author test");
  expect(createBlog.mock.calls[0][0].url).toBe("url test");
});
