var allData = {};
// Create EDA Charts
function edaDataLoaded(data) {

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
	document.getElementById('edaChartSelect').innerHTML = tmpStr;
	
	
	// If available select Airtel CTB by default else select the first option
	var defaultSelection = 'Airtel CTB';
	if(allData.KPI.some( function(el) { return el.VarName == defaultSelection; } )) {
		document.getElementById('edaChartSelect').value = 'Airtel CTB';
	}
	document.getElementById("edaChartSelect").onchange()
	$("#loadingSpinner").hide();
}

// UI Selection change, recreate all charts
function recreateEDACharts(varName) {

	$("#loadingSpinner").show();
	$('#edaChartContainer').empty();
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

	document.getElementById('edaChartContainer').appendChild(outerChartDiv);
	
	// Create individual charts
	var dep = allData.KPI.filter( function(el) { return el.VarName == varName; } );
	//console.log(dep);
	allData.DRIVER.forEach( function(indep) {	
		drawEDAChart(allData.time, dep[0], indep);
	});
	$("#loadingSpinner").hide();
}

// Create individual EDA Charts
function drawEDAChart(time, dep, indep) {

	$( '#'+indep.VarName.replace( /[^\w\d]/g, "_") ).highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: dep.Variable_Type + " vs. " + indep.VarName,
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

}

/////////////////// INIT
$( document ).ready(function() {

	console.log("edaId " + edaId);
	console.log("projectId " + projectId);
/*
	$.get( "viz/TrendEda/EDA.php", { edaId: edaId, projectId: projectId }, edaDataLoaded, "json" ).fail( function(err) {
		console.log("EDA Charts ERROR!");
		console.log(err);
	});
*/
	$.get( "viz/Compare/Compare.php", { edaId: edaId, projectId: projectId }, edaDataLoaded, "json" ).fail( function(err) {
		console.log("EDA Charts ERROR!");
		console.log(err);
	});

});