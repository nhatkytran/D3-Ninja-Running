const margins = { top: 40, right: 20, bottom: 50, left: 100 };
const canvasWidth = 560;
const canvasHeight = 400;
const graphWidth = canvasWidth - margins.right - margins.left;
const graphHeight = canvasHeight - margins.top - margins.bottom;

const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', canvasWidth)
  .attr('height', canvasHeight);

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margins.left}, ${margins.top})`);

// Scales
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// Axes groups
const xAxisGroup = graph
  .append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g').attr('class', 'y-axis');

// d3 line path generator
const line = d3
  .line()
  .x(d => x(new Date(d.date)))
  .y(d => y(d.distance));

const path = graph.append('path');

// line data point
const dottedLines = graph.append('g');
const xLine = dottedLines
  .append('line')
  .attr('stroke', '#ccc')
  .attr('stroke-dasharray', '2, 2');
const yLine = dottedLines
  .append('line')
  .attr('stroke', '#ccc')
  .attr('stroke-dasharray', '2, 2');

const graphController = (data, activity) => {
  // filter data
  data = data
    .filter(item => item.activity === activity)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // set scales domains
  x.domain(d3.extent(data, d => new Date(d.date)));
  y.domain([0, d3.max(data, d => d.distance)]);

  // path
  path
    .data([data])
    .attr('fill', 'none')
    .attr('stroke', '#00bfa5')
    .attr('stroke-width', 2)
    .attr('d', line);

  // create circles for objects
  const circles = graph.selectAll('circle').data(data);

  // remove unwanted points
  circles.exit().remove();

  // update current points
  circles.attr('cx', d => x(new Date(d.date))).attr('cy', d => y(d.distance));

  // add new points
  circles
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.distance))
    .attr('fill', '#ccc');

  graph.selectAll('circle').on('mouseover', (event, d) => {
    d3.select(event.target)
      .transition('circleMouseOver')
      .duration(100)
      .attr('r', 8)
      .attr('fill', '#fff');
    xLine
      .attr('x1', 0)
      .attr('y1', y(d.distance))
      .attr('x2', x(new Date(d.date)))
      .attr('y2', y(d.distance))
      .style('opacity', 1);
    yLine
      .attr('x1', x(new Date(d.date)))
      .attr('y1', graphHeight)
      .attr('x2', x(new Date(d.date)))
      .attr('y2', y(d.distance))
      .style('opacity', 1);
  });

  graph.selectAll('circle').on('mouseout', event => {
    d3.select(event.target)
      .transition('circleMouseOver')
      .duration(100)
      .attr('r', 4)
      .attr('fill', '#ccc');
    xLine.style('opacity', 0);
    yLine.style('opacity', 0);
  });

  // create axes
  const xAxis = d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat('%b %d'));
  const yAxis = d3
    .axisLeft(y)
    .ticks(4)
    .tickFormat(d => `${d}m`);

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // rotate axis text
  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');
};

export default graphController;
