import { Component } from './component';

export class Cell  extends Component {
    constructor(parent, config, ref) {
        super();
        this.rootTag = 'div';
        this.rootClass = 'tbl-cell';
        this.parent = parent;
        this.setRef(ref);
        this.setConfig(config);
    }

    getRootTag() {
        return this.rootTag;
    }

    getDefaultClass() {
        return this.rootClass;
    }

    getNode() {
        if(this.node) return this.node;
        this.initializeRootNode();
        this.node.innerHTML = this.ref || '';
        this.addEventListener();
        return this.node;
    }

    onChange() {
        this.node.innerHTML = this.ref || '';
    }

    onChangeRef(ref) {
        this.setRef(ref);
        this.getNode().innerHTML = this.ref || '';
    }

    addEventListener() {
        this.node.addEventListener('click', (e)=> {
            const event = new CustomEvent('startEdit');
            event.cellId = this.getId();
            // Fix the heirarchy dont access root directly here
            this.node.closest('.tbl').dispatchEvent(event);
            e.preventDefault();
        });

        this.node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        }, false);
    }
}


