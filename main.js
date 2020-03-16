var timeFormat = 'MM/DD/YYYY HH:mm';

var color = Chart.helpers.color;
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Kastepiste',
            backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            fill: false,
            data: []
        }]
    },
    options: {
        title: {
            text: 'Chart.js Time Scale'
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

// Stored query ids.
var STORED_QUERY_OBSERVATION = "fmi::observations::weather::multipointcoverage";
var STORED_QUERY_FORECAST = "fmi::forecast::hirlam::surface::point::multipointcoverage";

// URL for test server.
var TEST_SERVER_URL = "http://opendata.fmi.fi/wfs";
if (TEST_SERVER_URL.indexOf("insert-your-apikey-here") !== -1) {
    alert("Check parser.html source! TEST_SERVER_URL should contain proper API-key!");
}

Metolib.WfsRequestParser = new Metolib.WfsRequestParser();


/**
 * This function recursively browses the given {data} structure and appends the content as text
 * to the {container} element.
 *
 * @param {Element} container Content is appended as a text here.
 * @param {Object|Array|String|etc} data Content that is browsed through recursively.
 * @param {String} indentStr Indentation string of the previous recursion level.
 */
function recursiveBrowse(container, data, indentStr) {
    if (_.isArray(data) || _.isObject(data)) {
        // Browse all the child items of the array or object.
        indentStr += ">";
        _.each(data, function(value, key) {
            container.append("<br>" + indentStr + " [" + key + "]");
            recursiveBrowse(container, value, indentStr);
        });

    } else {
        // This is a leaf. So, just append it after its container array or object.
        container.append(" > " + data);
    }
}

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
    let tvdata = [];
    for (const tv of data.locations[0].data.td.timeValuePairs) {
        tvdata.push({x: tv.time, y: tv.value})
    }
    config.data.datasets[0].data = tvdata;


    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);

    var results = jQuery("#results");
    //results.append("<h2>" + caseName + "</h2>");
    if (data) {
        results.append("<h3>Data object</h3>");
        recursiveBrowse(results, data, "");
    }
    if (errors) {
        results.append("<h3>Errors object</h3>");
        recursiveBrowse(results, errors, "");
    }
}

function getWeatherData(url) {
    // See API documentation and comments from parser source code of
    // Metolib.WfsRequestParser.getData function for the description
    // of function options parameter object and for the callback parameters objects structures.
    Metolib.WfsRequestParser.getData({
        url : url,
        storedQueryId : STORED_QUERY_OBSERVATION,
        requestParameter : "td,ws_10min",
        // Integer values are used to init dates for older browsers.
        // (new Date("2013-05-10T08:00:00Z")).getTime()
        // (new Date("2013-05-12T10:00:00Z")).getTime()
        begin : (new Date("2013-05-10T08:00:00Z")).getTime(),
        end : (new Date("2013-05-12T10:00:00Z")).getTime(),
        timestep : 60 * 60 * 1000,
        sites : ["Kaisaniemi,Helsinki"],
        callback : function(data, errors) {
            // Handle the data and errors object in a way you choose.
            // Here, we delegate the content for a separate handler function.
            // See parser documentation from source code comments for more details.
            handleCallback(data, errors);
        }
    });
}



jQuery(function() {
    getWeatherData(TEST_SERVER_URL);
});


/*
var colorNames = Object.keys(window.chartColors);
document.getElementById('addDataset').addEventListener('click', function () {
    var colorName = colorNames[config.data.datasets.length % colorNames.length];
    var newColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Dataset ' + config.data.datasets.length,
        borderColor: newColor,
        backgroundColor: color(newColor).alpha(0.5).rgbString(),
        data: [],
    };

    for (var index = 0; index < config.data.labels.length; ++index) {
        newDataset.data.push(randomScalingFactor());
    }

    config.data.datasets.push(newDataset);
    window.myLine.update();
});

document.getElementById('addData').addEventListener('click', function () {
    if (config.data.datasets.length > 0) {
        config.data.labels.push(newDate(config.data.labels.length));

        for (var index = 0; index < config.data.datasets.length; ++index) {
            if (typeof config.data.datasets[index].data[0] === 'object') {
                config.data.datasets[index].data.push({
                    x: newDate(config.data.datasets[index].data.length),
                    y: randomScalingFactor(),
                });
            } else {
                config.data.datasets[index].data.push(randomScalingFactor());
            }
        }

        window.myLine.update();
    }
});

document.getElementById('removeDataset').addEventListener('click', function () {
    config.data.datasets.splice(0, 1);
    window.myLine.update();
});

document.getElementById('removeData').addEventListener('click', function () {
    config.data.labels.splice(-1, 1); // remove the label first

    config.data.datasets.forEach(function (dataset) {
        dataset.data.pop();
    });

    window.myLine.update();
});

*/
