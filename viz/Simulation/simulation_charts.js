// create a top level data object
var chartData = {};
/////////////////// INIT
$( document ).ready(function() {

	//var meanDiffChartData = <?php echo json_encode( getData() ); ?>;
	console.log("edaId: " + edaId);
	console.log("modelId: " + modelId);
	
	$.get( "viz/Contrib/Contrib.php", { dataType: 'simlutionData', edaId: edaId, modelId: modelId }, simulationDataLoaded, "json" ).fail( function(err) { 
		console.log("Contrib ERROR");
		console.log(err); 
	});

	// attach event listener to updateSensitivityChart href
	$("#updateSimulationChart").on('click', createInputTable);
	
	// Attach popbox
	$('.popbox').popbox({
		'open'          : '.popboxOpen',
		'box'           : '.popboxBox',
		'arrow'         : '.popboxArrow',
		'arrow_border'  : '.popboxArrow-border',
		'close'         : '.popboxClose'
	});
	
	// Make table editable
	//$("td").dblclick(function () { 
	$("#simulationTable").on('click', 'td.editableCell', function () {
		var OriginalContent = $(this).text(); 
		$(this).addClass("cellEditing"); 
		$(this).html("<input type='text' class='tableCellEdit' value='" + OriginalContent + "' />"); 
		$(this).children().first().focus(); 
		$(this).children().first().keypress(function (e) { 
			if (e.which == 13) { 
				var newContent = $(this).val(); 
				$(this).parent().text(newContent); 
				$(this).parent().removeClass("cellEditing");
			} 
		});
		$(this).children().first().blur(function(){
			//console.log( $(this).parent().removeClass("cellEditing") );
			$(this).parent().text(OriginalContent);
			$(this).parent().removeClass("cellEditing");
		}); 
	}); 



	
});

function simulationDataLoaded(data) {
	console.log(data);
	chartData = data;
	createInputTable();
	calcDependentValues();
	//createChart();
}

// Create the table for inputs
function createInputTable() {

	var elem = document.getElementById("tableDiv");
	if(elem) elem.parentElement.removeChild(elem);
	
	var tableDiv = document.createElement('div');
	tableDiv.id = "tableDiv";
	
	// Create Table
	var table  = document.createElement('table');
	table.className = "editableTable";
    //table.style.width='400px';

	///////// Table Header
	var tHead = table.createTHead();
	var row = tHead.insertRow(0);
	// Time
	var cell = row.insertCell(0);
	cell.innerHTML = "<b>" + chartData.modelData.time.name + "</b>";
	// Dependent
	cell = row.insertCell(1);
	cell.innerHTML = "<b>" + chartData.modelData.dependent.name + "</b>";
	// Independents -- Positives
	chartData.modelData.independent.forEach( function(indep) {
		if(indep.coef >= 0) {
			cell = row.insertCell(-1);
			cell.innerHTML = "<b>" + indep.name + "</b>";
		}
	});
	// Independents -- Negatives
	chartData.modelData.independent.forEach( function(indep) {
		if(indep.coef < 0) {
			cell = row.insertCell(-1);
			cell.innerHTML = "<b>" + indep.name + "</b>";
		}
	});
	////////// End table header
	var numPeriodSimulated = document.getElementById('numPeriodSimulated').value;
	var tBody = table.createTBody();
	var tr, td;
	var keepZero = document.querySelector('input[name="keepZero"]:checked').value ;
	keepZero = ( keepZero == "true" ) ? true : false;
	console.log(keepZero);
	
	for(var i = 0; i < numPeriodSimulated; i++) {
		tr = tBody.insertRow();
		// Time
		td = tr.insertCell();
		td.appendChild(document.createTextNode( chartData.modelData.time.data[chartData.modelData.time.data.length - 1] + " + " + parseInt(i+1) ))
		// Dep
		td = tr.insertCell();
		td.appendChild( document.createTextNode( '-' ) );
		// Pos
		chartData.modelData.independent.forEach( function(indep) {
			if(indep.coef >= 0) {
				td = tr.insertCell();
				td.className = "editableCell";
				if(keepZero)
					td.appendChild( document.createTextNode(0) );
				else
					td.appendChild( document.createTextNode( indep.data[indep.data.length - numPeriodSimulated + i] ) );
			}
		});
		// Neg
		chartData.modelData.independent.forEach( function(indep) {
			if(indep.coef < 0) {
				td = tr.insertCell();
				td.className = "editableCell";
				if(keepZero)
					td.appendChild( document.createTextNode(0) );
				else
					td.appendChild( document.createTextNode( indep.data[indep.data.length - numPeriodSimulated + i] ) );
			}
		});
	}
	
	tableDiv.appendChild(table);
    document.getElementById('simulationTable').appendChild(tableDiv);
}

// Update dependent values based on the table
function calcDependentValues() {

}