import * as d3 from 'd3';
import tool from './d3tool.js';

let svgWrap = d3.select(document.querySelector('.svg-bar')).append('svg');
let scales = {};
let box = tool.box;
/* 绘制坐标系 */
const drawAxis = (data, id) => {
  svgWrap.attr('height', box.height).attr('width', box.width);
  svgWrap.attr('id', id).attr('opacity', 0);
  svgWrap.html('');
  let _data = data.series[0].points;
  scales.time = d3.scalePoint().range([0, box.width - box.left]).domain(data.xAxisValues);
  scales.xaxis = d3.scalePoint().range([30, box.width - box.left - 30]).domain(data.xAxisValues);
  scales.xvalues = data.xAxisValues;
  scales.num = d3.scaleLinear().range([0, box.height - box.bottom])
  .domain([data.yAxisMaxValue, data.yAxisMinValue]);
  scales.yunit = '%';
  tool.axisGener(_data, scales, id, 1, data.yAxisIntervalNum);
  return _data;
};
/* 绘制面积图 */
const drawArea = (svgObj, data) => {
  tool.barGener(svgObj, data, scales);
};

const d3g = {
  init: (data, id) => {
    if (!data) {
      console('no bar data');
      return false;
    }
    svgWrap = d3.select(document.querySelector('.svg-bar')).append('svg');
    let startTime = new Date();
    let _data = drawAxis(data, id);
    drawArea(id, _data);
    console.log(id + ' draw in ' + ((new Date()).getTime() - startTime.getTime()) + 'ms');
    return document.querySelector('.svg-bar').innerHTML;
  },
};
export default d3g.init;
