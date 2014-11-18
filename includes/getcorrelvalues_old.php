<?php
	include_once 'db_connect.php';
	include_once 'functions.php';
	include_once 'correl.php';
	
	sec_session_start();

	$brand = $_GET['brand'];
	$variable_type = $_GET['variable_type'];
	$EDAid= $_SESSION['edaId'];
	
	//Get the values
	$q_KPIVariables="SELECT eda.tablename,map.brand,map.`column name`,map.variable,map.variable_type,map.ownership FROM eda_column_mapping map, eda_dataset eda WHERE map.edaid=eda.id AND edaid = $EDAid and map.brand = '$brand' and variable='KPI' ORDER BY ownership DESC,variable DESC";				
	$KPIresult = $mysqli->query($q_KPIVariables);
	
	foreach ( $KPIresult as $row) 
	{
		if(stripslashes($row['variable'])=='KPI') :
		{
			$KPI[]['KPIName'] = stripslashes($row['column name']);
			$KPI[ count($KPI) - 1 ]['VarType'] = stripslashes($row['variable_type']);
			//$variable_type_temp[] = stripslashes($row['variable_type']);
		}
		endif;
		
		$tablename = stripslashes($row['tablename']);
	}
	
	if($variable_type == 'All') : 
	{
		$q_DriverVariables="SELECT eda.tablename,map.brand,map.`column name`,map.variable,map.variable_type,map.ownership FROM eda_column_mapping map, eda_dataset eda WHERE map.edaid=eda.id AND edaid = $EDAid and variable='Driver' ORDER BY ownership DESC,Brand,variable_type DESC";				
	}
	else :
	{
		$q_DriverVariables="SELECT eda.tablename,map.brand,map.`column name`,map.variable,map.variable_type,map.ownership FROM eda_column_mapping map, eda_dataset eda WHERE map.edaid=eda.id AND edaid = $EDAid and variable='Driver' and variable_type='$variable_type'ORDER BY ownership DESC,Brand,variable_type DESC";				
	}
	endif;
	
	$Driverresult = $mysqli->query($q_DriverVariables);
	
	foreach ( $Driverresult as $row) 
	{
		if(stripslashes($row['variable'])=='Driver') :
		{
			$Driver[] = stripslashes($row['column name']);
			$variable_type_temp[] = stripslashes($row['variable_type']);
		}
		endif;
	}
	
	if (empty($variable_type_temp)) :
	{
		echo 'The Mapping for the Columns are not yet done. Please inform the admin.';
		return;
	}
	endif;
	
	//Get the data for the above table
	$q_getValues="select * from `$tablename`";
	$correl_values = $mysqli -> query($q_getValues);
	
	
	// foreach ( $result as $row) 
	// {
		// if((stripslashes(($row['variable'])=='KPI')) && (stripslashes(($row['brand'])==$brand_value))) :
		// {
			// $KPI[] = stripslashes($row['column name']);
		// }
		// endif;
	// }
	$BuiltTable =	'<div class="row uniform half">';
	$BuiltTable .= '<div class="6u" style="width:100%; overflow: auto; min-height:150px; max-height:500px;">';
	//$BuiltTable .= '<div style="">';
	$BuiltTable .= '<table class="alt" >';
	$BuiltTable .= '<thead><tr>';
	$BuiltTable .= '<th></th>';	
	
	$temp="";
	$count=0;
	$lastelement=count($variable_type_temp);
	$previousvalue="";
		
	foreach($variable_type_temp as $variable)
	{
		
		if ($previousvalue=="") :
		{
			//$temp = $variable;
			$previousvalue=$variable;
			$count = $count +1;
		}
		elseif($variable==$previousvalue) :
		{
			$count=$count+1;
			if($lastelement == 1) :
			{	 
				$BuiltTable .= '<th colspan= "'. $count .'" style="text-align:center">'.  $variable  .'</th>';
			}
			endif;
		}
		
		else :
		{
			//echo $previousvalue. $count; 
			$BuiltTable .= '<th colspan= "'. $count .'" style="text-align:center">'.  $previousvalue  .'</th>';
			$previousvalue=$variable; 
			if($lastelement == 1) :
			{
				$BuiltTable .= '<th colspan= "'. $count .'" style="text-align:center">'. $variable  .'</th>';
			}
			endif;
			$count=1;	
		}
		endif;
		$lastelement = $lastelement - 1;
		//echo $variable."<br>";
	}
	
	$BuiltTable .= '</tr>';
	$BuiltTable .= '<tr>';
	$BuiltTable .= '<th align="middle"  >KPI <br>vs <br>Driver Correlation</th>';
	
	foreach ($Driver as $driver_value)
	{
		 $BuiltTable .= '<th>' . $driver_value .' </th>';
		 
	} 
	$BuiltTable .= '</tr></thead>';
	
	
	foreach ($KPI as $kpi_value)
	{
		$BuiltTable .= '<tr><th> '. $kpi_value['VarType'] .' </th>';
		foreach ($Driver as $driver_value)
		{
			foreach ( $correl_values as $row) 
			{
				$array1[] = stripslashes($row[$kpi_value['KPIName']]);
				$array2[] = stripslashes($row[$driver_value]);
			}
		
			$correlation=0;
			$correlation = round(Correlation($array1, $array2),2);
			unset($array1);
			unset($array2);
			$BuiltTable .= '<td style="background-color:'.Correlation_color($correlation).'; vertical-align: middle; text-align: center;">';
			
			$BuiltTable .=  '<a style="color: #646464;" href="#" onclick="displayGraphs(\''. $kpi_value['KPIName'].'\',\''. $driver_value.'\'); return false;">';
			$BuiltTable .= $correlation;
			$BuiltTable .= '</a>';
			//print Correlation_color($correlation);
			
			$BuiltTable .= '</td>';
		}
		$BuiltTable .= '</tr>';
	}
	$BuiltTable .= '</table>';
	$BuiltTable .= '</div>';
	$BuiltTable .= '</div>';
	$BuiltTable .= '<hr>';
	
	echo $BuiltTable;

	
?>