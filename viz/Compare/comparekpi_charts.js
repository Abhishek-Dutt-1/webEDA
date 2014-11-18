// Create Compare Tables and Charts
var allData = {};
var tableData = {};
var selectionData = {};
var addNewBrandToIndex;
var MAX_TABLE_COLUMNS = 3;
var CHART_WIDTH = 180;
var CHART_HEIGHT = 70;
function compareDataLoaded(data) {
	console.log(data);
	allData = data;

	// Get unique brand names
	tableData.brands = getUniqueBrands();
	// Get unique KPI names
	tableData.brands.forEach( function(el, i, arr) {
		arr[i].kpis = getUniqueKPIs();	// Even the missing ones
	});

	// Get data for each kpi
	getBrandKPIData();
	// Fill the info array within driver with empty so all are of equal length
	//console.log( countMaxInfoArray() );
	augmentInfoArray( countMaxInfoArray() );
	
	// Add time data
	tableData.time = allData.time;
	// Store Variable Types (in same order as above) separately for easy display as table labels in first columns
	//tableData.varTypes = getUniqueKPIs();
	tableData.varTypes = augmentVarTypesArray( getUniqueKPIs(), countMaxInfoArray() );

	// Initialize with all data
	selectionData = JSON.parse(JSON.stringify(tableData));
	//selectionData = tableData;
	//console.log(tableData);
	
	var str = '';
	tableData.brands.forEach( function(el) {
		str += '<a href="#" class="button special fit" onclick="selectionAddBrand(\'' + el.brand + '\'); return false;">' + el.brand + '</a>';
	});
	document.getElementById('selectTableVariablesList').innerHTML = str;
	// Initial Load
	updateSelectionTable();
	document.getElementById("loadingSpinner").innerHTML="";
	console.log(selectionData);
}

// Create the actual chart
function drawSparkLineChart(data) {

	$( '#'+ data.VarNameId).highcharts({
        chart: {
			type: 'area',
            zoomType: 'x',
			backgroundColor: null,
			borderWidth: 0,
			type: 'area',
			margin: [2, 0, 2, 0],
			//width: CHART_WIDTH,
			height: CHART_HEIGHT,
			style: {
				overflow: 'visible'
			},
			skipClone: true
        },
        title: {
            text: '', //data.VarName + " vs. " + allData.time.VarName,
			align: 'left',
			x: 50
        },
        xAxis: [{
            categories: allData.time.data,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			startOnTick: false,
			endOnTick: false,
			tickPositions: []

        }],
        yAxis: { // Primary yAxis
				endOnTick: false,
				startOnTick: false,
				labels: {
					enabled: false
				},
				title: {
					text: null
				},
				tickPositions: [0],
				max: 100,
				min: 0
				//title: {
					//text: data.VarName,
				//}
        },
         tooltip: {
		 /*
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                hideDelay: 0,
                shared: true,
                padding: 0,
                positioner: function (w, h, point) {
                    return { x: point.plotX - w / 2, y: point.plotY - h};
                },
				enabled: false
			*/
		},
        legend: {
                enabled: false
		},
		plotOptions: {
			series: {
				animation: false,
				lineWidth: 1,
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				marker: {
					radius: 1,
					states: {
						hover: {
							radius: 2
						}
					}
				},
				fillOpacity: 0.25
			},
			column: {
				negativeColor: '#910000',
				borderColor: 'silver'
			}
		},
        series: [{
            name: data.VarName,
            //type: 'line',
            data: data.data,
			color: data.color,
			zIndex: 1
        }],
		exporting: false,
		credits: false
    });
}
// Get all unique brands in the KPI data 
function getUniqueBrands() {
	var brands = [];
	allData.KPI.forEach( function(el) {
		brands.push(el.Brand);
	});
	// Remove duplicates
	brands = brands.filter(function (v, i, a) { return a.indexOf(v) == i });
	var brandsObj = [];
	brands.forEach( function(el) {
		brandsObj.push({brand: el});
	});	
	return brandsObj;
}
// Get all unique KPI across all brands 
function getUniqueKPIs() {
	var kpis = [];
	allData.KPI.forEach( function(el) {
		kpis.push(el.Variable_Type);
	});
	// Remove duplicates
	kpis = kpis.filter(function (v, i, a) { return a.indexOf(v) == i });
	var kpisObj = [];
	kpis.forEach( function(el) {
		kpisObj.push({kpi: el});
	});	
	return kpisObj;
}
// Get all unique KPI only for selected brands
function getSelectedUniqueKPIs() {
	var kpis = [];
	allData.KPI.forEach( function(el) {
		selectionData.brands.forEach( function(e) {
			if(e.brand == el.Brand) {
				kpis.push(el.Variable_Type);
			}
		});
	});
	// Remove duplicates
	kpis = kpis.filter(function (v, i, a) { return a.indexOf(v) == i });
	var kpisObj = [];
	kpis.forEach( function(el) {
		kpisObj.push({kpi: el});
	});	
	return kpisObj;
}
// Function get all KPI grouped by Brands
function getBrandKPIData() {
	var brands = [];
	tableData.brands.forEach( function(elem, ind, arr) {
		elem.kpis.forEach( function(el, i, a) {
			arr[ind].kpis[i].info = allData.KPI.filter( function(e) { return (e.Brand == elem.brand && e.Variable_Type == el.kpi); } );
			arr[ind].kpis[i].info.forEach( function(tmp, index, tmpArray) {
				tmpArray[index].VarNameId = tmp.VarName.replace( /[^\w\d]/g, "_") + "_" + ind + "_" + i + "_" + index;
			});
		});
	});
}
// Function get all KPI grouped by Brands for selected brands only
function getSelectedBrandKPIData() {
	console.log(selectionData.brands);
	selectionData.brands.forEach( function(elem, ind, arr) {
		elem.kpis.forEach( function(el, i, a) {
			arr[ind].kpis[i].info = allData.KPI.filter( function(e) { return (e.Brand == elem.brand && e.Variable_Type == el.kpi); } );
			arr[ind].kpis[i].info.forEach( function(tmp, index, tmpArray) {
				//tmpArray[index].VarNameId = tmp.VarName.replace( /[^\w\d]/g, "_") + "_" + ind + "_" + i + "_" + index;
				selectionData.brands[ind].kpis[i].info[index].VarNameId = "_" + ind + "_" + i + "_" + index; //tmp.VarName.replace( /[^\w\d]/g, "_") + "_" + ind + "_" + i + "_" + index;
				console.log(selectionData.brands[ind].kpis[i].info[index].VarNameId);
			});
		});
	});
	console.log(selectionData.brands);
}

