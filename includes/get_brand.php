<?php
include_once 'db_connect.php';
include_once 'functions.php';

$q = intval($_GET['q']);


$q_GetBrandName="SELECT DISTINCT column_name FROM information_schema.columns WHERE table_name IN (SELECT tablename FROM eda_dataset WHERE projects_id = $q) AND column_name NOT IN (SELECT NAME FROM `set_color_eda_model` WHERE projectid = $q)";				
$brandresult = $mysqli->query($q_GetBrandName);
if ($brandresult->num_rows==0)
{
  return;
}
$selectbox = '<div class="select-wrapper">';
$selectbox.='<select id = "name" name="name">';
$selectbox.= '<option value="">- Brand Name -</option>';
foreach ( $brandresult as $row) {
 $selectbox.='<option value="' . $row['column_name'] . '">' . $row['column_name'] . '</option>';
}
 $selectbox.='</select>';
 $selectbox.='</div>';
 //$selectbox.='';
 
 echo $selectbox;

?>