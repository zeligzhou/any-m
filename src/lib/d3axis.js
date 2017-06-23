import * as d3 from 'd3';

const calTimeAxis = (n) => {
  let num = 'even';
  if (n < 8) {
    num = 'n';
  }
  if (n > 23) {
    if ((n) % 3 === 0) {
      num = '3n+1';
    } else {
      num = '4n+1';
    }
  }
  if (n > 50) {
    num = `${Math.floor(n * 0.12)}n`;
  }
  return num;
};

const stat = (_data, scales, id, box, type = 0, ticks = 4) => {
  let startTime = new Date();
  let timeAxis = d3.axisBottom(scales.time).tickFormat(d3.timeFormat('%-m/%-d'));
  if (type === 1) {
    timeAxis = d3.axisBottom(scales.xaxis).tickValues(scales.xvalues);
  }
  let numAxis = d3.axisLeft(scales.num).ticks(ticks);
  if (scales.yunit) {
    let unitFormat = d => d + scales.yunit;
    numAxis.tickFormat(unitFormat);
  }

  d3.select(`#${id}`).append('g').attr('class', 'x axis').attr('transform', `translate(${box.left},${box.height - box.bottom - 0.5})`)
  .call(timeAxis);
  d3.select(`#${id}`).append('g').attr('class', 'y axis').attr('transform', `translate(${box.left},0)`)
  .call(numAxis);

  let yInner = d3.axisLeft(scales.num).ticks(ticks)
  .tickSize(box.left - box.width + 1, 0, 0)
  .tickFormat('');
  d3.select(`#${id}`).append('g')
  .attr('class', 'inner-line-y')
  .attr('transform', `translate(${box.left},0)`)
  .call(yInner);

  let xInner = d3.axisBottom(scales.time).ticks(ticks)
  .tickSize(box.bottom - box.height, 0, 0)
  .tickFormat('');
  d3.select(`#${id}`).append('g')
  .attr('class', 'inner-line-x')
  .attr('transform', `translate(${box.left},${box.height - box.bottom})`)
  .call(xInner);

  d3.select(`#${id}`).selectAll('.x.axis .tick *').attr('opacity', 0);
  d3.select(`#${id}`).selectAll('.y.axis .tick *').attr('fill', '#8f9296');

  let sel = d3.select(`#${id}`).selectAll(`.x.axis .tick:nth-child(${calTimeAxis(_data.length)})`);
  sel.selectAll('*').attr('opacity', 1).attr('fill', '#8f9296');
  console.log('-->the axis of ' + id + ' draw in ' + ((new Date()).getTime() - startTime.getTime()) + 'ms');
};

export default stat;
