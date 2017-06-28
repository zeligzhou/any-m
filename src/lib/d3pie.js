import * as d3 from 'd3';

let svgWrap = d3.select(document.querySelector('.svg-pie')).append('svg');

const box = {
  height: 250,
  width: 320,
  left: 30,
  bottom: 18,
};

const getPosition = (pos) => {
  let d = 20;
  let p = { x: 1, y: 1 };
  let ratio = Math.abs(pos.x) / Math.abs(pos.y);
  let x;
  let y;
  let tx = 0.5;
  if (pos.x < 0) {
    p.x = -1;
    tx = 64;
  }
  if (pos.y < 0) {
    p.y = -1;
  }
  if (ratio >= 1) {
    x = pos.x * 1 + d * p.x;
    y = x * pos.y / pos.x;
  } else {
    y = pos.y * 1 + d * p.y;
    x = pos.x * y / pos.y;
  }
  return { line: [{ x, y }, { x: x + p.x * 8.5, y }], text: { x: x + p.x * (8.5 + tx), y: y + 4 } };
};

const getPieData = (data) => {
  let ret = { value: [], color: [], type: [] };
  let dataLength = data.length;
  for (let i = 0; i < dataLength; i++) {
    ret.value.push(data[i].yValue);
    ret.color.push(data[i].color.split(' ')[0]);
    ret.type.push(data[i].xValue);
  }
  return ret;
};
/* 绘制 */
const drawPie = (data, id) => {
  svgWrap.attr('height', box.height).attr('width', box.width);
  svgWrap.attr('id', id).attr('opacity', 1);
  svgWrap.html('');
  let _data = getPieData(data.series[0].points);

  let arc = d3.arc()
    .innerRadius(50)
    .outerRadius(80);
  let pie = d3.pie();

  let arcbg = d3.arc()
    .innerRadius(50)
    .outerRadius(86);
  svgWrap.selectAll('path.pie-bg')
  .data(pie(_data.value))
  .enter().append('path')
  .style('fill', (d, i) => _data.color[i])
  .attr('class', (d, i) => (i === 0 ? 'pie-bg active' : 'pie-bg'))
  .attr('d', arcbg)
  .attr('transform', 'translate(160,125)');

  svgWrap.selectAll('path.pie-item')
  .data(pie(_data.value))
  .enter().append('path')
  .attr('class', 'pie-item')
  .style('fill', (d, i) => _data.color[i])
  .attr('d', arc)
  .attr('transform', 'translate(160,125)')
   .attr('data-info', (d, i) => `${_data.value[i]};${_data.type[i]};${_data.color[i]};${arc.centroid(d)}`);
  let labelItem = document.querySelectorAll('.pie-item');
  let labelSize = (labelItem.length <= 5) ? labelItem.length : 5;
  let labelLine = [];
  const lineFunc = d3.line()
  .x(d => d.x)
  .y(d => d.y);
  svgWrap.append('g').attr('class', 'pie-label-line').attr('transform', 'translate(160,125)');
  for (let i = 0; i < labelSize; i++) {
    let color = labelItem[i].getAttribute('data-info').split(';')[2];
    let text = `${labelItem[i].getAttribute('data-info').split(';')[1]} ${labelItem[i].getAttribute('data-info').split(';')[0]}%`;
    let pos = labelItem[i].getAttribute('data-info').split(';')[3].split(',');
    labelLine[i] = [];
    labelLine[i].push({ x: pos[0], y: pos[1] });
    let posGroup = getPosition({ x: pos[0], y: pos[1] });
    labelLine[i] = labelLine[i].concat(posGroup.line);
    svgWrap.select('.pie-label-line').append('path')
    .attr('d', lineFunc(labelLine[i]))
    .attr('stroke', color)
    .attr('stroke-width', 1)
    .attr('fill', 'none');
    svgWrap.select('.pie-label-line').append('text')
    .attr('x', posGroup.text.x)
    .attr('y', posGroup.text.y)
    .attr('fill', color)
    .text(text);
  }
  return _data;
};

const d3g = {
  init: (data, id) => {
    if (!data) {
      console('no bar data');
      return false;
    }
    svgWrap = d3.select(document.querySelector('.svg-pie')).append('svg');
    let startTime = new Date();
    let _data = drawPie(data, id);
    console.log(id + ' draw in ' + ((new Date()).getTime() - startTime.getTime()) + 'ms');
    return document.querySelector('.svg-pie').innerHTML;
  },
};
export default d3g.init;
