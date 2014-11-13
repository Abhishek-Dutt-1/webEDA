<?php

include_once '../../includes/db_connect.php';
include_once '../getColorByVarName.php';
/*
*
*/
function getData($edaId, $projectId)
{
	if(!$edaId) return;
	global $mysqli;
	
	$q = "SELECT * FROM eda_dataset WHERE id = $edaId";
	$result = $mysqli->query($q);
	foreach ( $result as $row)
	{
		$tableName = $row['tablename'];
	}

	// just to get 1st column
	$firstColName = '';
	$q = "SELECT column_name,table_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = (SELECT tablename FROM eda_dataset WHERE id =$edaId) AND ordinal_position = 1";
	$res = $mysqli->query($q);
	foreach ($res as $var) {
		$firstColName = $var['column_name'];
	};
	
	// Get only KPI variables
	$varNames = '';
	$q = "SELECT * FROM eda_column_mapping WHERE Variable = 'KPI' AND edaId = '$edaId' ORDER BY `Brand`, `Ownership` DESC";
	//echo $q . "<br>";
	$res = $mysqli->query($q);
	while( $row = mysqli_fetch_assoc($res) )
	{
		$varNames .= ", `" . $row['Column Name'] . "`";
		//var_dump($row);
	}
	//echo $varNames;
	
	//exit;
	$q = "SELECT $firstColName $varNames  FROM " .  DATABASE . ".`" . $tableName . "`";
	//echo $q . "<br>";
	$res = $mysqli->query($q);
	$names = getVariableNames($res, $edaId, $projectId);
	$brands = getAllBrands($names);
	//var_dump($names);
	
	// Save table name == Dataset name
	$data['info']['name'] = $tableName;
	// Save variable names
	$data['time']['name'] = $names['time']['VarName'];
	$data['time']['data'] = [];
	$data['time']['color'] = getColorByVarName($names['time']['VarName'], $projectId);
	
	for( $i = 0; $i < count($names['KPI']); $i++ )
	{
		$data['KPI'][] = $names['KPI'][$i];
		$data['KPI'][ count( $data['KPI'] ) - 1 ]['color'] = getColorByVarName($names['KPI'][$i]['VarName'], $projectId);;
		$data['KPI'][ count( $data['KPI'] ) - 1 ]['data'] = [];
	}
	//var_dump($data);
	
	// Save variables data
	while( $row = mysqli_fetch_assoc($res) )
	{
		$data['time']['data'][] = preg_replace('/[\x00-\x1F\x7F]/', '', $row[ $names['time']['VarName'] ]);
		for( $i=0; $i < count($names['KPI']); $i++ )
		{
			$data['KPI'][$i]['data'][] = floatval( $row[ $names['KPI'][$i]['VarName'] ] );
		}
	}
	//var_dump($data['KPI']);
	//exit;
	return $data;
	//return json_encode($data);
}

/* 
 * Simply returns column names w/o any fancy rearrangement
 */
function getVariableNames($res, $edaId, $projectId)
{
	$variables = [];
	$tmp = $res->fetch_fields();
	$variables['time']['VarName'] = array_shift($tmp)->name;		// First field is always Time
	$variables['KPI'] = [];
	$variables['DRIVER'] = [];
	$variables['OTHERS'] = [];
	foreach ($tmp as $var) {
		$typeTmp = getVariableTypeData($var->name, $edaId, $projectId);
		if (strtoupper($typeTmp['Variable']) == 'KPI') {
			$variables['KPI'][] = $typeTmp;
		}
		if (strtoupper($typeTmp['Variable']) == 'DRIVER') {
			$variables['DRIVER'][] = $typeTmp;
		}
		// There can be others, mistypes etc. 
		if (!((strtoupper($typeTmp['Variable']) == 'KPI')||(strtoupper($typeTmp['Variable']) == 'DRIVER'))) {
			$variables['OTHERS'][] = $typeTmp;
		}
	}
	return $variables;
}

/*
 * Returns variable types info by name
 */
function getVariableTypeData($name, $edaId, $projectId) {
	$q = "SELECT `Column Name` as VarName, Brand, Ownership, Variable, `Variable_Type` FROM `eda_column_mapping` WHERE `Column Name` = '$name' AND projectid = '$projectId' AND edaid = '$edaId'";
	global $mysqli;
	$typeData = $mysqli->query($q);
	return mysqli_fetch_assoc($typeData);
}

/*
 * Get all unique brands
*/
function getAllBrands($names) {
	$brands = [];
	foreach ($names['KPI'] as $key => $val) {
		$brands[] = $val['Brand'];
	}
	return array_unique($brands);
}

/*
 * Convert original data from table into Trend chart compatible data
 * numControlLimits = max number of UCL and LCL to calculate
 * Frontend however is fixed at 3
 */
function calcTrendChart( $data, $numControlLimits = 3)
{
	
	for($i=0; $i < count($data['KPI']); $i++) {
	
		$countElements = count( $data['KPI'][$i]['data'] );
		$depAv = array_sum( $data['KPI'][$i]['data'] )/ $countElements;
		$stdDev = stats_standard_deviation($data['KPI'][$i]['data'], true);
		
		$data['KPI'][$i]['Average'] = array_fill(0, $countElements, $depAv);
		$data['KPI'][$i]['StdDev'] = $stdDev;
		$data['KPI'][$i]['av'] = $depAv;
		$data['KPI'][$i]['numCL'] = $numControlLimits;
		
		for($j = 1; $j <= $numControlLimits; $j++) {
			$data['KPI'][$i]['UCL'.$j] = array_fill(0, $countElements, $depAv + ($stdDev*$j) );
			$data['KPI'][$i]['LCL'.$j] = array_fill(0, $countElements, $depAv - ($stdDev*$j) );
		}
	}
	
	return $data;
}

//////// Calc std dev
if (!function_exists('stats_standard_deviation')) {
    /**
     * This user-land implementation follows the implementation quite strictly;
     * it does not attempt to improve the code or algorithm in any way. It will
     * raise a warning if you have fewer than 2 values in your array, just like
     * the extension does (although as an E_USER_WARNING, not E_WARNING).
     * 
     * @param array $a 
     * @param bool $sample [optional] Defaults to false
     * @return float|bool The standard deviation or false on error.
     */
    function stats_standard_deviation(array $a, $sample = false) {
        $n = count($a);
        if ($n === 0) {
            trigger_error("The array has zero elements", E_USER_WARNING);
            return false;
        }
        if ($sample && $n === 1) {
            trigger_error("The array has only 1 element", E_USER_WARNING);
            return false;
        }
        $mean = array_sum($a) / $n;
        $carry = 0.0;
        foreach ($a as $val) {
            $d = ((double) $val) - $mean;
            $carry += $d * $d;
        };
        if ($sample) {
           --$n;
        }
        return sqrt($carry / $n);
    }
}
/////////////////////////////////////////

// Throw it out
echo JSON_encode( calcTrendChart( getData($_GET['edaId'], $_GET['projectId']) ) );
//echo JSON_encode(  getData($_GET['edaId'], $_GET['projectId']) );

?>