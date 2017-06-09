import React, { Component } from 'react';
import * as d3 from "d3";
import dimple from "../lib/dimple.v2.3.0.min"
import lineChartData from '../data/lineData'
import tool from "../lib/tool"

class Linechart extends Component {
  componentDidMount () {
    var data = lineChartData;
    console.table(data.box);
    var svg = d3.select("#svg").attr("height","200").attr("width","96%");
    var _data = tool.objConverter(data.box,["label","week","real","forecast","date"]);
    tool.objSumGroups(_data,"total");

    var myChart = new dimple.chart(svg,_data);

    console.table(_data);
    // Set a variety of default colors
    // myChart.defaultColors = [
    // 	new dimple.color("#FF0000", "Blue"), // Set a red fill with a blue stroke
    // 	new dimple.color("#00FF00"), // Set a green fill with a darker green stroke
    // 	new dimple.color("rgb(0, 0, 255)") // Set a blue fill with a darker blue stroke
    // ];
    var x = myChart.addTimeAxis("x","date", "%Y-%m-%d", "%m/%d");
    x.title = null;
    x.timePeriod = d3.timeDay;
    x.timeInterval = 2
    x.fontSize = 8;

    var y1 = myChart.addMeasureAxis("y","total");
    y1.fontSize = 8;
    y1.title = null;
    // var y2 = myChart.addMeasureAxis("y","forecast");
    // y2.fontSize = 8;
    // y2.title = null;
    // //y2.hidden = true;
    // y2.stacked = true;
    //y2.colors = ["#DA9694", "#FABF8F", "#C4D79B"];
    var s1 = myChart.addSeries("type",dimple.plot.line,[x,y1]);
    //myChart.assignColor(new Date("2017-06-05"), "green", "black", 1);
    //var s2 = myChart.addSeries(null,dimple.plot.area,[x,y2]);
    s1.getTooltipText = function (e) {
      console.log(e);
        return [
            e.cx + " " + e.cy + "万 分账票房"
        ];
    };
    myChart.draw(200);

  }
  render() {
    return (
      <svg id="svg" className="linechart"></svg>
    );
  }
}

export default Linechart;
