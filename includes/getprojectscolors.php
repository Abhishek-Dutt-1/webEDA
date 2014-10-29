<?php
include_once 'db_connect.php';
include_once 'functions.php';

$q = intval($_GET['q']);

$q_GetColors="SELECT map.name,map.color FROM  `set_color_eda_model` map where map.projectid = $q";				
$result = $mysqli->query($q_GetColors);
if ($result->num_rows==0)
{
  return;
}
 $projectscolor ='<h3>Below is the list of mapped brand color</h3>';
				// <form action="test.php">
				// <table border="1">';
				// // <div class="table-wrapper"><tr></tr>';

// foreach ( $result as $row) {
	// //$projectscolor .= '<div class="6u">';
	// $projectscolor .= '<tr>';	
	// $projectscolor .= 	'<td><input type="checkbox" id="brandname" name="' . $row['name'] . '" checked>
						// <label for="' . $row['name'] . '">' . $row['name'] . '</label> </td>';
	// //$projectscolor .= '<td><input type="checkbox" name="brandname" value="' . $row['name'] . '">' . $row['name'] . '</td>';
	// $projectscolor .= '<td> <input type="color" name="color" id="color" value="' . $row['color'] . '" />';
	// $projectscolor .= '</tr>';
	// $projectscolor .= '</div>';
	
// }
// $projectscolor .= '</div></table>';
// $projectscolor .= '</form>';


//$projectscolor .= '<form name="myform" action="includes/test.php" method="POST">';
$projectscolor .= '<div class="row uniform half">';
$projectscolor .= '<table>';
foreach ( $result as $row) {
	$projectscolor .= 	'<tr><div class="6u">';
	$projectscolor .= 	'	<td><input type="checkbox" id="' . $row['name'] . '" name="' . $row['name'] . '">';
	$projectscolor .= 	'	<label for="' . $row['name'] . '">' . $row['name'] . '</label></td>';
	$projectscolor .= 	'	<td><input type="color" name="' . $row['name'] . ' "color" id="color" value="' . $row['color'] . '" /></td>';
	
	$projectscolor .= 	'</div><tr>';
}
// $projectscolor .= 	'<div class="6u">';
// $projectscolor .= 	'	<input type="checkbox" id="human" name="human" checked>';
// $projectscolor .= 	'	<label for="human">I am a human and not a robot</label>';
// $projectscolor .= 	'</div>';
$projectscolor .= '<table>';
$projectscolor .= '</div>';

$projectscolor .= '<div class="row uniform">';
$projectscolor .= '<div class="12u">';
$projectscolor .= '		<ul class="actions">';
$projectscolor .= '			<li><input type="submit" value="Update" name = "Action"/></li>';
$projectscolor .= '			<li><input type="reset" value="Reset" class="alt" /></li>';
$projectscolor .= '		</ul>';
$projectscolor .= '</div>';
$projectscolor .= '</div>';
//$projectscolor .= '</form>';

echo $projectscolor;


?>