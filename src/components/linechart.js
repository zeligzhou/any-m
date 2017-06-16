import React, { Component } from 'react';
import lineChartData from '../data/lineData';
import d3g from "../lib/d3generator";

class Linechart extends Component {
  componentDidMount () {
    let dom = d3g.init(lineChartData, 'boxChart');
  }
  render() {
    return (
      <div className='svg-wrap'></div>
    );
  }
}

export default Linechart;
