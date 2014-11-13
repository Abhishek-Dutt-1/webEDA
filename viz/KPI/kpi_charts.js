var allData = [];
var allDataOriginal = {};
var CHART_HEIGHT = 500;
var CHART_WIDTH = 700;
// Create Trend Charts
function updateTrendChart(data) {
	console.log(data);
	
	Highcharts.Point.prototype.tooltipFormatter = function (useHeader) {
    var point = this, series = point.series;
    return ['<br/><span style="color:' + series.color + '"><span>', (point.name || series.name), '</span></span>: ',
        (!useHeader ? ('<b>x = ' + (point.name || point.x) + ',</b> ') : ''),
        '<b>', (!useHeader ? 'y = ' : ''), Highcharts.numberFormat(point.y, 0), '</b>'].join('');
	};
	//console.log(data);
    $('#kpiTrendChartContainer').highcharts({
		chart: {
			type: 'line',
			height: CHART_HEIGHT,
			//width: CHART_WIDTH
		},
        title: {
            text: data.KPI.VarName,
			align: 'left',
            x: 70,
        },
        subtitle: {
            text: '',
            //x: -20
        },
       xAxis: {
            categories: data.time.data,
			labels: { rotation: -45, maxStaggerLines: 0, step: 1 }

        },
        yAxis: {
            title: {
				//text: ''
                text: data.KPI.VarName
            },
			gridLineColor: 'transparent',
        },
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: [{
            name: 'UCL3',
            data: data.KPI.UCL3,
			dashStyle: 'ShortDash',
			color: '#058DC7',
			color: 'lightgrey',
			enableMouseTracking: false,			
			marker:  { enabled: false }
        }, {
            name: 'UCL2',
            data: data.KPI.UCL2,
			dashStyle: 'ShortDot',
			color: '#50B432',
			color: 'lightgrey',
			enableMouseTracking: false,			
			marker:  { enabled: false }
        }, {
            name: 'UCL1',
            data: data.KPI.UCL1,
			dashStyle: 'ShortDashDot',
			color: '#ED561B',
			color: 'lightgrey',
			enableMouseTracking: false,			
			marker:  { enabled: false }
        }, {
            name: 'Average',
            data: data.KPI.Average,
			dashStyle: 'Dot',
			color: '#DDDF00',
			color: 'lightgrey',
			enableMouseTracking: false,
			lineWidth: 5,
			marker:  { enabled: false }
        }, {
            name: 'LCL1',
            data: data.KPI.LCL1,
			dashStyle: 'Dash',
			color: '#24CBE5',
			color: 'lightgrey',
			enableMouseTracking: false,			
			marker:  { enabled: false }
        }, {
            name: 'LCL2',
            data: data.KPI.LCL2,
			dashStyle: 'LongDash',
			color: '#64E572',
			color: 'lightgrey',
			enableMouseTracking: false,			
			marker:  { enabled: false }
        }, {
            name: 'LCL3',
            data: data.KPI.LCL3,
			dashStyle: 'ShortDashDotDot',
			color: '#FF9655',
			color: 'lightgrey',
			enableMouseTracking: false,			
			marker:  { enabled: false }
        }, {
            name: data.KPI.VarName,
            data: data.KPI.data,
			dashStyle:'Solid',
			color: data.KPI.color,
			marker:  { enabled: false },
			regressionSettings: {
				showInLegend: false,
				type: 'linear',
				//color:  'rgba(223, 83, 83, .9)'
				color: data.KPI.color
			}
        }],
		credits: false
    });
}
/////////// Data loaded
// will fill up allData
// but also preserve original data
function trendDataLoaded(data) {
	allDataOriginal = data;
	reorganizeData(data);
	//console.log(allData);
	// Show the first one 
	document.getElementById("trendChartSelect").onchange()

}
// select's onChange
function updateKPIChart(el) {
	console.log(el);
	var selEl = [];
	selEl = allDataOriginal.KPI.filter( function(kpi) { return kpi.VarName == el; });
	console.log(selEl);
	var chartData = { KPI: selEl[0], time: allDataOriginal.time}
	updateTrendChart(chartData);
}

/////////////////// INIT
$( document ).ready(function() {

	console.log("edaId " + edaId);
	console.log("projectId " + projectId);

	$.get( "viz/KPI/KPI.php", { edaId: edaId, projectId: projectId }, trendDataLoaded, "json" ).fail( function(err) {
		console.log("Trend Chart ERROR!");
		console.log(err); 
	});

});

