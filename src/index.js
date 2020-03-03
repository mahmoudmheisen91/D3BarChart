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
      console.log(data_set);
      drawScatterPlot(data_set);
    })
    .catch(err => console.log(err));
});

/**
 * Parse data function
 * @param {object} data Object containing doping data of bicylce racing
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
      Date: date,
      GDP: +item[1],
      Year: date.getFullYear(),
      QVAL: qval
    };
    data_set[index] = obj;
  });
  return data_set;
};
