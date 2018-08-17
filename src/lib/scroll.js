export class Scroll {
    /**
     * 
     * @param {*} container 
     * @param {*} config 
     */
    constructor(container, config, scrollPoint) {
        this.vScrollTrack = null;
        this.vScrollThumb = null;
        this.hScrollTrack = null;
        this.hScrollThumb = null;
        this.container = container;
        this.config = config;
        this.scrollPoint = scrollPoint;
    }
    /**
     * 
     */
    getVScroll() {
        if(this.vScrollTrack) return this.vScrollTrack;

        this.vScrollTrack = document.createElement('span');
        this.vScrollTrack.className = 'tbl-vscroll-track';

        this.vScrollThumb = document.createElement('span');
        this.vScrollThumb.className = 'tbl-vscroll-thumb';

        this.vScrollTrack.appendChild(this.vScrollThumb);
        return this.vScrollTrack;
    }
    /**
     * 
     */
    getHScroll() {
        if(this.hScrollTrack) return this.hScrollTrack;

        this.hScrollTrack = document.createElement('span');
        this.hScrollTrack.className = 'tbl-hscroll-track';

        this.hScrollThumb = document.createElement('span');
        this.hScrollThumb.className = 'tbl-hscroll-thumb';

        this.hScrollTrack.appendChild(this.hScrollThumb);
        return this.hScrollTrack;
    }  
   
    /**
     * 
     */
    setupEventListener() {
        if (this.container.addEventListener) {
            this.container.addEventListener("mousewheel", (e)=>this.doScroll(e), false);
            this.container.addEventListener("DOMMouseScroll", (e)=>this.doScroll(e), false);
            document.getElementsByTagName("body")[0].addEventListener('keydown', (e) =>this.doScrollOnArrow(e), false );
        } else {
            this.container.attachEvent("onmousewheel", (e)=>this.doScroll(e));
        }        
    }
    /**
     * 
     * @param {*} e 
     */
    doScrollOnArrow(e) {
        switch (event.key) {
            case "ArrowLeft":
                this.doHorizontalScrolling(-1);
                this.reportScrollUpdate(Math.abs(this.currentRow), Math.abs(this.currentCol));
                break;
            case "ArrowRight":
                this.doHorizontalScrolling(1);
                this.reportScrollUpdate(Math.abs(this.currentRow), Math.abs(this.currentCol));
                break;
            case "ArrowUp":
                this.doVerticalScrolling(-1);
                this.reportScrollUpdate(Math.abs(this.currentRow), Math.abs(this.currentCol));
                break;
            case "ArrowDown":
                this.doVerticalScrolling(1);
                this.reportScrollUpdate(Math.abs(this.currentRow), Math.abs(this.currentCol));
                break;
        }
    }    

    /**
     * 
     */
    initializeScrolls() {
        this.currentRow = this.scrollPoint.scroll.row;
        this.currentCol = this.scrollPoint.scroll.col;

        this.totalRows = this.config.minLabeledRows;
        this.trackerPixelHeight = parseInt( this.vScrollTrack.offsetHeight, 10);

        this.totalCols = this.config.minLabeledCols;
        this.trackerPixelWidth = parseInt( this.hScrollTrack.offsetWidth, 10);

        this.setupEventListener();
    }
    /**
     * 
     * @param {*} delta 
     */
    doVerticalScrolling(delta) {
        if ((delta > 0 && Math.abs(this.currentRow)  < (this.totalRows - 4))) {
            this.currentRow = this.currentRow - delta;
            if(Math.abs(this.currentRow) > (this.totalRows - 4)) this.currentRow = -(this.totalRows - 4);
        }else if((delta < 0  && Math.abs(this.currentRow)  > 0)) {
            this.currentRow = this.currentRow - delta;
            if(this.currentRow > 0) this.currentRow = 0;
        }else {
            return;
        }
        this.vScrollThumb.style.top = 0 - Math.round(this.trackerPixelHeight * (this.currentRow) / this.totalRows) + 'px';
    }
    /**
     * 
     * @param {*} delta 
     */
    doHorizontalScrolling(delta) {
        if ((delta > 0 && Math.abs(this.currentCol)  < (this.totalCols - 1))) {
            this.currentCol = this.currentCol - delta;
            if(Math.abs(this.currentCol) > (this.totalCols - 1)) this.currentCol = -(this.totalCols - 1);
        }else if((delta < 0  && Math.abs(this.currentCol)  > 0)) {
            this.currentCol = this.currentCol - delta;
            if(this.currentCol > 0) this.currentCol = 0;
        }else {
            return;
        }
        this.hScrollThumb.style.left = 0 - Math.round(this.trackerPixelWidth * (this.currentCol) / this.totalCols) + 'px';
    }
    
    /**
     * 
     * @param {*} event 
     */
    doScroll(event) {
        const e = window.event || event;
        if(e.deltaX) this.doHorizontalScrolling(e.deltaX);
        if(e.deltaY) this.doVerticalScrolling(e.deltaY);
        this.reportScrollUpdate(Math.abs(this.currentRow), Math.abs(this.currentCol));
        event.preventDefault();
    }

    /**
     * 
     * @param {*} row 
     * @param {*} col 
     */
    reportScrollUpdate(row, col) {
        this.scrollPoint.scroll =  { row, col };
    }
}
