import { toBeInTheDocument, toHaveClass } from "jest-dom";
import createMockDom from "./mockDom";

expect.extend({ toBeInTheDocument, toHaveClass });

function getCellIndex(totalRow, totalCol, cell) {
  const { row, col } = cell;
  if (row > totalRow - 1) {
    return;
  }
  if (col > totalCol - 1) {
    return;
  }

  return row * totalCol + (col + 1);
}

describe('DOM element test cases', () => {
  test("check table is mounted on DOM", () => {
    const { document } = createMockDom();

    expect(document.querySelector(".tbl")).toBeInTheDocument();
  });


  test("check number of rows", () => {
    const { document } = createMockDom(5, 5);
    expect(document.querySelectorAll(".tbl-row").length).toBe(5);
  });

  test("check number of columns", () => {
    const { document } = createMockDom(5, 5);
    expect(document.querySelectorAll(".tbl-cell").length).toBe(5 * 5);
  });

  test("check click on cell to create textarea", () => {
    const { document } = createMockDom(3, 5);
    document.querySelectorAll(".tbl-cell")[7].click();
    expect(document.querySelectorAll(".tbl-cell-editor-text").length).toBe(1);
  });
});

describe('context menu test cases', () => {
  const MAX_ROW = 3;
  const MAX_COL = 5
  const { document } = createMockDom(MAX_ROW, MAX_COL);

  // open context menu for given row, col
  function openContextMenu(row, col) {
    const cellIndex = getCellIndex(MAX_ROW, MAX_COL, { row, col });
    document
      .querySelectorAll(".tbl-cell")
      [cellIndex].dispatchEvent(new CustomEvent("contextmenu"));
  }

  function closeContextMenu() {
    document.getElementById("tbl-menu").click();
  }

  function getCellData(row, col) {
    const cellIndex = getCellIndex(MAX_ROW, MAX_COL, {row,col});
    return document.querySelectorAll(".tbl-cell")[cellIndex]
      .innerHTML;
  }

  describe('column related actions', () => {
    test("check right click on cell to show menu", () => {
      openContextMenu(1, 1);
      expect(document.getElementById("tbl-menu").className).toBe("");
      closeContextMenu();
    });

    test("check click on context menu to hide it", () => {
      openContextMenu(1,1);
      closeContextMenu();
      expect(document.getElementById("tbl-menu").className).toBe("hide");
    });

    test("check click on add column to left to move current col data to next col on right", () => {
      const currntCellData = getCellData(2,1);

      openContextMenu(2,1);
      document.getElementById("click-add-to-left").click();

      const nextCellData = getCellData(2, 2);

      expect(nextCellData).toBe(currntCellData);
    });

    test("check click on add column to right to create empty col on the right", () => {
      openContextMenu(1, 1);
      document.getElementById("click-add-to-right").click();
      const nextCellData = getCellData(1,2);

      expect(nextCellData).toBe("");
    });

    test("check click on delete column to move data from column on right to current col", () => {
      const nextCellData = getCellData(1,2);
      openContextMenu(1, 1);
      document.getElementById("click-delete-column").click();
      const currntCellData = getCellData(1,1)

      expect(currntCellData).toBe(nextCellData);
    });
  })

  describe('row related actions', () => {
    test("check click on add a row above", () => {
      const currntCellData = getCellData(1,1)
      openContextMenu(1, 1);
      document.getElementById("click-add-to-top").click();
      const nextRowData = getCellData(2,1);
      expect(nextRowData).toBe(currntCellData);
    });

    test("check click on add a row to bottom", () => {
      const cellIndex = getCellIndex(3, 5, { row: 1, col: 1 });
      openContextMenu(1, 1);
      document.getElementById("click-add-to-bottom").click();
      const nextRowData = getCellData(2,1);
      expect(nextRowData).toBe("");
    });

    test("check click on delete row", () => {
      const nextRowData = getCellData(2,1);
      openContextMenu(1, 1);
      document.getElementById("click-delete-row").click();
      const currCellData = getCellData(1,1)
      expect(nextRowData).toBe(currCellData);
    });
  });
})

describe('sort test cases', () => {
  const MAX_ROW = 3;
  const MAX_COL = 5;
  test("check click on delete row", () => {
    const { document } = createMockDom(MAX_ROW, MAX_COL);
    const firstColHeader = document.querySelectorAll(".tbl-cell")[1];
    firstColHeader.click();
    expect(firstColHeader.innerHTML).toBe("col:1 ↓");
  });

  test("check click on delete row", () => {
    const { document } = createMockDom(MAX_ROW, MAX_COL);
    const firstColHeader = document.querySelectorAll(".tbl-cell")[1];
    // first click to sort
    firstColHeader.click();
    firstColHeader.click();
    expect(firstColHeader.innerHTML).toBe("col:1 ↑");
  });
});
