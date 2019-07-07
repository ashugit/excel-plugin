import { toBeInTheDocument, toHaveClass } from 'jest-dom'
import createMockDom from './mockDom';

expect.extend({ toBeInTheDocument, toHaveClass });

test("check table is mounted on DOM", () => {
  const { document } = createMockDom();

  expect(document.querySelector(".tbl")).toBeInTheDocument();

})

test("check row is mounted on DOM", () => {
  const { document } = createMockDom();
  expect(document.getElementById("Row-2701")).toBeInTheDocument();
});

test("check number of rows", () => {
  const { document } = createMockDom(5, 5);
  expect(document.querySelectorAll(".tbl-row").length).toBe(5);
});

test("check number of columns", () => {
  const { document } = createMockDom(5, 5);
  expect(document.querySelectorAll(".tbl-cell").length).toBe(5*5);
});
