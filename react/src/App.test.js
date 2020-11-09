import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders homepage", () => {
  render(<App />);
  const linkElement = screen.getByText(/Just another WordPress site/i);
  expect(linkElement).toBeInTheDocument();
});
