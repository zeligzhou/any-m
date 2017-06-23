import React, { Component } from 'react';
import data from '../data/data';
import d3Bar from "../lib/d3bar";

class Linechart extends Component {
  componentDidMount () {
    d3Bar(data.bar, 'barChart');

    var svg = document.querySelector("#barChart");
    if(!svg){
      return false;
    }
    var winRatio = (window.innerWidth-55)/360;
    var calHeight = winRatio*170 + 45;
    svg.setAttribute('viewBox', '0,0,'+360+','+170);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('width','100%');
    svg.setAttribute('height',calHeight);
    svg.setAttribute('opacity',1);
    
  }
  render() {
    return (
      <div className='svg-wrap'><div className="svg-bar"></div></div>
    );
  }
}

export default Linechart;
