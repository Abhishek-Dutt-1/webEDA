// Create Compare Tables and Charts
var allData = {};
var tableData = {};
var selectionData = {};
var addNewBrandToIndex;
var MAX_TABLE_COLUMNS = 3;
var CHART_WIDTH = 180;
var CHART_HEIGHT = 150;
function compareDataLoaded(data) {
	console.log(data);
	allData = data;

	// Get unique brand names
	tableData.brands = getUniqueBrands();
	// Get unique DRIVER names
	tableData.brands.forEach( function(el, i, arr) {
		arr[i].drivers = getUniqueDRIVERs();	// Even the missing ones
	});
	
	// Get data for each driver
	getBrandDRIVERData();
	// Fill the info array within driver with empty so all are of equal length
	augmentInfoArray( countMaxInfoArray() );
	
	// Add time data
	tableData.time = allData.time;
	// Store Variable Types (in same order as above) separately for easy display as table labels in first columns
	tableData.varTypes = augmentVarTypesArray( getUniqueDRIVERs(), countMaxInfoArray() );

	// Initialize with all data
	selectionData = JSON.parse(JSON.stringify(tableData));
	//selectionData = tableData;
	console.log(tableData);
	
	var str = '';
	tableData.brands.forEach( function(el) {
		str += '<a href="#" class="button special fit" onclick="selectionAddBrand(\'' + el.brand + '\'); return false;">' + el.brand + '</a>';
	});
	document.getElementById('selectTableVariablesList').innerHTML = str;
	console.log(tableData.brands);
	// Initial Load
	createThresholdInputs(selectionData);
	updateSelectionTable();

}

