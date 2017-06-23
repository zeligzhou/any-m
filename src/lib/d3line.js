import * as d3 from 'd3';
import tool from './d3tool.js';

let svgWrap = d3.select(document.querySelector('.svg-line')).append('svg');
let scales = {};
let box = tool.box;

/* 绘制坐标系 */
const drawAxis = (data, id, type) => {
  svgWrap.attr('height', box.height).attr('width', box.width);
  svgWrap.attr('id', id).attr('opacity', 0);
  svgWrap.html('');
  let keyArr = ['label', 'week', 'real', 'forecast', 'date', 'datetime'];
  if (type === 'show') {
    keyArr.push('tooltipVal');
  }
  let _data = tool.objConverter(data[type], keyArr);
  scales.xSelected = tool.objSumGroups(_data, 'total');
  let numExtend = d3.extent(_data, d => d.total);
  scales.time = d3.scalePoint().range([0, box.width - box.left]).domain(data[type].datetime);
  scales.num = d3.scaleLinear().range([box.height - box.bottom, 0])
  .domain(tool.domainHandle(numExtend));
  tool.axisGener(_data, scales, id);
  return _data;
};
/* 绘制面积图 */
const drawArea = (svgObj, param, color, data, type) => {
  tool.areaGener(svgObj, param, scales, data, color);
  let line = tool.lineGener(svgObj, param, scales, data);

  if (param === 'forecast') {
    tool.maskGener(svgObj, scales);
  }
  let dotGroupClass = `dot-group group-${param}`;
  let dotClass = 'dot';
  let dotInfo = d => `${d.date} ${d.week} ${((type === 'box') ? d[param] : d.tooltipVal)}${((type === 'box') ? '万 分账票房' : '场次')}`;
  tool.dotGener(svgObj, data, param, dotGroupClass, dotClass, dotInfo, line);
};

const drawTooltip = (dot) => {
  d3.select('.svg-line').append('div').attr('class', 'tooltip').html(dot.attr('data-info'));
};
const d3Line = {
  init: (data, id, type = 'box') => {
    if (data.show.date.length <= 1) {
      console.log('no line data');
      return false;
    }
    svgWrap = d3.select(document.querySelector('.svg-line')).append('svg');
    let startTime = new Date();
    let _data = drawAxis(data, id, type);
    drawArea(id, 'real', 'rgba(255,160,0,0.2)', _data, type);
    drawArea(id, 'forecast', 'rgba(255,161,0,0.09)', _data, type);

    if (scales.xSelected !== -1 && document.querySelectorAll('.group-forecast .dot').length > 0) {
      let dot = d3.select('.group-forecast .dot:first-child').attr('class', 'dot selected');
      d3.select(`.inner-line-x .tick:nth-child(${scales.xSelected + 2})`)
      .attr('class', 'tick selected');
      drawTooltip(dot);
    } else {
      svgWrap.append('div').attr('class', 'tooltip');
    }
    console.log(id + ' draw in ' + ((new Date()).getTime() - startTime.getTime()) + 'ms');
    return document.querySelector('.svg-line').innerHTML;
  },
};
export default d3Line.init;
