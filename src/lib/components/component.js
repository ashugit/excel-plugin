let ID_COUNTER = 0;
export class Component {
    constructor() {
        this.node = null;
        this.tag = '';
        this.id = '';
        this.config = null;
        this.index = 0;
    }

    initializeRootNode() {
        if(!this.node) {
            this.node = document.createElement(this.getRootTag());
            this.node.id = this.getId();
            this.node.className = this.getDefaultClass();
        }
        return this.node;
    }

    getDefaultClass() {
        throw new Error('Component must implment ' + this.getDefaultClass());
    }

    getRootTag() {
        throw new Error('Component must implment ' + this.getRootTag());
    }
    /**
     * 
     */
    getId() {
        if(!this.id) this.id = this.constructor.name + '-' + (++ID_COUNTER);
        return this.id;
    }
    /**
     * 
     */
    getIndex() {
        return this.index;
    }

    /**
     * 
     */
    setIndex(index) {
        this.index = index;
    }

    getNode() {
        throw new Error('Component must implment ' + this.getNode());
    }

    getHTML() {
        throw new Error('Component must implment ' + this.getHTML());
    }
    /**
     * 
     * @param {*} config 
     */
    setConfig(config) {
        this.config = config;
    }
    /**
     * 
     */
    getConfig() {
        return this.config;
    }
    /**
     * 
     */
    onChange() {
        throw new Error('Component must implment ' + this.onChange());
    }    
}