// Fill the info array within driver with empty so all are of equal length
// Only runs ones 
function countMaxInfoArray() {
	var maxCount = [];	// [ 0:{driver: var_type, maxCount: maxCount}, ... ]
	var maxCount = getUniqueKPIs();
	var tmpMaxCount = [];
	// Augment info array with emptys
	tableData.brands.forEach( function(brand, i, arr) {
		brand.kpis.forEach( function(kpi) {
			//console.log( driver.driver + " :: " + driver.info.length );
			for ( i = 0; i < maxCount.length; i++) {
				if(maxCount[i].kpi == kpi.kpi) {
					if (maxCount[i].maxCount) {
						maxCount[i].maxCount = maxCount[i].maxCount > kpi.info.length ? maxCount[i].maxCount : kpi.info.length;
					} else {
						maxCount[i].maxCount = kpi.info.length;
					}
				}
			}
		});
	});
	//console.log(maxCount);
	return maxCount;
}
// Fill the selection info array within driver with empty so all are of equal length
function selectionCountMaxInfoArray() {
	var maxCount = [];	// [ 0:{driver: var_type, maxCount: maxCount}, ... ]
	var maxCount = getSelectedUniqueKPIs();
	var tmpMaxCount = [];
	// Augment info array with emptys 
	selectionData.brands.forEach( function(brand, i, arr) {
		brand.kpis.forEach( function(kpi) {
			console.log( kpi.kpi + " :: " + kpi.info.length );
			for ( i = 0; i < maxCount.length; i++) {
				if(maxCount[i].kpi == kpi.kpi) {
					if (maxCount[i].maxCount) {
						maxCount[i].maxCount = maxCount[i].maxCount > kpi.info.length ? maxCount[i].maxCount : kpi.info.length;
					} else {
						maxCount[i].maxCount = kpi.info.length;
					}
				}
			}
		});
	});
	console.log(maxCount);
	return maxCount;
}
///// Only runs ones
function augmentInfoArray(maxCount) {
	//console.log(tableData);
	//console.log(maxCount);
	tableData.brands.forEach( function(brand, index, arr) {
		brand.kpis.forEach( function(kpi, ind, arr2) {
			for (i=0; i < maxCount.length; i++) {
				if (maxCount[i].kpi == kpi.kpi) {
					//console.log(tableData.brands[index].kpis[ind].info.length);
					//console.log(maxCount[i]);
					//console.log( kpi.kpi + " :: " + kpi.info.length );
					while( tableData.brands[index].kpis[ind].info.length < maxCount[i].maxCount) {
						tableData.brands[index].kpis[ind].info.push({Brand: false});
						//console.log("-----");
					}					
				}
			}
		});
	});
	//console.log(tableData);
}
///// selection
function selectionAugmentInfoArray(maxCount) {
	console.log(tableData);
	selectionData.brands.forEach( function(brand, index, arr) {
		brand.kpis.forEach( function(kpi, ind, arr2) {
			for (i=0; i < maxCount.length; i++) {
				if (maxCount[i].kpi == kpi.kpi) {
					console.log(tableData.brands[index].kpi[ind].info.length);
					console.log(maxCount[i]);
					console.log( kpi.kpi + " :: " + kpi.info.length );
					while( selectionData.brands[index].kpi[ind].info.length < maxCount[i].maxCount) {
						selectionData.brands[index].kpi[ind].info.push({Brand: false});
						console.log("-----");
					}					
				}
			}
		});
	});
	console.log(tableData);
}
// repeate table labels (the first column)
function augmentVarTypesArray(varTypesArray, maxCountArray) {
	var i = 0;
	var varTypes = [];
	maxCountArray.forEach( function(varType) {
		for (i=0; i < varType.maxCount; i++) {
			varTypes.push({kpi: varType.kpi});
		}
	});
	//console.log(varTypes);
	return varTypes;
}

