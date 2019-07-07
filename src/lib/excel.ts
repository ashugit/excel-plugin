import { Config } from "./defaults";
import { Row } from "./components/row";
import { Scroll } from "./scroll";

export class Excel {
  private root: any;
  private config: any;
  private data: any;
  private rows: any;
  private scrollPoint: any;
  private nodeIdOnEdit: any;
  private textEditNode: any;
  private contextualMenu: any;
  private sortOnColumnIndex: any;
  private sortAcending: any;
  private activeCellIndex: any;
  private activeRowIndex: any;
  private rightClickCell: any;

  /**
   *
   * @param {*} element
   * @param {*} config
   * @param {*} data
   */
  constructor(element, config, data) {
    this.root = element;
    this.config = Object.assign({}, Config, config);
    this.data = data;
    this.rows = [];
    this.scrollPoint = { scroll: { row: 0, col: 0 } };
    this.nodeIdOnEdit = null;
    this.textEditNode = null;
    this.contextualMenu = null;
    this.sortOnColumnIndex = null;
    this.sortAcending = true;
  }

  /**
   *
   * @param {*} node
   */
  setupScrollHandling(div) {
    const scrollHandler = {
      get: (obj, prop) => obj[prop],
      set: (obj, prop, val) => {
        obj[prop] = val;
        this.remapData();
        return true;
      }
    };
    const scrollPointProxy = new Proxy(this.scrollPoint, scrollHandler);
    const scroll = new Scroll(div, this.config, scrollPointProxy);
    div.appendChild(scroll.getVScroll());
    div.appendChild(scroll.getHScroll());
    scroll.initializeScrolls();
  }
  /**
   *
   */
  remapData() {
    const startRow = this.scrollPoint.scroll.row;
    const startCol = this.scrollPoint.scroll.col;
    this.rows.forEach((row, index) => {
      if (!index) {
        row.onChangeRef(0, startCol);
      } else {
        row.onChangeRef(startRow + index, startCol);
      }
    });
  }
  /**
   *
   */
  init() {
    const div = document.createElement("div");
    div.className = "tbl";
    let i = 0;

    this.setupHeaders();
    this.setupLabels();
    for (i = 0; i < this.config.rows; i++) {
      if (!this.data[i]) this.data[i] = {};
      this.rows[i] = new Row(div, this.config, this.data, i);
      div.appendChild(this.rows[i].getNode());
    }
    this.root.appendChild(div);
    this.addCustomEventListener(div);
    if (this.config.scrollable) this.setupScrollHandling(div);
    this.initContextualMenu(div);
  }

  /**
   *
   */
  setupHeaders() {
    const headers = [];
    for (let i = 1; i < this.config.minLabeledCols; i++) {
      headers[i] = "col:" + i;
      if (this.sortOnColumnIndex === i) {
        headers[i] += " " + (this.sortAcending ? "&#8595" : "&#8593");
      }
    }
    this.data[0] = headers;
  }

  /**
   *
   */
  setupLabels() {
    for (let i = 1; i < this.config.minLabeledRows; i++) {
      if (!this.data[i]) {
        this.data[i] = { 0: i };
      } else {
        this.data[i][0] = i;
      }
    }
  }

  /**
   *
   */
  applySort(cellIndex) {
    if (cellIndex === this.sortOnColumnIndex) {
      this.sortAcending = !this.sortAcending;
    } else {
      this.sortOnColumnIndex = cellIndex;
      this.sortAcending = true;
    }
    /* Find the last row upto which we need to sort */
    let sortUpto = 0;
    const sortables = [];
    for (let i = 1; i < this.config.minLabeledRows; i++) {
      if (Object.keys(this.data[i]).length > 1) {
        if (sortUpto < i) {
          sortUpto = i;
        }
      }
    }
    const sortIndexes = [];
    for (let i = 1; i < sortUpto; i++) {
      sortables.push(this.data[i]);
    }

    sortables.sort((a, b) => {
      const valA = a[cellIndex] || "";
      const valB = b[cellIndex] || "";
      let result = 0;
      if (valA > valB) {
        result = this.sortAcending ? 1 : -1;
      } else if (valA < valB) {
        result = this.sortAcending ? -1 : 1;
      }
      return result;
    });

    sortables.forEach((e, index) => {
      this.data[index] = e;
    });

    this.setupHeaders();
    this.setupLabels();
    this.remapData();
  }

