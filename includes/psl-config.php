<?php
/**
 * These are the database login details
 */  
define("HOST", "localhost");     // The host you want to connect to.
define("USER", "root");    // The database username. 
define("PASSWORD", "@admin123");    // The database password. 
define("DATABASE", "webeda");    // The database name.
 
define("CAN_REGISTER", "any");
define("DEFAULT_ROLE", "member");
 
define("SECURE", FALSE);    // FOR DEVELOPMENT ONLY!!!!


/*Below setting is for the editable Grid*/
$config = array(
	"db_name" => "webeda",
	"db_user" => "root",
	"db_password" => "@admin123",
	"db_host" => "localhost"
);                
error_reporting(E_ALL);
ini_set('display_errors', '1');
?>