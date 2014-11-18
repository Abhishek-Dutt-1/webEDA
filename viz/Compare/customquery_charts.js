var allData = {};
var trackSelection = {kpi: [], driver: []};
//////
function compareDataLoaded(data) {
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
		});
	});
	
	
	console.log(allData);
	// Add time to allData
	allData.time = data.time;
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Fill up KPI select box
	/*
	var tmpStr = "";
	allData.brands.forEach( function (brand) {
		//tmpStr += '<optgroup class="optGroupBrand" label="'+brand.brand+' :">';
		brand.KPI.forEach( function(kpi) {
			tmpStr += '<optgroup class="optGroupVarType" label="' + brand.brand + ' - ' +kpi.Variable_Type + ' :">';		
			kpi.Variable.forEach( function(varName) {
				tmpStr += '<option class="optGroupVariable" >'+ varName.VarName +'</option>';
			});
		});
		tmpStr += '</optgroup>';
		//tmpStr += '</optgroup>';
	});
	//document.getElementById('kpiSelectInput').innerHTML = tmpStr;
	// Fill up DRIVER select box
	var tmpStr = "";
	allData.brands.forEach( function (brand) {
		//tmpStr += '<optgroup class="optGroupBrand" label="'+brand.brand+' :">';
		brand.DRIVER.forEach( function(driver) {
			tmpStr += '<optgroup class="optGroupVarType" label="' + brand.brand + ' - ' + driver.Variable_Type + ' :">';		
			driver.Variable.forEach( function(varName) {
				tmpStr += '<option class="optGroupVariable" >'+ varName.VarName +'</option>';
			});
		});
		tmpStr += '</optgroup>';
		//tmpStr += '</optgroup>';
	});
	*/
	//document.getElementById('driverSelectInput').innerHTML = tmpStr;
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Fill up KPI select box POPUP
	/*
	var tmpStr = "";
	allData.brands.forEach( function (brand) {
		tmpStr += '<h3 class="optGroupBrandPopup" label="'+brand.brand+' :">' + brand.brand +'</h3>';
		brand.KPI.forEach( function(kpi) {
			//tmpStr += '<div class="optGroupVarTypePopup" label="' + brand.brand + ' - ' +kpi.Variable_Type + ' :">' + brand.brand + " - " + kpi.Variable_Type;		
			kpi.Variable.forEach( function(varName) {
				tmpStr += '<input type="checkbox" id="'+ varName.VarName +'"><label for="'+ varName.VarName +'" class="optGroupVariablePopup" >'+ varName.VarName +'</label>';
			});
			//tmpStr += '</div>';
		});
		//tmpStr += '</div>';
	});
	document.getElementById('kpiSelectContainer').innerHTML = tmpStr;
	// Fill up DRIVER select box
	var tmpStr = "";
	allData.brands.forEach( function (brand) {
		tmpStr += '<h3 class="optGroupBrandPopup" label="'+brand.brand+' :">' + brand.brand + '</h3>';
		brand.DRIVER.forEach( function(driver) {
			//tmpStr += '<optgroup class="optGroupVarTypePopup" label="' + brand.brand + ' - ' + driver.Variable_Type + ' :">';		
			driver.Variable.forEach( function(varName) {
				tmpStr += '<input type="checkbox" id="'+ varName.VarName +'"><label for="'+ varName.VarName +'" class="optGroupVariablePopup" >'+ varName.VarName +'</label>';
			});
			//tmpStr += '</optgroup>';			
		});
		//tmpStr += '</optgroup>';
	});
	document.getElementById('driverSelectContainer').innerHTML = tmpStr;
	*/
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Fill up KPI select box slideToggle
	var slideToggleKPI = [];
	var variables = [];
	var tmpKpi = [];
	var tmpStr = "";
	var tmpStr1 = "";
	allData.brands.forEach( function (brand) {
		tmpKpi = [];
		tmpStr1 += '<div class=""><a class="button alt fit kpiSelectBrands small" data-target-id="'+brand.brand+'_KPI" onclick="showKPIPanel(this); return false;">' + brand.brand + '</a></div>';
		tmpStr += '<div class="optGroupBrandPopup" style="clear: both;" id="'+brand.brand+'_KPI" label="'+brand.brand+'">';
		brand.KPI.forEach( function(kpi) {
			//tmpStr += '<div class="optGroupVarTypePopup" label="' + brand.brand + ' - ' + kpi.Variable_Type + ' :">' + brand.brand + " - " + kpi.Variable_Type;
			variables = [];
			kpi.Variable.forEach( function(varName) {
				tmpStr += '<div style="width: 33%; float: left; font-size: 14px; overflow: hidden; height: 40px;"><input type="checkbox" class="userInputCheckbox" id="'+ varName.VarName +'" onclick="trackSelectedKPI(\'kpi\', \''+kpi.Variable_Type+'\', \''+varName.VarName+'\');"><label for="'+ varName.VarName +'" class="optGroupVariablePopup" >'+ kpi.Variable_Type +'</label></div>';
				variables.push( varName );
			});
			tmpKpi.push({Variable_Type: kpi.Variable_Type, varNames: variables});
		});
		tmpStr += '</div>';
		slideToggleKPI.push({brand: brand.brand, kpis: tmpKpi});
	});
	console.log(slideToggleKPI);
	document.getElementById('slideToggleKPIPanel1').innerHTML = tmpStr1;
	document.getElementById('slideToggleKPIPanel2').innerHTML = tmpStr;

	// Fill up DRIVER select box
	var slideToggleDriver = [];
	var variables = [];
	var tmpDriver = [];
	var tmpVarType = [];
	var tmpStr = "";
	var tmpStr1 = "";
	var tmpStr2 = "";
	allData.brands.forEach( function (brand) {
		tmpDriver = [];
		tmpStr1 += '<div class=""><a class="button alt fit driverSelectBrands small" data-target-id="'+brand.brand+'_VAR_TYPE" onclick="showDriverPanel(this); return false;">' + brand.brand + '</a></div>';
		
		tmpStr2 += '<div style="clear: both;" id="'+brand.brand+'_VAR_TYPE">';		
			
		brand.DRIVER.forEach( function(driver) {
			
			tmpStr2 += '<div><a class="button alt fit small driverSelectVarTypes" data-button-id="'+brand.brand+'_BUTTON_VAR_TYPE" data-target-id="'+brand.brand+'_'+driver.Variable_Type+'_DRIVER" onclick="showDriverVarTypePanel(this); return false;">' + driver.Variable_Type + '</a></div>';

			variables = [];
			tmpStr += '<div class="driverSelectBrandVarTypeVarNameDiv" style="clear: both;" id="'+brand.brand+'_'+driver.Variable_Type+'_DRIVER" label="'+brand.brand+'">';	
			
			driver.Variable.forEach( function(varName) {
				tmpStr += '<div style="width: 50%; float: left; font-size: 14px; overflow: hidden1; height: 40px;"><input type="checkbox" class="userInputCheckbox" id="'+ varName.VarName +'" onclick="trackSelectedKPI(\'driver\', \''+varName.VarName+'\');"><label for="'+ varName.VarName +'" class="optGroupVariablePopup" >'+ varName.VarName +'</label></div>';
				variables.push( varName );
			});
			
			tmpDriver.push({Variable_Type: driver.Variable_Type, varNames: variables});
			
			tmpStr += '</div>';
		});
		
		tmpStr2 += '</div>';
		
		
		slideToggleDriver.push({brand: brand.brand, drivers: tmpDriver});
	});
	console.log(slideToggleDriver);
	document.getElementById('slideToggleDriverPanel1').innerHTML = tmpStr1;
	
	document.getElementById('slideToggleDriverPanel2').innerHTML = tmpStr2;
	document.getElementById('slideToggleDriverPanel3').innerHTML = tmpStr;
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$( "#queryDriverSelectionPanel" ).hide( "fast", function() {});
	//$( "#queryKPISelectionPanel" ).hide( "fast", function() {});
	showKPIPanel(document.getElementsByClassName('kpiSelectBrands')[0]);
	showDriverPanel(document.getElementsByClassName('driverSelectBrands')[0]);
	showDriverVarTypePanel(document.getElementsByClassName('driverSelectVarTypes')[0])
}

