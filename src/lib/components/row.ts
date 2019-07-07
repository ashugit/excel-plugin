import { Component } from "./component";
import { Cell } from "./cell";

export class Row extends Component {
  private rootTag: any;
  private rootClass: any;
  private cells: any;
  private parentNode: any;
  private colOffset: any;
  private data: any;
  constructor(parentNode, config, data, index) {
    super();
    this.rootTag = "div";
    this.rootClass = "tbl-row";
    this.cells = [];
    this.parentNode = parentNode;
    this.colOffset = 0;
    this.data = data;
    this.setIndex(index);
    this.setConfig(config);
  }
  /**
   *
   */
  getRootTag() {
    return this.rootTag;
  }
  /**
   *
   */
  getDefaultClass() {
    return this.rootClass;
  }
  /**
   *
   * @param {*} n
   */
  getNthCell(n) {
    return this.cells[n];
  }

  appendNthNode(n, node) {
    const rootNode = this.getNode();
    if (n >= rootNode.children.length) {
      rootNode.appendChild(node);
    } else {
      rootNode.insertBefore(node, rootNode.children[n]);
    }
  }

  addNthCell(n, cellData) {
    const cell = new Cell(
      this,
      this.getConfig(),
      this.data,
      this.getIndex(),
      n
    );
    this.cells.splice(n, 0, cellData);
    this.appendNthNode(n, cell.getNode());
  }

  removeNthCell(n) {
    this.cells.splice(n);
  }

  getNode() {
    if (this.node) return this.node;

    const node = this.initializeRootNode();
    for (let i = 0; i < this.getConfig().cols; i++) {
      const cell = new Cell(
        this,
        this.getConfig(),
        this.data,
        this.getIndex(),
        i
      );
      this.cells.push(cell);
      node.appendChild(cell.getNode());
    }
    return node;
  }

  onChange() {
    this.cells.forEach(cell => {
      cell.onChange();
    });
  }

  onChangeRef(index, offset = 0) {
    this.setIndex(index);
    this.colOffset = offset;
    this.cells.forEach((cell, colIndex) => {
      if (!index) {
        cell.onChangeRef(0, this.colOffset + colIndex);
      } else {
        cell.onChangeRef(index, this.colOffset + colIndex);
      }
    });
  }
}
