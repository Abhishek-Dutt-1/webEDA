var allData = {};
function meanDiffDataLoaded(data) {
	
	console.log(data);
	allData = data;
	// get KPI Unique brands
	var kpiBrands = [];
	data.KPI.forEach( function(kpi) { 
		kpiBrands.push(kpi.Brand);
	});
	// Remove duplicates
	kpiBrands = kpiBrands.filter(function (v, i, a) { return a.indexOf(v) == i });
	// get KPI Unique Variable_Types
	var kpiVarTypes = [];
	data.KPI.forEach( function(kpi) { 
		kpiVarTypes.push(kpi.Variable_Type);
	});
	// Remove duplicates
	kpiVarTypes = kpiVarTypes.filter(function (v, i, a) { return a.indexOf(v) == i });

	var tmpBrand = [], tmpVarType, kpiData = {BRAND: []};
	kpiBrands.forEach( function(brand) {
		kpiData.BRAND.push( {BRAND: brand, KPI: []} );
		kpiVarTypes.forEach( function(varType) {
			tmpVarType = [];
			tmpVarType = data.KPI.filter( function(kpi) { return (kpi.Brand == brand && kpi.Variable_Type == varType);} );
			kpiData.BRAND[ kpiData.BRAND.length - 1].KPI.push( { brand: brand, VarType: varType, Variable: tmpVarType } );
		});
	});
	console.log(kpiData);

	// Fill up KPI select box
	var tmpStr = "";
	kpiData.BRAND.forEach( function (brand) {
		//console.log(brand);
		tmpStr += '<optgroup class="optGroupBrand" label="'+brand.BRAND+' :">';
		brand.KPI.forEach( function(kpi) {
			//tmpStr += '<optgroup class="kpiOptGroupVarType" label="' + brand.brand + ' - ' +kpi.Variable_Type + ' :">';		
			kpi.Variable.forEach( function(varName) {
				//console.log(varName);
				tmpStr += '<option class="kpiOptGroupVariable" value="'+varName.VarName+'">' + varName.Brand + ' &raquo; ' + varName.Variable_Type + '</option>';
			});
			//tmpStr += '</optgroup>';
		});		
		tmpStr += '</optgroup>';
	});
	document.getElementById('meanDiffChartSelect').innerHTML = tmpStr;
	
	
	// If available select Airtel CTB by default else select the first option
	var defaultSelection = 'Airtel CTB';
	if(allData.KPI.some( function(el) { return el.VarName == defaultSelection; } )) {
		document.getElementById('meanDiffChartSelect').value = 'Airtel CTB';
	}
	document.getElementById("meanDiffChartSelect").onchange()
	$("#loadingSpinner").hide();
	//console.log(allData);
	return;
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	var time = data.time;
	var dep = data.dependent;
	var outerChartDiv = document.createElement('div');

	// Create empty divs for each chart
	data.independent.forEach( function(indep) {
		var chartDiv = document.createElement('div');
		chartDiv.id = indep.name.replace( /[^\w\d]/g, "_");;
		chartDiv.className  = "meanDiffChart";
		outerChartDiv.appendChild(chartDiv);
	});

	document.getElementById('meanDiffChartContainer').appendChild(outerChartDiv);			
	
	// Create individual charts
	data.independent.forEach( function(indep) {
		meanDiffDrawChart(time, dep, indep);
	});
	document.getElementById("loadingSpinner").innerHTML="";
*/
}

// UI Selection change, recreate all charts
function recreateMeanDiffCharts(varName) {

	$("#loadingSpinner").show();
	$('#meanDiffChartContainer').empty();
	console.log(varName);
	//console.log(allData);
	var outerChartDiv = document.createElement('div');
	// Create empty divs for each chart
	allData.DRIVER.forEach( function(driver) {
		var chartDiv = document.createElement('div');
		chartDiv.id = driver.VarName.replace( /[^\w\d]/g, "_");
		chartDiv.className  = "edaChart";
		outerChartDiv.appendChild(chartDiv);	
	});

	document.getElementById('meanDiffChartContainer').appendChild(outerChartDiv);
	
	// Create individual charts
	var dep = allData.KPI.filter( function(el) { return el.VarName == varName; } );
	dep = calcMeanDiffSeries( dep[0] );
	allData.DRIVER.forEach( function(indep) {	
		meanDiffDrawChart(allData.time, dep, calcMeanDiffSeries(indep) );
	});
	$("#loadingSpinner").hide();
}

// Calc mean diff from given series
function calcMeanDiffSeries(varData) {
	//console.log(varData);
	var varAverage = varData.data.reduce( function( pv, cv) { return pv+cv; }, 0 ) /  varData.data.length;
	varData.data = varData.data.map( function(el) { return el - varAverage; } );
	//console.log(varData);
	return varData;
}

// Create individual EDA Charts
function meanDiffDrawChart(time, dep, indep) {

	// Create the data table.
	var i = 0;
	var dataArray = [];
	for(i=0; i < time.data.length; i++) {
		//dataArray.push( [time.data[i], dep.data[i], indep.data[i]] );
		dataArray.push( [dep.data[i], indep.data[i]] );
	}

    $( '#'+indep.VarName.replace( /[^\w\d]/g, "_") ).highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: dep.Variable_Type + " vs. " + indep.VarName,
			align: 'left',
			x: 70
        },
        xAxis: {
			//lineWidth: 0,
			//tickLength: 0,
            title: {
                enabled: true,
                text: dep.VarName
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
                text: indep.VarName
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
			name: indep.VarName,
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


/////////////////// INIT
$( document ).ready(function() {

	//var meanDiffChartData = <?php echo json_encode( getData() ); ?>;
	/*
	$.get( "viz/MeanDiff/MeanDiff.php", { edaId: edaId, projectId: projectId }, meanDiffDataLoaded, "json" ).fail( function(err) { 
		console.log("Mean Diff ERROR");
		console.log(err); 
	});
	*/	
	$.get( "viz/Compare/Compare.php", { edaId: edaId, projectId: projectId }, meanDiffDataLoaded, "json" ).fail( function(err) {
		console.log("Mean Diff ERROR");
		console.log(err);
	});
});