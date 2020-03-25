var timeFormat = 'MM/DD/YYYY HH:mm';

var WEEK = 1000*60*60*24*7;
var color = Chart.helpers.color;
window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};
var chartConfig = {
    type: 'line',
    data: {
        datasets: [
        {
            label: 'Lämpötila',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            borderWidth: 1,
            fill: false,
            pointRadius: 1,
            data: []
        },
        {
            label: 'Kastepiste',
            backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            borderWidth: 1,
            fill: false,
            pointRadius: 1,
            data: []
        }]
    },
    options: {
        title: {
            text: 'Chart.js Time Scale'
        },
        tooltips:  {
            mode: 'index',
            intersect: false
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        'hour': 'H:mm'
                    },
                    parser: timeFormat,
                    //round: 'hour',
                    //unit: 'day',
                    tooltipFormat: 'll HH:mm'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Aika'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Lämpötila'
                }
            }]
        },
    }
};

var weatherConfig = {};

// Stored query ids.
var STORED_QUERY_OBSERVATION = "fmi::observations::weather::multipointcoverage";
var STORED_QUERY_FORECAST = "fmi::forecast::hirlam::surface::point::multipointcoverage";

// URL for test server.
var TEST_SERVER_URL = "https://opendata.fmi.fi/wfs";

Metolib.WfsRequestParser = new Metolib.WfsRequestParser();

/**
 * Handle parser results in this callback function.
 *
 * Append result strings to the UI.
 *
 * @param {Object} data Parsed data.
 * @param {Object} errors Parser errors.
 * @param {String} test case name.
 */
function handleCallback(data, errors) {
    console.log("handleCallback");
    if (errors.length == 0) {
        let dew_data = []; //dew point
        for (const tv of data.locations[0].data.td.timeValuePairs) {
            dew_data.push({x: tv.time, y: tv.value});
        }
        let tdata = []; //temperature
        for (const tv of data.locations[0].data.temperature.timeValuePairs) {
            tdata.push({x: tv.time, y: tv.value});
        }

        if (window.chart) {
            let chart = window.chart;
            let ntdata = chart.data.datasets[0].data.concat(tdata);
            let ndew_data = chart.data.datasets[1].data.concat(dew_data);

            window.chart.data.datasets[0].data = ntdata;
            window.chart.data.datasets[1].data = ndew_data;

            window.chart.update();
        } else {
            chartConfig.data.datasets[0].data = tdata;
            chartConfig.data.datasets[1].data = dew_data;
            let ctx = document.getElementById('canvas').getContext('2d');
            window.chart = new Chart(ctx, chartConfig);
        }
    } else {
        console.log("TODO: handle callback error");
    }


    let newBegin = weatherConfig.begin;
    newBegin += WEEK;

    if (weatherConfig.totalEnd - newBegin > WEEK) {
        weatherConfig.begin = newBegin;
        weatherConfig.end = newBegin + WEEK;

        window.setTimeout(getWeatherData(TEST_SERVER_URL, weatherConfig));
    } else if (weatherConfig.totalEnd - newBegin > 0) {
        weatherConfig.begin = newBegin;
        weatherConfig.end = weatherConfig.totalEnd;

        window.setTimeout(getWeatherData(TEST_SERVER_URL, weatherConfig));
    } else {
        //we finished last section
    }
}

function getWeatherData(url, wconfig) {
    // See API documentation and comments from parser source code of
    // Metolib.WfsRequestParser.getData function for the description
    // of function options parameter object and for the callback parameters objects structures.
    Metolib.WfsRequestParser.getData({
        url : url,
        storedQueryId : STORED_QUERY_OBSERVATION,
        requestParameter : "td,temperature",
        // Integer values are used to init dates for older browsers.
        // (new Date("2013-05-10T08:00:00Z")).getTime()
        // (new Date("2013-05-12T10:00:00Z")).getTime()
        begin : wconfig.begin,
        end : wconfig.end,
        timestep : 60 * 60 * 1000,
        sites : [wconfig.location],
        callback : function(data, errors) {
            // Handle the data and errors object in a way you choose.
            // Here, we delegate the content for a separate handler function.
            // See parser documentation from source code comments for more details.
            handleCallback(data, errors);
        }
    });
}

function clearChart() {
    let chart = window.chart;
    if (chart) {
        chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
        });
        chart.update();
    }
}

function getDataHandler() {
    console.log("getDataHandler");

    let location = document.querySelector("#location").value;

    let sd = document.querySelector("#startDate").value;
    let ed = document.querySelector("#endDate").value;

    let start = (new Date(sd)).getTime();
    let end = (new Date(ed)).getTime();

    weatherConfig.location = location;
    weatherConfig.begin = start;
    weatherConfig.totalEnd = end;
    if (end - start > WEEK) {
        weatherConfig.end = start + WEEK;
    } else {
        weatherConfig.end = end;
    }

    clearChart();
    getWeatherData(TEST_SERVER_URL, weatherConfig);
}

window.onload = function() {
    document.querySelector("#getData").addEventListener("click", this.getDataHandler);
}
