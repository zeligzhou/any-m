import React, { Component } from 'react';
import data from '../data/data';
import d3Line from "../lib/d3line";

class Linechart extends Component {
  componentDidMount () {
    d3Line(data.line, 'boxChart');

    var svg = document.querySelector("#boxChart");
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
    if(document.querySelectorAll(".dot.selected").length > 0) setTooltip(winRatio);

    function setTooltip(winRatio){
      var toolTip = document.querySelector(".tooltip");
      var toolRange = [30, window.innerWidth - 20];
      var dotSel = document.querySelector(".dot.selected");
      toolTip.innerHTML = dotSel.getAttribute('data-info');
      calShift(dotSel, toolTip, toolRange,winRatio);
    }
    function calShift(d,t,r,winRatio){
      let tWidth = t.offsetWidth;
      let dShift = 60 + d.getAttribute('cx')*winRatio;
      let tShift = dShift - tWidth/2;
      if(tShift < r[0]){
        tShift = r[0];
      }
      if(tShift + tWidth > r[1]){
        tShift = r[1] - tWidth;
      }
      t.style.left = tShift + 'px';
    }
  }
  render() {
    return (
      <div className='svg-wrap'><div className="svg-line"></div></div>
    );
  }
}

export default Linechart;
