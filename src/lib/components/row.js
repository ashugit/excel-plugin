import { Component } from './component';
import { Cell } from './cell';

export class Row extends Component {
    constructor(parentNode, config, ref) {
        super();
        this.rootTag = 'div';
        this.rootClass = 'tbl-row';
        this.cells = [];
        this.parentNode = parentNode;
        this.colOffset = 0;
        this.setRef(ref);
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

    addNthCell(n, ref) {
        const cell = new Cell(this, this.getConfig(), ref);
        this.cells.splice(n, 0, ref);
        this.appendNthNode(n, cell.getNode());
    }

    removeNthCell(n) {
        this.cells.splice(n);
    }

    getNode() {
        if(this.node) return this.node;

        const node = this.initializeRootNode();
        for(let i = 0; i < this.getConfig().cols; i++) { 
            const cell = new Cell(this, this.getConfig(), this.ref[i]);
            this.cells.push(cell);
            node.appendChild(cell.getNode());
        }
        return node;
    }

    onChange() {
        this.cells.forEach(cell =>{
            cell.onChange();
        });
    }

    onChangeRef(ref, offset = 0) {
        this.setRef(ref);
        this.colOffset = offset;
        this.cells.forEach( (cell, index) => {
            if(this.ref) {
                if(!index) {
                    cell.onChangeRef(this.ref[0]);
                }else{
                    cell.onChangeRef(this.ref[this.colOffset + index]);
                }
            } else {
                cell.onChangeRef(null);
            }
        });
    }   
}

