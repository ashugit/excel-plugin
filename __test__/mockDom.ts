import Excel from "../src/index";

export default function createMockDom(
  rows?:number,
  cols?:number,
  labelled_rows?:number,
  labelled_cols?:number
) {
  var max_rows = rows || 100;
  var max_cols = cols || 26;
  var min_labelled_rows = labelled_rows|| 10000;
  var min_labelled_cols = labelled_cols || 100;
  var isScrollable = true;

  var getTestHashData = function() {
    var data = {};
    for (var i = 1; i < max_rows; i++) {
      var row = {};
      for (var j = 1; j < max_cols; j++) {
        row[j] = "(" + i + "," + j + ")";
      }
      data[i] = row;
    }
    return data;
  };
  document.body.innerHTML = '<div id="app">' + "</div>";
  var ele = document.getElementById("app");
  var instance = new Excel(
    ele,
    {
      minLabeledCols: min_labelled_cols,
      minLabeledRows: min_labelled_rows,
      rows: max_rows,
      cols: max_cols,
      borders: "#000000",
      scrollable: isScrollable
    },
    getTestHashData()
  );
  instance.init();

  return {
    document,
    instance
  };
}
