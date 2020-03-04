// API URL to fetch United States GDP:
let api_url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

/*
 * Loading data from API when DOM Content has been loaded:
 */
document.addEventListener("DOMContentLoaded", () => {
  fetch(api_url)
    .then(response => response.json())
    .then(data => {
      let data_set = parseData(data);
      drawBarChart(data_set);
    })
    .catch(err => console.log(err));
});

/**
 * Parse data function
 * @param {object} data Object containing USA GDP data over years
 */
let parseData = data => {
  let data_set = data.data;
  data_set.map((item, index) => {
    let date = new Date(item[0]);
    let qval =
      date.getMonth() == 0
        ? "Q1"
        : date.getMonth() == 3
        ? "Q2"
        : date.getMonth() == 6
        ? "Q3"
        : "Q4";

    let obj = {
      DateStr: item[0],
      Date: date,
      GDP: +item[1],
      Year: date.getFullYear(),
      QVAL: qval
    };
    data_set[index] = obj;
  });
  return data_set;
};

/**
 * Creates a bar chart graph using D3.js
 * @param {object} data Object containing USA GDP data over years
 */
let drawBarChart = data => {
  // Globals:
  const width = 1400;
  const height = 500;
  const margin = {
    top: 30,
    right: 0,
    bottom: 30,
    left: 175
  };
  let timeFormat = d3.timeFormat("%Y");

  // Scaleing:
  let xScale = d3
    .scaleTime()
    .domain([d3.min(data, d => d.Date), d3.max(data, d => d.Date)])
    .range([margin.right + margin.left, width - margin.right - margin.left]);

  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.GDP)])
    .range([height - margin.top - margin.bottom, margin.top + margin.bottom]);

  // Axes:
  let xAxis = g =>
    g
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(timeFormat))
      .call(g =>
        g
          .append("text")
          .attr("class", "x-label")
          .attr("x", width - (margin.right + margin.left))
          .attr("y", (margin.top + margin.bottom) * 0.5)
          .text("Year")
      );

  let yAxis = g =>
    g
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.right + margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d3.format("d")))
      .call(g => g.select(".domain").remove())
      .call(g =>
        g
          .append("text")
          .attr("class", "y-label")
          .attr("transform", "rotate(-90)")
          .attr("x", -(margin.right + margin.left) * 0.5)
          .attr("y", -(margin.top + margin.bottom) * 0.75)
          .text("GDP (Billion)")
      );

  // Gridlines:
  let grid = g =>
    g.call(g =>
      g
        .append("g")
        .selectAll("line")
        .data(yScale.ticks(20))
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", margin.right + margin.left)
        .attr("x2", width - (margin.right + margin.left))
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
    );

  // ToolTip:
  let toolTip = d3
    .select("main")
    .append("div")
    .attr("id", "tooltip");

  // Main PLot:
  let barChart = g =>
    g
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d.DateStr)
      .attr("data-gdp", d => d.GDP)
      .attr("x", d => xScale(d.Date))
      .attr("y", d => yScale(d.GDP))
      .attr("width", width / 275)
      .attr("height", d => height - margin.top - margin.bottom - yScale(d.GDP))
      .attr("fill", "none")
      .on("mouseover", d => {
        toolTip.style("display", "block");
        toolTip.attr("data-date", d.DateStr);
        toolTip
          .html(
            "Year: " +
              d.Year +
              " " +
              d.QVAL +
              "<br/>" +
              "GDP: " +
              d.GDP +
              " Billion"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", d => {
        toolTip.style("display", "none");
      });

  // Title:
  let title = g =>
    g.call(g =>
      g
        .append("text")
        .attr("id", "title")
        .attr("x", width / 2)
        .attr("y", (margin.top + margin.bottom) / 2)
        .text("USA GDP")
    );

  // Create SVG:
  let svg = d3
    .select(".vis-container")
    .append("svg")
    .attr("class", "svg-graph")
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Append:
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.append("g").call(grid);
  svg.append("g").call(barChart);
  svg.append("g").call(title);
};
