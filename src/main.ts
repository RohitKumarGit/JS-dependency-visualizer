//import './style.css'

declare const anychart: any;
const drawGraph = function (datas) {
  // create an instance of a pie chart
  document.getElementById("container").style.display = "block";
  var chart = anychart.graph(datas);
  // set the data
  chart.nodes().labels().format("{%id}");
  chart.nodes().labels().fontSize(12);
  chart.interactivity().zoomOnMouseWheel(false);
  chart.nodes().labels().enabled(true);
  chart.fit();
  var zoomController = anychart.ui.zoom();
  zoomController.target(chart);
  zoomController.render();
  chart.move(50, -100);
  // set chart title
  chart.title("Dependency Graph");
  // set the container element
  chart.container("container");
  // initiate chart display
  //chart.draw();
  chart.draw();
};
document.getElementById("import").onclick = function () {
  var files = (document.getElementById("selectFiles") as any).files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function (e: any) {
    console.log(e);
    var result = JSON.parse(e.target.result);

    drawGraph(result);
    //(document.getElementById("result") as any).value = formatted;
  };

  fr.readAsText(files.item(0));
};
