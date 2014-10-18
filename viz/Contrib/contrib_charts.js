/////////////////// INIT
$( document ).ready(function() {

	//var meanDiffChartData = <?php echo json_encode( getData() ); ?>;
	$.get( "viz/Contrib/Contrib.php", { dataType: 'contribSeries', edaId: edaId, modelId: modelId }, contribDataLoaded, "json" ).fail( function(err) { 
		console.log("Contrib ERROR");
		console.log(err); 
	});

});

function contribDataLoaded( data ) {

	console.log( data );
	var seriesData = [];
	
	data.modelData.independent.forEach( function(elem) {
		if( elem.coef < 0) {
			seriesData.push( { name: elem.name, data: elem.contribSeries, yAxis: 1 } );
		} else {
			seriesData.push( { name: elem.name, data: elem.contribSeries } );
		}
	});
	seriesData.push( {name: data.modelData.intercept.name, data: data.modelData.intercept.contribSeries});
	seriesData.push( {name: data.modelData.dependent.name, data: data.modelData.dependent.data,	type: 'line'});
	
	
    $('#contribSeriesChart').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: data.modelData.modelName
        },
        xAxis: {
            categories: data.modelData.time.data,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            },
			labels: { rotation: -45, maxStaggerLines: 0, step: 3 }
        },
        yAxis: [{
            title: {
                text: data.modelData.dependent.name
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
                }
            },
			min: 0
        },{ // Secondary yAxis
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
			max: 0,
            opposite: true
        }],
        tooltip: {
            shared: true,
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: seriesData,
		credits: false
    });

}