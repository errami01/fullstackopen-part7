import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { beforeEach, describe } from "vitest";

describe("testing what Blog component render", () => {
  let container;
  beforeEach(() => {
    const blog = {
      title: "test blog",
      author: "tester",
      url: "hello.com",
    };
    container = render(<Blog blog={blog} />).container;
  });
  test("Blog renders the blog's title and author", () => {
    const element = screen.getByText("test blog tester");
    expect(element).toBeDefined();
  });
  test("Blog does not render its URL or number of likes by default", () => {
    const div = container.querySelector(".hiddenInfo");
    expect(div).toBeNull();
  });
  test("Blog render URL and number of likes after view button click", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);
    const div = container.querySelector(".hiddenInfo");
    expect(div).toBeDefined();
    expect(div).toHaveTextContent("hello.comlikes");
  });
});
describe("Testing a prop function", () => {
  test("if the like button is clicked twice, the event handler the component received as props is called twice", async () => {
    const blog = {
      title: "test blog",
      author: "tester",
      url: "hello.com",
      user: {
        id: "83723948",
      },
    };
    const mockHandler = vi.fn();
    render(<Blog blog={blog} update={mockHandler} />);
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
