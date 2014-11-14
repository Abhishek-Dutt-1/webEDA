var CHART_WIDTH = 500;
var CHART_HEIGHT = 400;
// User click on correl cell, display popup graphs
function displayGraphs(kpi, driver) {

	console.log(edaId);
	console.log(projectId);	
	console.log(kpi);
	console.log(driver);

	$('#correlChartPopup').bPopup({
		speed: 100
	});
	 
	$.get( "viz/Correl/Correl.php", { projectId: projectId, edaId: edaId, kpi: kpi, driver: driver }, correlDataLoaded, "json" ).fail( function(err) {
		console.log("ERROR");
		console.log(err);
	});

}

// Data loaded
function correlDataLoaded(data) {
	console.log(data);
	createBiVariateChart(data);
	meanDiffDrawChart(data.time, data.kpi, data.driver);

}

function createBiVariateChart(data) {

	$( '#correlBiVariateChart' ).highcharts({
        chart: {
            zoomType: 'x',
			width: CHART_WIDTH,
			height: CHART_HEIGHT			
        },
        title: {
            text: data.kpi.name + " vs. " + data.driver.name,
			align: 'left',
			x: 50
        },
        xAxis: [{
            categories: data.time.data,
			labels: { rotation: -45, maxStaggerLines: 0, step: 3 }
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                //format: '{value}°C',
                style: {
                    //color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: data.kpi.name,
                style: {
                    //color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: data.driver.name,
                style: {
                    //color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                //format: '{value} mm',
                style: {
                    //color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true,
        },
        legend: {
			layout: 'horizontal',
            align: 'bottom',
			x: 40,
			/*
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,*/
            //backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: data.kpi.name,
            type: 'line',
            data: data.kpi.data,
			color: data.kpi.color,
			zIndex: 1
        }, {
            name: data.driver.name,
            type: 'column',
			//color:'red',
			color: data.driver.color,
            data: data.driver.data,
            yAxis: 1,
        }],
		credits: false
    });

}

// Create individual EDA Charts
function meanDiffDrawChart(time, dep, indep) {

	// Create the data table.
	var i = 0;
	var dataArray = [];
	for(i=0; i < time.data.length; i++) {
		//dataArray.push( [time.data[i], dep.data[i], indep.data[i]] );
		dataArray.push( [dep.meanDiffData[i], indep.meanDiffData[i]] );
	}

    $( '#correlMeanDiffChart' ).highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy',
			width: CHART_WIDTH,
			height: CHART_HEIGHT
        },
        title: {
            text: dep.name + " vs. " + indep.name,
			align: 'left',
			x: 70
        },
        xAxis: {
			//lineWidth: 0,
			//tickLength: 0,
            title: {
                enabled: true,
                text: dep.name
            },
            startOnTick: true,
            endOnTick: true,
            //showLastLabel: true,
			plotLines : [{
				value : 0,
				color : 'lightgrey',
				dashStyle : 'dash',
				width : 1,
				/* label : {
					text : 'Last quarter maximum'
				}*/
			}]
        },
        yAxis: {
			//lineWidth: 1,
            title: {
                text: indep.name
            },
			gridLineColor: 'transparent',
			plotLines : [{
				value : 0,
				color : 'lightgrey',
				dashStyle : 'dash',
				width : 1,
				/* label : {
					text : 'Last quarter maximum'
				}*/
			}]
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
		tooltip: {
			headerFormat: '<b>{series.name}</b><br>',
			enabled: false
			//pointFormat: '{point.x} cm, {point.y} kg'
		},
		legend: {
            enabled: false
        },
        series: [{
			
            //showInLegend: false,
			name: indep.name,
            //color: 'rgba(223, 83, 83, .5)',
			color: indep.color,
            data: dataArray,
			regression: true ,
			regressionSettings: {
				showInLegend: false,
				type: 'linear',
				//color:  'rgba(223, 83, 83, .9)'
				color: indep.color
			}
        }],
		credits: false
    });

}
