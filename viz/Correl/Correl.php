<?php
include_once '../../includes/db_connect.php';
include_once '../getColorByVarName.php';

/*
* 
*/
function getData($projectId, $edaId, $kpi, $driver)
{
	if(!$edaId) return;
	global $mysqli;
	
	$q = "SELECT * FROM eda_dataset WHERE id = $edaId";
	$result = $mysqli->query($q);
	
	foreach ($result as $row) {
		$tableName = $row['tablename'];
	}
	
	// just to get 1st column dim
	$firstColName = '';
	$q = "SELECT column_name,table_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = (SELECT tablename FROM eda_dataset WHERE id =$edaId) AND ordinal_position = 1";
	$res = $mysqli->query($q);
	foreach ($res as $var) {
		$firstColName = $var['column_name'];
	};

	// Get required data
	$q = "SELECT `$firstColName` as 'date', `$kpi`, `$driver` FROM " .  DATABASE . ".`" . $tableName . "`";
	$res = $mysqli->query($q);
	$data = [];
	foreach ($res as $var) {
		$data['driver']['data'][] = floatval($var[$driver]);
		$data['kpi']['data'][] = floatval($var[$kpi]);
		$data['time']['data'][] = preg_replace('/[\x00-\x1F\x7F]/', '', $var['date']);
	}
	$data['time']['name'] = $firstColName;
	$data['kpi']['name'] = $kpi;
	$data['driver']['name'] = $driver;
	
	$data['time']['color'] = getColorByVarName($firstColName, $projectId);
	$data['kpi']['color'] = getColorByVarName($kpi, $projectId);
	$data['driver']['color'] = getColorByVarName($driver, $projectId);
	
	$data = calcMeanDiff($data);
	
	//var_dump($data);

	return $data;
}

/*
 * Convert table data to Mean Diff chart data
 */
function calcMeanDiff( $data )
{
	$depAv = array_sum( $data['kpi']['data'] )/count( $data['kpi']['data'] );
	//$data['kpi']['average'] = $depAv;
	//$data['kpi']['count'] = count( $data['kpi']['data'] );
	//$data['kpi']['sum'] = array_sum( $data['kpi']['data'] );
	
	// Subtract mean from dependent
	for($i = 0; $i < count( $data['kpi']['data'] ); $i++) {
		$data['kpi']['meanDiffData'][$i] = $data['kpi']['data'][$i] - $depAv;
	}
	
	$indepAv = array_sum( $data['driver']['data'] )/count( $data['driver']['data'] );
	//$data['driver']['average'] = $indepAv;
	//$data['driver']['count'] = count( $data['driver']['data'] );
	//$data['driver']['sum'] = array_sum( $data['driver']['data'] );

	for($j = 0; $j < count( $data['driver']['data'] ); $j++) {
		$data['driver']['meanDiffData'][$j] = $data['driver']['data'][$j] - $indepAv;
	}

	return $data;
}

echo JSON_encode( getData($_GET['projectId'], $_GET['edaId'], $_GET['kpi'], $_GET['driver']) );

?>