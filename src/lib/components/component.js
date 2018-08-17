let ID_COUNTER = 0;
export class Component {
    constructor() {
        this.node = null;
        this.ref = null;
        this.tag = '';
        this.id = '';
        this.config = null;
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

    getNode() {
        throw new Error('Component must implment ' + this.getNode());
    }

    getHTML() {
        throw new Error('Component must implment ' + this.getHTML());
    }
    /**
     * 
     * @param {*} ref 
     */
    setRef(ref) {
        this.ref = ref;
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

