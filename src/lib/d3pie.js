import * as d3 from 'd3';

let svgWrap = d3.select(document.querySelector('.svg-pie')).append('svg');

const box = {
  height: 250,
  width: 320,
  left: 30,
  bottom: 18,
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
  .attr('data-info', (d, i) => `${_data.value[i]},${_data.type[i]},${_data.color[i]}`);

  svgWrap.append('div')
  .attr('class', 'piechart-center-label');
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