// Create the actual chart
function drawGaugeChart(data, dataValue, maxValue) {

	$( '#'+ data.VarNameId).highcharts({

        chart: {
            type: 'solidgauge',
            backgroundColor: 'transparent',
			width:  CHART_WIDTH,
			height: CHART_HEIGHT,			
        },
        title: null,
        pane: {
            center: ['50%', '70%'],
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#fff',
                innerRadius: '50%',
                outerRadius: '100%',
                shape: 'arc',
                borderColor: 'transparent'
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        yAxis: {
            min: 0,
            max: maxValue,
            stops: [
                [0.1, '#e74c3c'], // red
                [0.5, '#f1c40f'], // yellow
                [0.9, '#2ecc71'] // green
                ],
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            gridLineWidth: 0,
            gridLineColor: 'transparent',
            labels: {
                enabled: false
            },
            title: {
                enabled: false
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: -15,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        series: [{
            data: [dataValue]
        }]
    });
}

// Get all unique brands in the DRIVER data 
function getUniqueBrands() {
	var brands = [];
	allData.DRIVER.forEach( function(el) {
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

// Get all unique DRIVER across all brands 
function getUniqueDRIVERs() {
	var drivers = [];
	allData.DRIVER.forEach( function(el) {
		drivers.push(el.Variable_Type);
	});
	// Remove duplicates
	drivers = drivers.filter(function (v, i, a) { return a.indexOf(v) == i });
	var driversObj = [];
	drivers.forEach( function(el) {
		driversObj.push({driver: el});
	});	
	return driversObj;
}
// Get all unique DRIVER only for selected brands
function getSelectedUniqueDRIVERs() {
	var drivers = [];
	allData.DRIVER.forEach( function(el) {
		selectionData.brands.forEach( function(e) {
			if(e.brand == el.Brand) {
				drivers.push(el.Variable_Type);
			}
		});
	});
	// Remove duplicates
	drivers = drivers.filter(function (v, i, a) { return a.indexOf(v) == i });
	var driversObj = [];
	drivers.forEach( function(el) {
		driversObj.push({driver: el});
	});	
	return driversObj;
}
// Function get all DRIVER grouped by Brands
function getBrandDRIVERData() {
	var brands = [];
	tableData.brands.forEach( function(elem, ind, arr) {
		elem.drivers.forEach( function(el, i, a) {
			arr[ind].drivers[i].info = allData.DRIVER.filter( function(e) { return (e.Brand == elem.brand && e.Variable_Type == el.driver); } );
			arr[ind].drivers[i].info.forEach( function(tmp, index, tmpArray) {
				tmpArray[index].VarNameId = tmp.VarName.replace( /[^\w\d]/g, "_") + "_" + ind + "_" + i + "_" + index;
			});
		});
	});
}
// Function get all DRIVER grouped by Brands for selected brands only
function getSelectedBrandDRIVERData() {
	console.log(selectionData.brands);
	selectionData.brands.forEach( function(elem, ind, arr) {
		elem.drivers.forEach( function(el, i, a) {
			arr[ind].drivers[i].info = allData.DRIVER.filter( function(e) { return (e.Brand == elem.brand && e.Variable_Type == el.driver); } );
			arr[ind].drivers[i].info.forEach( function(tmp, index, tmpArray) {
				//tmpArray[index].VarNameId = tmp.VarName.replace( /[^\w\d]/g, "_") + "_" + ind + "_" + i + "_" + index;
				selectionData.brands[ind].drivers[i].info[index].VarNameId = "_" + ind + "_" + i + "_" + index; //tmp.VarName.replace( /[^\w\d]/g, "_") + "_" + ind + "_" + i + "_" + index;
				console.log(selectionData.brands[ind].drivers[i].info[index].VarNameId);
			});
		});
	});
	console.log(selectionData.brands);
}

// Fill the info array within driver with empty so all are of equal length
// Only runs ones 
function countMaxInfoArray() {
	var maxCount = [];	// [ 0:{driver: var_type, maxCount: maxCount}, ... ]
	var maxCount = getUniqueDRIVERs();
	var tmpMaxCount = [];
	// Augment info array with emptys 
	tableData.brands.forEach( function(brand, i, arr) {
		brand.drivers.forEach( function(driver) {
			//console.log( driver.driver + " :: " + driver.info.length );
			for ( i = 0; i < maxCount.length; i++) {
				if(maxCount[i].driver == driver.driver) {
					if (maxCount[i].maxCount) {
						maxCount[i].maxCount = maxCount[i].maxCount > driver.info.length ? maxCount[i].maxCount : driver.info.length;
					} else {
						maxCount[i].maxCount = driver.info.length;
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
	var maxCount = getSelectedUniqueDRIVERs();
	var tmpMaxCount = [];
	// Augment info array with emptys 
	selectionData.brands.forEach( function(brand, i, arr) {
		brand.drivers.forEach( function(driver) {
			console.log( driver.driver + " :: " + driver.info.length );
			for ( i = 0; i < maxCount.length; i++) {
				if(maxCount[i].driver == driver.driver) {
					if (maxCount[i].maxCount) {
						maxCount[i].maxCount = maxCount[i].maxCount > driver.info.length ? maxCount[i].maxCount : driver.info.length;
					} else {
						maxCount[i].maxCount = driver.info.length;
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
	tableData.brands.forEach( function(brand, index, arr) {
		brand.drivers.forEach( function(driver, ind, arr2) {
			for (i=0; i < maxCount.length; i++) {
				if (maxCount[i].driver == driver.driver) {
					//console.log(tableData.brands[index].drivers[ind].info.length);
					//console.log(maxCount[i]);
					//console.log( driver.driver + " :: " + driver.info.length );
					while( tableData.brands[index].drivers[ind].info.length < maxCount[i].maxCount) {
						tableData.brands[index].drivers[ind].info.push({Brand: false});
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
		brand.drivers.forEach( function(driver, ind, arr2) {
			for (i=0; i < maxCount.length; i++) {
				if (maxCount[i].driver == driver.driver) {
					console.log(tableData.brands[index].drivers[ind].info.length);
					console.log(maxCount[i]);
					console.log( driver.driver + " :: " + driver.info.length );
					while( selectionData.brands[index].drivers[ind].info.length < maxCount[i].maxCount) {
						selectionData.brands[index].drivers[ind].info.push({Brand: false});
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
			varTypes.push({driver: varType.driver});
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
	// Get unique DRIVER names
	selectionData.brands.forEach( function(el, i, arr) {
		arr[i].drivers = getSelectedUniqueDRIVERs();	// Even the missing ones
	});
	// Get data for each driver
	getSelectedBrandDRIVERData();
	console.log(selectionData);

	// Fill the info array within driver with empty so all are of equal length
	//console.log(selectionCountMaxInfoArray());
	selectionAugmentInfoArray( selectionCountMaxInfoArray() );
	
	// Add time data
	selectionData.time = allData.time;
	// Store Variable Types (in same order as above) separately for easy display as table labels in first columns
	//selectionData.varTypes = getSelectedUniqueDRIVERs();
	selectionData.varTypes = augmentVarTypesArray( getSelectedUniqueDRIVERs(), selectionCountMaxInfoArray() );
	
	updateSelectionTable();
	
	$('#selectTableVariable').bPopup().close();
}

// Creates inputs for thresholds
function createThresholdInputs(selData) {
	console.log(selData);
	var tmpVarTypes = [];
	selData.varTypes.forEach( function(varType) {
		tmpVarTypes.unshift(varType.driver);
	});
	tmpVarTypes = tmpVarTypes.filter(function (v, i, a) { return a.indexOf(v) == i });
	var varTypesObj = { varTypes:[] };
	tmpVarTypes.forEach( function(el) {
		varTypesObj.varTypes.push({varType: el, varTypeId: el.replace( /[^\w\d]/g, "_") + "_Threshold_Input"});
	});	
	console.log(varTypesObj);
	//////////////////////////////////////////////////////////////////////////////////////////
	$('#thresholdInputsOuter').empty();
	// compile the template
	var buildingTemplate = dust.compile($("#diagnosticsThresholdInputsTemplate").html(), "thresholdTemplate");
	// load the compiled template into the dust template cache
	dust.loadSource(buildingTemplate);
	// create a function that takes the data object
	// in this case it's a 'building' object
	var template = function(building) {	
		var result;	
		dust.render("thresholdTemplate", building, function(err, res) {
			result = res;
		});	
		return result;
	};
	// append the template to it's host container
	$("#thresholdInputsOuter").html(template(varTypesObj));
	//////////////////////////////////////////////////////////////////////////////////////////
	
}
// get user input
function getThresholdValueByVarType(varType) {
	if(!varType) return;
	if( document.getElementById( varType.replace( /[^\w\d]/g, "_") + "_Threshold_Input" ).value == '') {
		document.getElementById( varType.replace( /[^\w\d]/g, "_") + "_Threshold_Input" ).value == 0;
	}
	return document.getElementById( varType.replace( /[^\w\d]/g, "_") + "_Threshold_Input" ).value;
	
}
// Get count of values above threshold
function getPointsAboveThresholdValue(data, threshold) {
	//console.log(data);
	//console.log(threshold);
	return data.data.filter( function(el) { return el > threshold; } ).length; 
	//console.log( data.data.filter( function(el) { return el > threshold; } ) );
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
	var threhsoldValue = 0;
	// Create individual charts
	selectionData.brands.forEach( function(brand, ind) {
		if(brand.drivers) {
			brand.drivers.forEach( function(driver, i) {
				driver.info.forEach( function(data, index) {
					threhsoldValue = getThresholdValueByVarType(data.Variable_Type);
					if( threhsoldValue ) {
						//getPointsAboveThresholdValue(data, threhsoldValue);
						drawGaugeChart(data, getPointsAboveThresholdValue(data, threhsoldValue), data.data.length );
					}					
				});
			});
		}
	});
}

/////////////////// INIT
$( document ).ready(function() {

	console.log("edaId " + edaId);
	console.log("projectId " + projectId);

	$.get( "viz/Compare/Compare.php", { edaId: edaId, projectId: projectId }, compareDataLoaded, "json" ).fail( function(err) {
		console.log("Compare DIAGNOSTICS Charts ERROR!");
		console.log(err);
	});

});

//////////////Diagnostics Chart Functions//////////////////////////////////////////////////////////
function showDiagnosticsChart(varName) {

	var numBins = 10
	var chartData = {DRIVER:[]};
	chartData.DRIVER = allData.DRIVER.filter( function(kpi) { return kpi.VarName == varName; });
	chartData.time = allData.time;

	var max = Math.max.apply(null, chartData.DRIVER[0].data);
	var min = Math.min.apply(null, chartData.DRIVER[0].data);
	var binSize = (max - min) / numBins;
	console.log("BIN SIZE " + binSize);
	chartData.DRIVER[0].bins = [];
	chartData.DRIVER[0].binsTxt = [];
	chartData.DRIVER[0].binsData = [];
	
	chartData.DRIVER[0].bins.push(min);
	chartData.DRIVER[0].binsTxt.push(min.toString());
	chartData.DRIVER[0].binsData.push( chartData.DRIVER[0].data.filter( function(el) {return el == min;} ).length );
	var low;
	var hight;
	for (var j = 1; j <= numBins-1; j++) {
		// Rest all bin labels = last bin + binSize
		//chartData.DRIVER[0].bins.push( chartData.DRIVER[0].bins[ j - 1 ] + binSize );
		// Rest all bin labels = RoundUpToNearest50( last bin + binSize )
		chartData.DRIVER[0].bins[j] = Math.ceil( (chartData.DRIVER[0].bins[j-1] + binSize) / 50) * 50; 
		// Current bin range
		low = chartData.DRIVER[0].bins[ j-1 ];
		high = chartData.DRIVER[0].bins[ j ];
		console.log(low);
		console.log(high);
		// Make bins text user friendly
		chartData.DRIVER[0].binsTxt.push( '('+Math.round(low)+'-'+Math.round(high)+']' );
		// Count frequencies side by side
		chartData.DRIVER[0].binsData.push( chartData.DRIVER[0].data.filter( function(val) {return val > low && val <= high;} ).length );
	}
	// Last bucket = More+
	chartData.DRIVER[0].bins[j] = "More";
	chartData.DRIVER[0].binsTxt[j] = "More";
	chartData.DRIVER[0].data[j] = chartData.DRIVER[0].data.filter( function(val) {return val > high;} ).length ;
	
	diagnosticsDrawChart(chartData.DRIVER[0], chartData.time);
	console.log(chartData.DRIVER);
	$('#diagnosticsChartPopup').bPopup({
		speed: 100
	});
}

function diagnosticsDrawChart(data, time) {

    $( '#diagnosticsChart' ).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: data.VarName,
			align: 'left',
			x: 60
        },
        xAxis: {
            categories: data.binsTxt,
			labels: { rotation: -45, maxStaggerLines: 0 }
        },
        yAxis: {
            //min: 0,
            title: {
                text: 'Freq'
            }
        },		
		legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
			enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: data.VarName,
            data: data.binsData,
			color: data.color

        }],
		credits: false
    });

}