let dataset = [];
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const width = 800;
const height = 400;
const barWidth = width / 275;
const padding = 40;

fetchData();




async function fetchData() {
  const response = await fetch(url);
  data = await response.json();
  createChart(data);
}

function createChart(){
    const svgContainer = d3.select('.chart')
        .append('svg')
        .attr('width', width + 100)
        .attr('height', height + 60);
    
    const yearDates = data.data.map(item => new Date(item[0]));
    const gdpValues = data.data.map(item => item[1]);
    const xMax = new Date(d3.max(yearDates));
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3.scaleTime()
        .domain([d3.min(yearDates), xMax])
        .range([padding, width]);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(gdpValues)])
        .range([height, padding]);
    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 70)
      .text('Gross Domestic Product');

    svgContainer
      .append('text')
      .attr('x', width / 2 - 50)
      .attr('y', height + 50)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

    svgContainer.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, 400)');

    svgContainer.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(40, 0)');

    const tooltip = d3.select('.chart')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('opacity', 0);

    d3.select('svg').selectAll('rect')
                    .data(gdpValues)
                    .enter()
                    .append('rect')
                    .attr('data-date', (d, i) => data.data[i][0])
                    .attr('data-gdp', (d, i) => data.data[i][1])
                    .attr('class', 'bar')
                    .attr('x', (d, i) => xScale(yearDates[i]))
                    .attr('y', (d, i) => yScale(d))
                    .attr('width', barWidth)
                    .attr('height', (d, i) => height - yScale(d))
                    .on('mouseover', (d, i) => {
                        var quarter = '';
                        console.log(data.data[i][0].substring(5, 7));
                        switch(data.data[i][0].substring(5, 7)) {
                            case '01':
                                quarter = ' Q1';
                                break;
                            case '04':
                                quarter = ' Q2';
                                break;
                            case '07':
                                quarter = ' Q3';
                                break;
                            case '10':
                                quarter = ' Q4';
                                break;
                        }
                        tooltip.transition()
                            .duration(100)
                            .style('opacity', 0.9);
                        tooltip.html(data.data[i][0].substring(0,4) + quarter + '<br>' + '$' + data.data[i][1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                            .attr('data-date', data.data[i][0])
                            .style('left', i * barWidth + 30 + 'px')
                            .style('top', height - 100 + 'px')
                    })
                    .on('mouseout', () => {
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 0);
                    });
}