// Update button pressed
function updateChart() {

$( "#queryDriverSelectionPanel" ).hide( "fast", function() {});
$( "#queryKPISelectionPanel" ).hide( "fast", function() {});

	var selectedKpi = [];
	var selectedDriver = [];
	//selectedKpi = getSelectedOptions('kpiSelectInput');
	//selectedDriver = getSelectedOptions('driverSelectInput');
	//selectedKpi = getSelectedOptionsPopup('kpiSelectContainer');
	//selectedDriver = getSelectedOptionsPopup('driverSelectContainer');
	selectedKpi = getSelectedOptionsPopup('queryKPISelectionPanel');
	selectedDriver = getSelectedOptionsPopup('queryDriverSelectionPanel');	
	console.log( selectedKpi );
	var time = allData.time;
	$('#chartsOuterDiv').empty();
	allData.brands.forEach( function(brand) {
		brand.KPI.forEach( function(kpi) {
			kpi.Variable.forEach( function(Variable) {
				
				if ( selectedKpi.some( function(el) { return el == Variable.VarName; }) ) {
					// Found KPI
					//console.log( Variable);
					
					// Find Driver
					allData.brands.forEach( function(dBrand) {
						dBrand.DRIVER.forEach( function(driver) {
							driver.Variable.forEach( function(dVariable) {
								
								if ( selectedDriver.some( function(el) { return el == dVariable.VarName; }) ) {
									//Found Driver
									//console.log(dVariable);
									//Now Create Chart (Variable, dVariable)
									var tmpDiv = document.createElement('h3');
									tmpDiv.className = "queryChartHeader"
									tmpDiv.innerHTML = Variable.Brand + " &raquo; " + Variable.Variable_Type;
									document.getElementById('chartsOuterDiv').appendChild( tmpDiv );
									
									addCharts(Variable, dVariable, time);
								}
								
							});
						});
					});
					
				}		
			
			});
		});
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

/** Helper Funtions **/
function getAllUniqueBrands(data) {	
	
	var brands = [];
	data.KPI.forEach( function(el) {
		brands.push( el.Brand );
	});
	data.DRIVER.forEach( function(el) {
		brands.push( el.Brand );
	});
	data.OTHERS.forEach( function(el) {
		brands.push( el.Brand );
	});
	// Remove duplicates
	brands = brands.filter(function (v, i, a) { return a.indexOf(v) == i });
	return brands;
}

function getAllUniqueKPIs(data) {	
	
	var brands = [];
	data.KPI.forEach( function(el) {
		brands.push( el.Variable_Type );
	});
	data.DRIVER.forEach( function(el) {
		brands.push( el.Variable_Type );
	});
	data.OTHERS.forEach( function(el) {
		brands.push( el.Variable_Type );
	});
	// Remove duplicates
	brands = brands.filter(function (v, i, a) { return a.indexOf(v) == i });
	return brands;
}
// returns selected options in select multiple
/*
function getSelectedOptions(selectId) {

	var sel = document.getElementById(selectId);
    var opts = [], opt;
    // loop through options in select list
    for (var i=0, len=sel.options.length; i<len; i++) {
		opt = sel.options[i];
        // check if selected
        if ( opt.selected ) {
			opts.push(opt.value);
		}
    }
	console.log(opts);
    // return array containing references to selected option elements
    return opts;
}
*/
// returns selected options in select multiple
function getSelectedOptionsPopup(selectId) {

	var selected = [];
	// check all children 
	/*
	$('#'+ selectId +' input:checkbox.userInputCheckbox').each(function() {
		console.log("xx");
		selected.push($(this).attr('id'));
	});
	*/
  
	$('#'+ selectId +' input:checked').each(function() {
		selected.push($(this).attr('id'));
	});
	return selected;
}
// Add charts
function addCharts(kpi, driver, time) {
	
	// Create Container for two charts
	var tmpDiv = document.createElement('div');
	tmpDiv.className = 'queryChartsRow';
	// create container for left bivariate chart
	var bivariate = document.createElement('div');
	bivariate.id = kpi.VarName.replace( /[^\w\d]/g, "_") + "_" + driver.VarName.replace( /[^\w\d]/g, "_") + "_BIVARIATE";
	bivariate.className = "queryBiVariateChart";
	// create container for right meandiff chart
	var meandiff = document.createElement('div');
	meandiff.id = kpi.VarName.replace( /[^\w\d]/g, "_") + "_" + driver.VarName.replace( /[^\w\d]/g, "_") + "_MEANDIFF";
	meandiff.className = "queryMeanDiffChart";
	
	// Add biVariate chart div to 2 chart container
	tmpDiv.appendChild( bivariate );
	tmpDiv.appendChild( meandiff );
	
	//tmpDiv.innerHTML = kpi.VarName + " :: " + driver.VarName;
	// Attach the div
	document.getElementById('chartsOuterDiv').appendChild( tmpDiv );

	// Create the chart in the new created div
	addBiVariateChart(kpi, driver, time, bivariate.id);
	var tmpKpi = convertToMeanDiff( $.extend(true, {}, kpi) );
	var tmpDriver = convertToMeanDiff( $.extend(true, {}, driver) );
	addMeanDiffChart(tmpKpi, tmpDriver, time, meandiff.id);
	
}
// Crete the actual bivariate chart
function addBiVariateChart(dep, indep, time, divId) {

	$( '#'+divId ).highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: dep.VarName + " vs. " + indep.VarName,
			align: 'left',
			x: 50
        },
        xAxis: [{
            categories: time.data,
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
                text: dep.VarName,
                style: {
                    //color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: indep.VarName,
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
            name: dep.VarName,
            type: 'line',
            data: dep.data,
			color: dep.color,
			zIndex: 1
        }, {
            name: indep.VarName,
            type: 'column',
			//color:'red',
			color: indep.color,
            data: indep.data,
            yAxis: 1,
        }],
		credits: false
    });


};

// Crete the actual Mean Diff chart
function addMeanDiffChart(dep, indep, time, divId) {

	// Create the data table.
	var i = 0;
	var dataArray = [];
	for(i=0; i < time.data.length; i++) {
		//dataArray.push( [time.data[i], dep.data[i], indep.data[i]] );
		dataArray.push( [dep.data[i], indep.data[i]] );
	}

    $( '#'+ divId ).highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: dep.VarName + " vs. " + indep.VarName,
			align: 'left',
			x: 70
        },
        xAxis: {
            title: {
                enabled: true,
                text: dep.VarName
            },
            startOnTick: true,
            endOnTick: true,
			plotLines : [{
				value : 0,
				color : 'lightgrey',
				dashStyle : 'dash',
				width : 1,
			}]
        },
        yAxis: {
            title: {
                text: indep.VarName
            },
			gridLineColor: 'transparent',
			plotLines : [{
				value : 0,
				color : 'lightgrey',
				dashStyle : 'dash',
				width : 1,
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
			headerFormat: '<b>{series.VarName}</b><br>',
			enabled: false
		},
		legend: {
            enabled: false
        },
        series: [{
			name: indep.VarName,
			color: indep.color,
            data: dataArray,
			regression: true ,
			regressionSettings: {
				showInLegend: false,
				type: 'linear',
				color: indep.color
			}
        }],
		credits: false
    });

};
// Convert series to mean - diff
function convertToMeanDiff( variable ) {

	var elmt = variable.data;
	var sum = 0;
	for( var i = 0; i < elmt.length; i++ ){
		sum += parseFloat( elmt[i] );
	}
	var avg = sum/elmt.length;
	
	for( var i = 0; i < elmt.length; i++ ){
		variable.data[i] = variable.data[i] - avg;
	}
	return variable;
}

