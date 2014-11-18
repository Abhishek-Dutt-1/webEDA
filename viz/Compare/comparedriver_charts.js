// Create Compare Tables and Charts
var allData = {};
var tableData = {};
var selectionData = {};
var addNewBrandToIndex;
var MAX_TABLE_COLUMNS = 3;
var CHART_WIDTH = 180;
var CHART_HEIGHT = 90;
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
	updateSelectionTable();
	document.getElementById("loadingSpinner").innerHTML="";
}

// Create the actual chart
function drawSparkLineChart(data) {

	$( '#'+ data.VarNameId).highcharts({
        chart: {
			//type: 'SparkLine',
            zoomType: 'x',
			backgroundColor: null,
			borderWidth: 0,
			//type: 'area',
			//margin: [2, 0, 2, 0],
			//width: CHART_WIDTH,
			height: CHART_HEIGHT,
			style: {
				overflow: 'visible'
			},
			//skipClone: true
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
				//title: {
					//text: data.VarName,
				//}
        },
         tooltip: {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                hideDelay: 0,
                shared: true,
                padding: 0,
                positioner: function (w, h, point) {
                    return { x: point.plotX - w / 2, y: point.plotY - h};
                }
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
            type: 'column',
            data: data.data,
			color: data.color,
			zIndex: 1
        }],
		credits: false
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
		if(brand.drivers) {
			brand.drivers.forEach( function(driver, i) {
				driver.info.forEach( function(data, index) {
					drawSparkLineChart(data);
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
		console.log("Compare DRIVER Charts ERROR!");
		console.log(err);
	});

});
/////////////Show Popup Driver Chart/////////////////////////////////////////

function showDriverChart(varName) {
	//console.log(varName);
	//console.log(allData);
	var chartData = allData.DRIVER.filter( function(kpi) { return kpi.VarName == varName; });
	chartData.time = allData.time;
	//console.log(chartData);
	updateDriverChart(chartData[0], chartData.time);

	$('#driverChartPopup').bPopup({
		speed: 100
	});
	
}

// Create the actual chart
function updateDriverChart(data, time) {

	$( '#driverChart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: data.VarName,
			align: 'left',
            x: 70,			
        },
        xAxis: {
            categories: time.data,
			labels: { rotation: -45, maxStaggerLines: 0, step: 1 }
        },
        yAxis: {
			title: {
				//text: ''
                text: data.VarName
            },
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: data.VarName,
            data: data.data,
			color: data.color
			}],
		credits: false
    });
}