var timeFormat = 'MM/DD/YYYY HH:mm';


function newDate(days) {
    var hour = Math.round(24*Math.random())
    var minute = Math.round(60*Math.random())
    var date = moment().add(days, 'd').add(minute, 'm').add(hour, 'h').toDate();

    return date
}

function newDateString(days) {
    return moment().add(days, 'd').format(timeFormat);
}

var tdata = [{
    x: newDateString(0),
    y: randomScalingFactor()
}, {
    x: newDateString(2),
    y: randomScalingFactor()
}, {
    x: newDateString(3),
    y: randomScalingFactor()
}, {
    x: newDateString(4),
    y: randomScalingFactor()
}, {
    x: newDateString(6),
    y: randomScalingFactor()
}, {
    x: newDateString(9),
    y: randomScalingFactor()
}];

var color = Chart.helpers.color;
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Kastepiste',
            backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            fill: false,
            data: tdata
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
                    parser: timeFormat,
                    // round: 'day'
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
