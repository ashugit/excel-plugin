import { Config } from './defaults';
import { Row } from './components/row';
import { Scroll } from './scroll';

export class Excel {
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
        this.scrollPoint = {scroll: {row: 0, col: 0}};
        this.nodeIdOnEdit = null;
        this.textEditNode = null;
        this.contextualMenu = null;
    }

    /**
     * 
     * @param {*} node 
     */
    setupScrollHandling(div) {
        const scrollHandler = {
            get: (obj, prop) =>  obj[prop],
            set: (obj, prop, val) =>  {
                obj[prop] = val;
                this.remapData(obj.scroll);
            }
        };
        const scrollPointProxy = new Proxy(this.scrollPoint, scrollHandler);
        const scroll = new Scroll(div, this.config, scrollPointProxy);
        div.appendChild(scroll.getVScroll());
        div.appendChild(scroll.getHScroll());
        scroll.initializeScrolls();
    }
    /**
     * o.row, o.col
     */
    remapData(o) {
        const startRow = o.row;
        const startCol = o.col;
        this.rows.forEach( (row, index) => {
            if(!index) {
                row.onChangeRef(this.data[0], startCol);
            } else {
                row.onChangeRef(this.data[o.row + index], startCol);
            }       
        });
    }
    /**
     * 
     */
    init() {
        const div = document.createElement( 'div' );
        div.className = 'tbl';
        let i = 0;

        this.setupHeaders();
        this.setupLabels();
        for(i = 0; i < this.config.rows; i++) {
            if(!this.data[i]) this.data[i] = {};
            this.rows[i] = new Row(div, this.config, this.data[i]);
            div.appendChild(this.rows[i].getNode());
        }
        this.root.appendChild(div);
        this.addEditRequestEventListener(div);
        this.setupScrollHandling(div);
    }

    /**
     * 
     */
    setupHeaders() {
        const headers = {};
        for(let i = 1; i < this.config.minLabeledCols; i++) headers[i] = 'col:' + i;
        this.data[0] = headers;
    }

    /**
     * 
     */
    setupLabels() {
        for(let i = 1; i < this.config.minLabeledRows; i++) {
            if(!this.data[i]) this.data[i] = {};
            this.data[i][0] = i;
        }
    }
    /**
     * Setup click listener emit from cell
     */
    addEditRequestEventListener(div) {
        div.addEventListener('startEdit', (e)=> {
            const edittingCell = document.getElementById(e.cellId);
            
            if(this.nodeIdOnEdit && this.nodeIdOnEdit !== e.cellId ) {
                const cachedCellOnEdit = document.getElementById(this.nodeIdOnEdit);
                cachedCellOnEdit.innerHTML = this.textEditNode.value;
                this.nodeIdOnEdit = '';
                this.textEditNode.value = '';
            }
            
            if(this.nodeIdOnEdit !== e.cellId ) {
                edittingCell.appendChild(this.getEditorCellTextBox(edittingCell));
                this.nodeIdOnEdit = e.cellId;
                this.textEditNode.focus();
            }
        });
    }
    /**
     * 
     * @param {*} cellNode 
     */
    getEditorCellTextBox(cellNode) {
        if(!this.textEditNode) {
            this.textEditNode = document.createElement( 'textarea' );
            this.textEditNode.className = 'tbl-cell-editor-text';
            this.textEditNode.rows = '1';    
        }
        this.textEditNode.value = cellNode.innerHTML;
        cellNode.innerHTML = '';
        return this.textEditNode;
    }
        
           
        
    /**
     * 
     * @param {*} cellNode 
     */
    getContextualMenu(cellNode) {
        
        if(!this.contextualMenu) {
            this.contextualMenu = document.createElement('div');
            this.contextualMenu.className = 'hide';
            this.contextualMenu.id = 'tbl-menu';
            const html = ' <ul>\
                            <li onclick="click-add-to-left()" >Add column to left</li>\
                            <li onclick="click-add-to-right()">Add column to right</li>\
                            <li onclick="click-delete-column()">Delete this column</li>\
                            <hr/>\
                            <li onclick="click-add-to-top()">Add a row above</li>\
                            <li onclick="click-add-to-bottom()">Add a row below</li>\
                            <li onclick="click-delete-row()">Delete this row</li>\
                        </ul>';
            this.contextualMenu.innerHTML = html;
        }

        return this.contextualMenu;
    }
}