// Show KPI select popup
function showKPISelectPopup() {
	 $('#kpiSelectPopup').bPopup({
		transition: 'slideIn',
	    transitionClose: 'slideBack',
		speed: 200

	 });
}
// Show DRIVER select popup
function showDriverSelectPopup() {
	 $('#driverSelectPopup').bPopup({
		transition: 'slideIn',
	    transitionClose: 'slideBack',
		speed: 200

	 });
}
// Expand KPI select div
function toggleKPISelectExpand() {
	$( "#queryDriverSelectionPanel" ).hide( "fast", function() {
	});
	$( "#queryKPISelectionPanel" ).slideToggle( "fast", function() {
	});
}
function showKPIPanel(el) {
	var tmpBrandList = document.getElementsByClassName('kpiSelectBrands');
	// Close all except the current one
	for(var i=0; i<tmpBrandList.length; i++)
	{
		$( "#" + tmpBrandList[i].getAttribute('data-target-id') ).hide( "fast", function() {});
		$(tmpBrandList[i]).removeClass('special');
	}
	$( "#" + el.getAttribute('data-target-id') ).slideDown( "fast", function() {});
	$( el ).addClass('special');
}
// Expand DRIVER select div
function toggleDriverSelectExpand() {
	$( "#queryKPISelectionPanel" ).hide( "fast", function() {
	});
	$( "#queryDriverSelectionPanel" ).slideToggle( "fast", function() {
	});
}
function showDriverPanel(el) {
	var tmpBrandList = document.getElementsByClassName('driverSelectBrands');
	// Close all except the current one
	for(var i=0; i<tmpBrandList.length; i++)
	{
		$( "#" + tmpBrandList[i].getAttribute('data-target-id') ).hide( "fast", function() {});
		$(tmpBrandList[i]).removeClass('special');
	}
	$( "#" + el.getAttribute('data-target-id') ).slideDown( "fast", function() {});
	console.log( $( "#" + el.getAttribute('data-target-id') + " a.driverSelectVarTypes")[0] );
	showDriverVarTypePanel( $( "#" + el.getAttribute('data-target-id') + " a.driverSelectVarTypes")[0] );
	$( el ).addClass('special');
}
function showDriverVarTypePanel(el) {
	$("a.driverSelectVarTypes[data-button-id='"+ el.getAttribute('data-button-id')  +"']").each( function(idx, item) {
		$(this).removeClass('special');
	});
	$('.driverSelectBrandVarTypeVarNameDiv').each( function() { $(this).hide("fast"); });
	$( "#" + el.getAttribute('data-target-id') ).slideDown( "fast", function() {});
	$( el ).addClass('special');
}
///////// Keep track of selections
function trackSelectedKPI(kpiOrDriver, varType, varName) {

	var index = -1;
	if(kpiOrDriver == 'kpi') {
	
		index = trackSelection.kpi.indexOf(varName);
		if( index > -1 ) {
			trackSelection.kpi.splice(index, 1);
		} else {
			trackSelection.kpi.push(varName);
		}
	
	} else {
	
		index = trackSelection.driver.indexOf(varType);
		if( index > -1 ) {
			trackSelection.driver.splice(index, 1);
		} else {
			trackSelection.driver.push(varType);
		}
		
	}
	$('#trackSelection').html( 'Selected KPI : <b>'+ trackSelection.kpi.length + '</b> | ' + 'Driver : <b>' + trackSelection.driver.length + '</b>');
}