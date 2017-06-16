import * as d3 from "d3";
import tool from "../lib/tool";

let svgWrap = null;
let scales = {};
let height = 170;
let width = 360;
let leftShift = 30;
/* 绘制坐标系 */
const drawAxis = (data, id, type) => {
  svgWrap.attr('height', height).attr('width', width).append('g').attr('class', 'chart');
  svgWrap.attr('id', id).attr('opacity', 0);
  svgWrap.html('');
  let keyArr = ['label', 'week', 'real', 'forecast', 'date', 'datetime'];
  if (type === 'show') {
    keyArr.push('tooltipVal');
  }
  let _data = tool.objConverter(data[type], keyArr);
  scales.xSelected = tool.objSumGroups(_data, 'total');
  let numExtend = d3.extent(_data, (d) => {
    return d.total;
  });
  scales.time = d3.scalePoint().range([0, width - leftShift]).domain(data[type].datetime);
  scales.num = d3.scaleLinear().range([height - 18, 0]).domain(tool.domainHandle(numExtend));
  let timeAxis = d3.axisBottom(scales.time).tickFormat(d3.timeFormat('%-m/%-d'));
  let numAxis = d3.axisLeft(scales.num).ticks(4);
  d3.select('#' + id).append('g').attr('class', 'x axis').attr('transform', 'translate('+ leftShift +',' + (height - 18.5) + ')')
  .call(timeAxis);
  d3.select('#' + id).append('g').attr('class', 'y axis').attr('transform', 'translate('+ leftShift +', 0)')
  .call(numAxis);

  let yInner = d3.axisLeft(scales.num).ticks(4)
  .tickSize(leftShift - width + 1, 0, 0)
  .tickFormat('');
  d3.select('#' + id).append('g')
  .attr('class', 'inner_line')
  .attr('transform', 'translate('+ (leftShift) +',0)')
  .call(yInner);

  let xInner = d3.axisBottom(scales.time).ticks(4)
  .tickSize(18 - height, 0, 0)
  .tickFormat('');
  d3.select('#' + id).append('g')
  .attr('class', 'inner_line_x')
  .attr('transform', 'translate('+ leftShift +',' + (height - 18) + ')')
  .call(xInner);

  d3.selectAll('.x.axis .tick *').attr('opacity', 0);
  d3.selectAll('.y.axis .tick *').attr('fill', '#8f9296');

  let sel = d3.selectAll('.x.axis .tick:nth-child(' + tool.calTimeAxis(_data.length) + ')');
  sel.selectAll('*').attr('opacity', 1).attr('fill', '#8f9296');
  return _data;
};
/* 绘制面积图 */
const drawArea = (svgObj, param, color, data, type) => {
  let area = d3.area()
  .x((d) => {
    return scales.time(d.datetime);
  })
  .y1((d) => {
    return scales.num(d[param]);
  }).y0(scales.num(0))
  .defined((d) => {
    return d[param];
  });
  let line = d3.line()
  .x((d) => {
    return scales.time(d.datetime);
  })
  .y((d) => {
    return scales.num(d[param]);
  })
  .defined((d) => {
    return d[param];
  });
  d3.select('#' + svgObj).append('path').datum(data)
  .attr('fill', color)
  .attr('d', area)
  .attr('transform', 'translate('+ (leftShift + 0.5) +', 0)')
  ;
  d3.select('#' + svgObj).append('path').datum(data)
  .attr('class', 'line ' + param)
  .attr('d', line)
  .attr('transform', 'translate('+ (leftShift + 0.5) +', 0)');

  if (param === 'forecast') {
    let xInner = d3.axisBottom(scales.time).ticks(4)
    .tickSize(18 - height, 0, 0)
    .tickFormat('');
    d3.select('#' + svgObj).append('g')
    .attr('class', 'inner_line_mask')
    .attr('transform', 'translate('+ leftShift +',' + (height - 18) + ')')
    .call(xInner);
  }

  d3.select('#' + svgObj).append('g').attr('class', 'dot-group group-' + param)
  .selectAll('.dot')
  .data(data.filter((d) => {
    return d[param];
  }))
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('cx', line.x())
  .attr('cy', line.y())
  .attr('r', 3.5)
  .attr('transform', 'translate('+ (leftShift + 0.5) +', 0)')
  .attr('data-info', (d) => {
    return d.date + ' ' + d.week + ' ' + ((type === 'box') ? d[param] : d.tooltipVal) + ((type === 'box') ? '万 分账票房' : '场次');
  });
};

const drawTooltip = (dot) => {
  d3.select(document.querySelector('.svg-wrap')).append('div').attr('class', 'tooltip').html(dot.attr('data-info'));
};
const d3g = {
  init: (data, id, type = 'box') => {
    if (data.show.date.length <= 1) {
      console.log('no release data');
      return false;
    }
    svgWrap = d3.select(document.querySelector('.svg-wrap')).append('svg');
    let _data = drawAxis(data, id, type);
    drawArea(id, 'real', 'rgba(255,160,0,0.2)', _data, type);
    drawArea(id, 'forecast', 'rgba(255,161,0,0.09)', _data, type);
    if (document.querySelectorAll('.group-forecast .dot').length > 0) {
      let dot = d3.select('.group-forecast .dot:first-child').attr('class', 'dot selected');
      d3.select('.inner_line_x .tick:nth-child(' + (scales.xSelected + 2) + ')').attr('class', 'tick selected');
      drawTooltip(dot);
    } else {
      d3.select(document.querySelector('.svg-wrap')).append('div').attr('class', 'tooltip');
    }


    var svg = document.querySelector("svg");
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
    var ticks = document.querySelectorAll(".inner_line_mask .tick");
    var tickTotalWidth = (window.innerWidth)*330/360;
    var tickWidth = tickTotalWidth/ticks.length;
    var realGroup = document.querySelectorAll(".group-real .dot");

    return _data;
  },
};

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

export default d3g;
