import * as d3 from 'd3';
import tool from './d3tool.js';

let svgWrap = d3.select(document.querySelector('.svg-scatter')).append('svg');
let scales = {};
let box = tool.box;

/* 绘制坐标系 */
const drawAxis = (data, range, id) => {
  svgWrap.attr('height', box.height).attr('width', box.width);
  svgWrap.attr('id', id).attr('opacity', 0);
  svgWrap.html('');
  let _data = tool.objConverterOfScatter(data.series);
  let numExtend = d3.extent(_data, d => d.real);
  scales.time = d3.scalePoint().range([0, box.width - box.left]).domain(data.series[0].datetime);
  scales.num = d3.scaleLinear().range([box.height - box.bottom, 0])
  .domain(tool.domainHandle(numExtend));
  tool.axisGener(_data, scales, id, box);
  return _data;
};
/* 绘制面积图 */
const drawArea = (svgObj, param, color, data) => {
  tool.areaGener(svgObj, param, scales, data, color);
  let line = tool.lineGener(svgObj, param, scales, data);

  tool.maskGener(svgObj, scales);

  let dotGroupClass = `dot-group scatter group-${param}`;
  let dotClass = (d) => {
    let ret = 'dot';
    if (d.desc) {
      ret = 'dot mark';
    }
    return ret;
  };
  let dotInfo = d => `${d.date} ${d.week} 新增${d[param]}人想看${(d.desc ? `<br/>${d.desc}` : '')}`;
  tool.dotGener(svgObj, data, param, dotGroupClass, dotClass, dotInfo, line);
};

const d3g = {
  init: (data, range, id) => {
    if (!data) {
      console('no scatter data');
      return false;
    }
    svgWrap = d3.select(document.querySelector('.svg-scatter')).append('svg');
    let startTime = new Date();
    let _data = drawAxis(data, range, id);
    drawArea(id, 'real', 'rgba(255,160,0,0.2)', _data);
    svgWrap.append('div').attr('class', 'tooltip');
    console.log(id + ' draw in ' + ((new Date()).getTime() - startTime.getTime()) + 'ms');
    return document.querySelector('.svg-scatter').innerHTML;
  },
};
export default d3g.init;
