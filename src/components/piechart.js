import React, { Component } from 'react';
import data from '../data/data';
import d3Pie from "../lib/d3pie";

class Linechart extends Component {
  componentDidMount () {
    d3Pie(data.pie, 'pieChart');

    var svg = document.querySelector("#pieChart");
    if(!svg){
      return false;
    }
    
    
  }
  render() {
    return (
      <div className='svg-wrap piechart'><div className="svg-pie"></div></div>
    );
  }
}

export default Linechart;