// UI remove a brand from table
function selectionRemoveBrand( brandId ) {
	/*
	selectionData.brands = selectionData.brands.filter( function(el) {
		return el.brand != varName;
	});
	*/
	// In place deletion
	selectionData.brands[brandId] = { brand: false };
	/*
	selectionData.brands = selectionData.brands.map( function(el) {
		return el.brand == varName ? { brand: false } : el;
	});
	*/
	updateSelectionTable();
}

// UI add a brand to the table
function selectionShowAddPopup(position) {
	addNewBrandToIndex = position;
	console.log("ADD " + position);
	 $('#selectTableVariable').bPopup({
		speed: 100
	 });
}

// Actual add brand to the table
function selectionAddBrand(brandToAdd) {
	
	// Get unique brand names
	selectionData.brands[addNewBrandToIndex] = {brand: brandToAdd};
	// Get unique KPI names
	selectionData.brands.forEach( function(el, i, arr) {
		arr[i].kpis = getSelectedUniqueKPIs();	// Even the missing ones
	});
	// Get data for each kpi
	getSelectedBrandKPIData();
	console.log(selectionData);
	
	// Add time data
	selectionData.time = allData.time;
	// Store Variable Types (in same order as above) separately for easy display as table labels in first columns
	selectionData.varTypes = getSelectedUniqueKPIs();
	//console.log(brandToAdd);
	//console.log( tableData );
	//getSelectedBrandKPIData();
	//console.log( tableData.brands.filter( function (el) { return el.brand == brandToAdd; }) );
	//selectionData.brands[addNewBrandToIndex] = tableData.brands.filter( function (el) { return el.brand == brandToAdd; })[0];
	//console.log(selectionData);
	updateSelectionTable();
	
	$('#selectTableVariable').bPopup().close();
}

