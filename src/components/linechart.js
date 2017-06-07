import React, { Component } from 'react';
import * as d3 from "d3";
import dimple from "../lib/dimple.v2.3.0.min"
import lineChartData from '../data/lineData'
import tool from "../lib/tool"

class Linechart extends Component {
  componentDidMount () {
    var data = lineChartData;
    console.table(data.box);
    var svg = d3.select("#svg").attr("height","200").attr("width","90%");
    var _data = tool.objConverter(data.box,["label","week","real","forecast","date"]);
    var myChart = new dimple.chart(svg,_data);
    console.table(_data);
    var x = myChart.addCategoryAxis("x","label");
    myChart.addMeasureAxis("y","real");
    myChart.addSeries(null,dimple.plot.line)
    myChart.draw();

  }
  render() {
    return (
      <svg id="svg" className="linechart"></svg>
    );
  }
}

export default Linechart;
