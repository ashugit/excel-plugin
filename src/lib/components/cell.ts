import { Component } from './component';

export class Cell  extends Component {
    constructor(parent, config, data, rowIndex, index) {
        super();
        this.rootTag = 'div';
        this.rootClass = 'tbl-cell';
        this.parent = parent;
        this.data = data;
        this.rowIndex = rowIndex;
        this.setIndex(index);
        this.setConfig(config);
    }

    getRootTag() {
        return this.rootTag;
    }

    getDefaultClass() {
        return this.rootClass;
    }

    getDataForCell() {
        let cellData = '';
        if(this.data[this.rowIndex]) {
            cellData = this.data[this.rowIndex][this.getIndex()] ? this.data[this.rowIndex][this.getIndex()] : '';
        }
        return cellData;
    }

    getNode() {
        if(this.node) return this.node;
        this.initializeRootNode();
        this.node.innerHTML = this.getDataForCell();
        this.addEventListener();
        return this.node;
    }

    onChange() {
        this.node.innerHTML = this.getDataForCell();
    }

    onChangeRef(rowIndex, index) {
        this.rowIndex = rowIndex;
        this.setIndex(index);
        this.getNode().innerHTML = this.getDataForCell();
    }

    addEventListener() {
        this.node.addEventListener('click', (e)=> {
            const event = new CustomEvent('startEdit');
            event.cellId = this.getId();
            event.cellIndex = this.getIndex();
            event.rowIndex = this.rowIndex;
            // Fix the heirarchy dont access root directly here
            this.node.closest('.tbl').dispatchEvent(event);
            e.preventDefault();
        });

        this.node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const event = new CustomEvent('showRightClickMenu');
            event.cellId = this.getId();
            event.cellIndex = this.getIndex();
            event.rowIndex = this.rowIndex;
            this.node.closest('.tbl').dispatchEvent(event);
            return false;
        }, false);
    }
}


