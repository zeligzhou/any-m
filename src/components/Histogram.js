import React, { Component } from 'react';
import * as d3 from "d3";

class Histogram extends Component {
  componentDidMount () {
    var svg = d3.select("#svg"),
        w = parseInt(svg.style("width")),
        h = parseInt(svg.style("height"));
    var data = d3.range(0,1000).map(()=>{
        return {
            v:d3.randomBates(10)()*10
        }
    })
    console.log(data)
    var xscale = d3.scaleLinear()
        .domain([0,10])
        .range([100,w-100])
    svg.append("g").attr("class","axis")
        .attr("transform","translate(0,"+(h-100)+")")
        .call(d3.axisBottom(xscale))
    var histogram = d3.histogram()
        .value((d)=>{return d.v})
        .domain(xscale.domain())
        .thresholds(20)
    var yscale = d3.scaleLinear()
        .range([h-100,100])
    draw();
    function draw(){
        var bins = histogram(data);
        yscale.domain([0,d3.max(bins,(d)=>{
            return d.length;
        })])
        console.log(bins)
        var update = svg.selectAll(".bin")
            .data(bins)
            
        update.exit().remove()
        update.enter().append("rect")
            .merge(update)
            .attr("class","bin")
            .attr("x",(d)=>{
                return xscale(d.x0);
            })
            .attr("y",(d)=>{
                return 100-yscale(d.length);
            })
            .attr("width",(d)=>{
                return xscale(d.x1)-xscale(d.x0);
            })
            .attr("height",(d)=>{
                console.log(yscale(d.length))
                return yscale(d.length)-50;
            })
            .on("click",function(){
                console.log(window.event);
                console.log(d3.event)
            })
    }
  }
  render() {
    return (
      <svg id="svg" className="histogram"></svg>
    );
  }
}

export default Histogram;
