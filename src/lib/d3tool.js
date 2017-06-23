import * as d3 from 'd3';
import axis from './d3axis.js';

const box = {
  height: 170,
  width: 360,
  left: 30,
  bottom: 18,
};

const axisGener = (_data, scales, id, type) => {
  axis(_data, scales, id, box, type);
};

const lineGener = (svgObj, param, scales, data) => {
  let line = d3.line()
  .x(d => scales.time(d.datetime))
  .y(d => scales.num(d[param]))
  .defined(d => d[param]);
  d3.select(`#${svgObj}`).append('path').datum(data)
  .attr('class', `line ${param}`)
  .attr('d', line)
  .attr('transform', `translate(${box.left + 0.5},0)`);
  return line;
};

const areaGener = (svgObj, param, scales, data, color) => {
  let area = d3.area()
  .x(d => scales.time(d.datetime))
  .y1(d => scales.num(d[param]))
  .y0(scales.num(0))
  .defined(d => d[param]);
  d3.select(`#${svgObj}`).append('path').datum(data)
  .attr('fill', color)
  .attr('d', area)
  .attr('transform', `translate(${box.left + 0.5},0)`);
  return area;
};

const maskGener = (svgObj, scales) => {
  let xInner = d3.axisBottom(scales.time).ticks(4)
  .tickSize(box.bottom - box.height, 0, 0)
  .tickFormat('');
  d3.select(`#${svgObj}`).append('g')
  .attr('class', 'inner-line-mask')
  .attr('transform', `translate(${box.left},${box.height - box.bottom})`)
  .call(xInner);
};

const dotGener = (svgObj, data, param, dotGroupClass, dotClass, dotInfo, line) => {
  d3.select(`#${svgObj}`).append('g').attr('class', dotGroupClass)
  .selectAll('.dot')
  .data(data.filter(d => d[param]))
  .enter()
  .append('circle')
  .attr('class', dotClass)
  .attr('cx', line.x())
  .attr('cy', line.y())
  .attr('r', 3.5)
  .attr('transform', `translate(${box.left + 0.5},0)`)
  .attr('data-info', dotInfo);
};

const barGener = (svgObj, data, scales) => {
  d3.select(`#${svgObj}`).append('g').attr('class', 'bar-group')
  .selectAll('.bar')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'single-bar')
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => scales.xaxis(d.xValue))
  .attr('y', d => scales.num(d.yValue))
  .attr('width', 28)
  .attr('height', d => box.height - box.bottom - scales.num(d.yValue))
  .attr('transform', `translate(${18},0)`);
  d3.selectAll('.single-bar')
  .append('text')
  .attr('x', d => scales.xaxis(d.xValue))
  .attr('y', d => scales.num(d.yValue))
  .text(d => `${d.yValue}%`)
  .attr('fill', '#8f9296')
  .attr('transform', d => `translate(${18 - (`${d.yValue}%`.replace('.', '').length * 7.5 - 28) * 0.5},-4)`);
};

const tool = {
  objConverter: (obj, keygroup) => {
    let ret = [];
    obj.datetime = [];
    const keysOfObj = keygroup || Object.keys(obj);
    const lengthOfKeys = keysOfObj.length;
    const lengthOfRet = obj[keysOfObj[0]].length;
    for (let i = 0; i < lengthOfRet; i++) {
      let singleTon = {};
      obj.datetime[i] = (new Date(obj.date[i]));
      for (let j = 0; j < lengthOfKeys; j++) {
        singleTon[keysOfObj[j]] = ((obj[keysOfObj[j]][i] === '--') ? '0.0' : obj[keysOfObj[j]][i]) || '0.0';
      }
      ret.push(singleTon);
    }
    return ret;
  },
  objConverterOfScatter: (obj) => {
    let ret = [];
    obj[0].datetime = [];
    const lengthOfRet = obj[0].points.length;
    function parseDate(v) {
      return v.replace(/(\w{4})(\w{2})(\w{2})/, '$1-$2-$3');
    }
    function fecthDesc(v) {
      let desc;
      for (let i = 0; i < obj[1].points.length; i++) {
        if (obj[1].points[i].xValue === v) {
          desc = obj[1].points[i].desc;
        }
      }
      return desc;
    }
    for (let i = 0; i < lengthOfRet; i++) {
      let item = obj[0].points[i];
      let singleTon = {};
      singleTon.week = item.week;
      singleTon.date = parseDate(item.xValue);
      singleTon.real = item.yValue;
      singleTon.desc = fecthDesc(item.xValue);
      singleTon.datetime = (new Date(singleTon.date));
      obj[0].datetime[i] = singleTon.datetime;
      ret.push(singleTon);
    }
    return ret;
  },
  objSumGroups: (obj, key) => {
    let today = 999;
    let todayData = null;
    let isPreview = (new Date()) < (new Date(obj[0].date));
    if (isPreview) {
      today = -1;
    }
    for (let j = 0; j < obj.length; j++) {
      obj[j][key] = 0;
      if (obj[j].week === '今天') {
        todayData = Object.assign({}, obj[j]);
        todayData.type = 'real';
        today = j;
      }
      if (j >= today) {
        obj[j].type = 'forecast';
        obj[j][key] = obj[j].forecast * 1.0;
        if (obj[j].week !== '今天') {
          obj[j].real = undefined;
        }
      } else {
        obj[j].type = 'real';
        obj[j][key] = obj[j].real * 1.0;
        obj[j].forecast = undefined;
      }
    }
    return today;
  },
  domainHandle: (d) => {
    let max = d[1].toExponential(2);
    let maxScale = (max).split('e+');
    if (maxScale[0] < 2) {
      maxScale[0] = Math.ceil(maxScale[0] * 10);
      if (maxScale[0] % 3 !== 0) {
        maxScale[0] = 3 * Math.floor(maxScale[0] / 3) + 3;
      }
      maxScale[0] *= 0.1;
    } else {
      maxScale[0] = Math.ceil(maxScale[0]);
    }
    max = maxScale[0] * (Math.pow(10, maxScale[1]));
    return [0, max];
  },
  box,
  axisGener,
  lineGener,
  areaGener,
  maskGener,
  dotGener,
  barGener,
};
export default tool;