///////////////////////// REORGANIZE DATA
function reorganizeData(data) {
	console.log(data);
	var brands = [];
	var kpis = [];
	brands = getAllUniqueBrands(data);
	kpis = getAllUniqueKPIs(data);
	/*
	allData = {brands: []};
	brands.forEach( function(brand) {
		allData.brands.push({
					brand: brand,
					KPI: data.KPI.filter( function(e) { return e.Brand == brand; } ),
					DRIVER: data.DRIVER.filter( function(e) { return e.Brand == brand; } )
		});
	});
	*/
	allData = {brands: []};
	var brandExists = false;
	var kpiExists = false;
	var i, j;
	brands.forEach( function(brand) {
		kpis.forEach( function(kpi) {
			data.KPI.forEach( function(dataKpi) {
				if(dataKpi.Brand == brand && dataKpi.Variable_Type == kpi) {
					// Find and update
					for (i = 0; i < allData.brands.length; i++) {
						for (j = 0; j < allData.brands[i].KPI.length; j++) {
							if (allData.brands[i].brand == brand) {
								brandExists = true;
								if (allData.brands[i].KPI[j].Variable_Type == kpi) {
									allData.brands[i].KPI[j].Variable.push( dataKpi );
									kpiExists = true;
								}
							}
						};
					};
					if (!brandExists) {
						allData.brands.push({brand: brand, KPI: [], DRIVER: []});
					}
					if (!kpiExists) {
						allData.brands.forEach( function(brandTmp, i, arr) {
							if(brandTmp.brand == brand) {
								allData.brands[i].KPI.push( {Variable_Type: kpi, Variable: [dataKpi]});
							}
						});
					}
					brandExists = false;
					kpiExists = false;
				}
			});
			/*
			data.DRIVER.forEach( function(dataKpi) {
				if(dataKpi.Brand == brand && dataKpi.Variable_Type == kpi) {
					// Find and update
					for (i = 0; i < allData.brands.length; i++) {
						for (j = 0; j < allData.brands[i].DRIVER.length; j++) {
							if (allData.brands[i].brand == brand) {
								brandExists = true;
								if (allData.brands[i].DRIVER[j].Variable_Type == kpi) {
									allData.brands[i].DRIVER[j].Variable.push( dataKpi );
									kpiExists = true;
								}
							}
						};
					};
					if (!brandExists) {
						//allData.brands.push({brand: brand, KPI: [], DRIVER: []});
					}
					if (!kpiExists) {
						allData.brands.forEach( function(brandTmp, i, arr) {
							if(brandTmp.brand == brand) {
								allData.brands[i].DRIVER.push( {Variable_Type: kpi, Variable: [dataKpi]});
							}
						});
					}
					brandExists = false;
					kpiExists = false;
				}
			});
			*/
		});
	});
	
	console.log(allData);
	// Add time to allData
	allData.time = data.time;

	// Fill up KPI select box
	var tmpStr = "";
	allData.brands.forEach( function (brand) {
		//tmpStr += '<optgroup class="optGroupBrand" label="'+brand.brand+' :">';
		brand.KPI.forEach( function(kpi) {
			//tmpStr += '<optgroup class="kpiOptGroupVarType" label="' + brand.brand + ' - ' +kpi.Variable_Type + ' :">';		
			kpi.Variable.forEach( function(varName) {
				tmpStr += '<option class="kpiOptGroupVariable" value="'+varName.VarName+'">' + brand.brand + ' :: ' + kpi.Variable_Type + ' :: ' + varName.VarName +'</option>';
			});
		});
		//tmpStr += '</optgroup>';
		//tmpStr += '</optgroup>';
	});
	document.getElementById('trendChartSelect').innerHTML = tmpStr;
}

/** Helper Funtions **/
function getAllUniqueBrands(data) {	
	
	var brands = [];
	data.KPI.forEach( function(el) {
		brands.push( el.Brand );
	});
	/*
	data.DRIVER.forEach( function(el) {
		brands.push( el.Brand );
	});
	data.OTHERS.forEach( function(el) {
		brands.push( el.Brand );
	});
	*/
	// Remove duplicates
	brands = brands.filter(function (v, i, a) { return a.indexOf(v) == i });
	return brands;
}

function getAllUniqueKPIs(data) {	
	
	var brands = [];
	data.KPI.forEach( function(el) {
		brands.push( el.Variable_Type );
	});
	/*
	data.DRIVER.forEach( function(el) {
		brands.push( el.Variable_Type );
	});
	data.OTHERS.forEach( function(el) {
		brands.push( el.Variable_Type );
	});
	*/
	// Remove duplicates
	brands = brands.filter(function (v, i, a) { return a.indexOf(v) == i });
	return brands;
}