// Update Selection Table
function updateSelectionTable() {

	$('#selectionTableContainer').empty();
	
	if( selectionData.brands.length < MAX_TABLE_COLUMNS ) {
		selectionData.brands.push({ brand: false });
	}
		
	// compile the template
	var buildingTemplate = dust.compile($("#selectionTableTemplate").html(), "tableTemplate");
	// load the compiled template into the dust template cache
	dust.loadSource(buildingTemplate);
	// create a function that takes the data object
	// in this case it's a 'building' object
	var template = function(building) {	
		var result;	
		dust.render("tableTemplate", building, function(err, res) {
			result = res;
		});	
		return result;
	};

	// append the template to it's host container
	//$("#someID").html(template(building));
	$("#selectionTableContainer").html(template(selectionData));
		
	// Create individual charts
	selectionData.brands.forEach( function(brand, ind) {
		if(brand.kpis) {
			brand.kpis.forEach( function(kpi, i) {
				kpi.info.forEach( function(data, index) {
					drawSparkLineChart(data);
				});
			});
		}
	});
}
///////////////////
// Show a popup with a one chart with given varTypes of all brands
// Assumption: Only one varType variable per brand
function displayChartPopup(varType) {
	console.log(varType);
	console.log(selectionData);
	var chartData = [];
	selectionData.brands.forEach( function(brand) {
		if(brand.brand) {	// since any unselected brand will have brand.brand false
			brand.kpis.forEach( function(kpi) {
				if( kpi.kpi == varType ) {
					// Ideally there should be only one varType variable per brand, so [0] should no be a problem
					chartData.push(kpi.info[0]);
				}
			});
		}
	});
	updatePopupKPIChart(selectionData.time, chartData, varType);
	console.log(chartData);
	$('#chartPopup').bPopup({
		speed: 100
	});
}
// populate pop-up chart
function updatePopupKPIChart(time, chartData, varType) {
	
	var chartSeries = [];
	var brandString = '';
	chartData.forEach( function(el) {
		chartSeries.push({
			name: el.VarName,
            data: el.data,
			color: el.color
		});
		brandString += el.Brand + " ";
	});
	
    $('#combinedKPIChart').highcharts({
		chart: {
			zoomType: 'x',
			height: 400,
			width: 800
		},
        title: {
            text: varType,
        },
        xAxis: {
            categories: time.data,
			labels: { rotation: -45, maxStaggerLines: 0, step: 2 }			
        },
        yAxis: {
            title: {
                text: varType
            },
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
        series: chartSeries,
		credits: false
    });

}
/////////////////// INIT
$( document ).ready(function() {

	console.log("edaId " + edaId);
	console.log("projectId " + projectId);

	$.get( "viz/Compare/Compare.php", { edaId: edaId, projectId: projectId }, compareDataLoaded, "json" ).fail( function(err) {
		console.log("Compare KPI Charts ERROR!");
		console.log(err);
	});

});

//////////////Control Chart Functions//////////////////////////////////////////////////////////
function showControlChart(varName) {
	console.log(varName);
	console.log(allData);
	var chartData = allData.KPI.filter( function(kpi) { return kpi.VarName == varName; });
	chartData.KPI = chartData[0];
	chartData.time = allData.time;
	
	var countElements = chartData.KPI.data.length;
	var depAv = chartData.KPI.data.reduce(function(pv, cv) { return pv + cv; }, 0)/countElements;
	var stdDev = standardDeviation( chartData.KPI.data, true);

	chartData.KPI.Average = Array.apply(null, new Array(countElements)).map(Number.prototype.valueOf,depAv);
	var numControlLimits = 3
	for(var i = 1; i <= numControlLimits; i++) {
		chartData.KPI['UCL'+i] = Array.apply(null, new Array(countElements)).map(Number.prototype.valueOf, depAv + (stdDev*i) ); //array_fill(0, countElements, depAv + (stdDev*i) );
		chartData.KPI['LCL'+i] = Array.apply(null, new Array(countElements)).map(Number.prototype.valueOf, depAv - (stdDev*i) ); //array_fill(0, countElements, depAv - (stdDev*i) );
	}
	updateTrendChart(chartData);
	console.log(chartData);
	$('#controlChartPopup').bPopup({
		speed: 100
	});
}
function standardDeviation(values) {
  var avg = average(values);
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  var avgSquareDiff = average(squareDiffs);
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
function average(data) {
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
  var avg = sum / data.length;
  return avg;
}
function updateTrendChart(data) {
	console.log(data);
	
	Highcharts.Point.prototype.tooltipFormatter = function (useHeader) {
    var point = this, series = point.series;
    return ['<br/><span style="color:' + series.color + '"><span>', (point.name || series.name), '</span></span>: ',
        (!useHeader ? ('<b>x = ' + (point.name || point.x) + ',</b> ') : ''),
        '<b>', (!useHeader ? 'y = ' : ''), Highcharts.numberFormat(point.y, 0), '</b>'].join('');
	};
	//console.log(data);
    $('#controlChart').highcharts({
		chart: {
			type: 'line',
			//height: CHART_HEIGHT,
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
			labels: { rotation: -45, maxStaggerLines: 0, step: 2 }

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