  /**
   * Setup click listener emit from cell
   */
  addCustomEventListener(div) {
    /**
     *
     */
    div.addEventListener("startEdit", e => {
      const edittingCell = document.getElementById(e.cellId);
      this.activeCellIndex = e.cellIndex;
      this.activeRowIndex = e.rowIndex;

      if (this.nodeIdOnEdit && this.nodeIdOnEdit !== e.cellId) {
        const cachedCellOnEdit = document.getElementById(this.nodeIdOnEdit);
        cachedCellOnEdit.innerHTML = this.textEditNode.value;
        this.nodeIdOnEdit = "";
        this.textEditNode.value = "";
      }
      /* Dont allow editing of label and header */
      if (e.cellIndex && e.rowIndex) {
        if (this.nodeIdOnEdit !== e.cellId) {
          edittingCell.appendChild(this.getEditorCellTextBox(edittingCell));
          this.nodeIdOnEdit = e.cellId;
          this.textEditNode.focus();
        }
      }

      /* initiate sort */
      if (!e.rowIndex && e.cellIndex) {
        this.applySort(e.cellIndex);
      }
    });

    /**
     *
     */
    div.addEventListener("showRightClickMenu", e => {
      this.rightClickCell = document.getElementById(e.cellId);
      this.activeCellIndex = e.cellIndex;
      this.activeRowIndex = e.rowIndex;
      const menuNode = this.contextualMenu;
      menuNode.style.position = "absolute";
      menuNode.style.top = this.rightClickCell.getBoundingClientRect().top + 10;
      menuNode.style.left =
        this.rightClickCell.getBoundingClientRect().left + 30;
      menuNode.classList.remove("hide");
    });
  }
  /**
   *
   */
  onEditTextChangedText(e) {
    if (e.target.value) {
      if (!this.data[this.activeRowIndex]) this.data[this.activeRowIndex] = {};
      if (!this.data[this.activeRowIndex][this.activeCellIndex])
        this.data[this.activeRowIndex][this.activeCellIndex] = {};
      this.data[this.activeRowIndex][this.activeCellIndex] = e.target.value;
    } else {
      delete this.data[this.activeRowIndex][this.activeCellIndex];
      const keys = Object.keys(this.data[this.activeRowIndex]);
      if (keys.length <= 1) delete this.data[this.activeRowIndex];
    }
  }
  /**
   *
   * @param {*} cellNode
   */
  getEditorCellTextBox(cellNode) {
    if (!this.textEditNode) {
      this.textEditNode = document.createElement("textarea");
      this.textEditNode.className = "tbl-cell-editor-text";
      this.textEditNode.rows = "1";
      this.textEditNode.onchange = e => this.onEditTextChangedText(e);
    }
    this.textEditNode.value = cellNode.innerHTML;
    cellNode.innerHTML = "";
    return this.textEditNode;
  }
  /**
   *
   * @param {*} row
   * @param {*} colIndex
   */
  addANewColumnInRow(row, colIndex) {
    for (let i = this.config.minLabeledCols; i >= colIndex; i--) {
      if (row.hasOwnProperty(i)) {
        row[i + 1] = row[i];
      }
    }
    delete row[colIndex];
  }
  /**
   *
   * @param {*} row
   * @param {*} colIndex
   */
  removeColumnInRow(row, colIndex) {
    const keys = Object.keys(row).sort();
    delete row[colIndex];
    for (let i = colIndex + 1; i < this.config.minLabeledCols; i++) {
      if (row.hasOwnProperty(i)) {
        row[i - 1] = row[i];
        delete row[i];
      }
    }
  }
  /**
   *
   * @param {*} rowIndex
   */
  addANewRow(rowIndex) {
    for (let i = this.config.minLabeledRows; i >= rowIndex; i--) {
      if (this.data.hasOwnProperty(i)) {
        this.data[i + 1] = this.data[i];
      }
    }
    delete this.data[rowIndex];
  }
  /**
   *
   * @param {*} rowIndex
   */
  removeRow(rowIndex) {
    for (let i = rowIndex + 1; i < this.config.minLabeledRows; i++) {
      if (this.data.hasOwnProperty(i)) {
        this.data[i - 1] = this.data[i];
        delete this.data[i];
      }
    }
  }
  /**
   *
   * @param {*} choice
   */
  onContextMenuChoiceClick(choice) {
    switch (choice) {
      case "click-add-to-left":
        for (const rowIndex in this.data)
          if (parseInt(rowIndex, 10))
            this.addANewColumnInRow(this.data[rowIndex], this.activeCellIndex);
        this.remapData();
        break;
      case "click-add-to-right":
        for (const rowIndex in this.data)
          if (parseInt(rowIndex, 10))
            this.addANewColumnInRow(
              this.data[rowIndex],
              this.activeCellIndex + 1
            );
        this.remapData();
        break;
      case "click-delete-column":
        for (const rowIndex in this.data)
          if (parseInt(rowIndex, 10))
            this.removeColumnInRow(this.data[rowIndex], this.activeCellIndex);
        this.remapData();
        break;
      case "click-add-to-top":
        if (this.activeRowIndex) {
          this.addANewRow(this.activeRowIndex);
          this.setupLabels();
          this.remapData();
        }
        break;
      case "click-add-to-bottom":
        if (this.activeRowIndex) {
          this.addANewRow(this.activeRowIndex + 1);
          this.setupLabels();
          this.remapData();
        }
        break;
      case "click-delete-row":
        if (this.activeRowIndex) {
          this.removeRow(this.activeRowIndex);
          this.setupLabels();
          this.remapData();
        }
        break;
    }
  }
  /**
   *
   * @param {*} div
   */
  initContextualMenu(div) {
    if (!this.contextualMenu) {
      this.contextualMenu = document.createElement("div");
      this.contextualMenu.className = "hide";
      this.contextualMenu.id = "tbl-menu";
      const html =
        " <ul>" +
        '<li id="click-add-to-left" >Add column to left</li>' +
        '<li id="click-add-to-right">Add column to right</li>' +
        '<li id="click-delete-column">Delete this column</li>' +
        "<hr/>" +
        '<li id="click-add-to-top">Add a row above</li>' +
        '<li id="click-add-to-bottom">Add a row below</li>' +
        '<li id="click-delete-row">Delete this row</li>' +
        "</ul>";
      this.contextualMenu.innerHTML = html;
      this.contextualMenu.onclick = e => {
        this.contextualMenu.classList.add("hide");
        this.onContextMenuChoiceClick(e.target.getAttribute("id"));
      };
      div.appendChild(this.contextualMenu);
    }

    return this.contextualMenu;
  }
}
