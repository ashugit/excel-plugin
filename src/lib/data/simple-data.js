
class Row {
    constructor(data = {}) {
        this.data = data;
    }

    getCol(i) {

    }
}

export class Data {
    constructor(data = {}) {
        this.data = data;
    }

    setRow(i, row) {
        this.data[i] = new Row(row);
    }
}
