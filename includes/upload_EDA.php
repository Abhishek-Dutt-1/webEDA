<?php
include_once 'db_connect.php';
include_once 'psl-config.php';
include_once 'db_connect.php';
include_once 'functions.php';
 
sec_session_start();
$_SESSION['tablecheck']="";
$_SESSION['tablename']="";

if (login_check($mysqli) == true) :
		$fname= $_POST["dataset"];
		 //echo $fname;
		if ($fname==null || $fname=="")
		{
		echo "Please mention the Dataset Name";
		return false;
		}


		$allowedExts = array("csv");
		$temp = explode(".", $_FILES["file"]["name"]);
		$extension = end($temp);

		if (in_array($extension, $allowedExts))
		{
		  if ($_FILES["file"]["error"] > 0) {
			echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
		  } else {
			//echo "Upload: " . $_FILES["file"]["name"] . "<br>";
			//echo "Type: " . $_FILES["file"]["type"] . "<br>";
			//echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
			//echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
			$filename  = basename($_FILES['file']['name']);
			$extension = pathinfo($filename, PATHINFO_EXTENSION);
			$new       = $fname.'.'.$extension;
			
			//Check whether file exists
			//if (file_exists("../upload/" . $new)) {
			//  echo "<br><br><br>".$new . " already exists. ";
			//} else {
			  //move_uploaded_file($_FILES["file"]["tmp_name"],
			  //"upload/" . $_FILES["file"]["name"]);
			  
			  move_uploaded_file($_FILES['file']['tmp_name'], "../upload/{$new}");
			  
			  
				$filename="../upload/" . $new;
				$file = fopen($filename,"r");
				fclose($file);


				/********************************************************************************/
				// Parameters: filename.csv table_name


				$table = pathinfo($filename);
				$table = $table['filename'];
				$Projectid=$_SESSION['projectid'];
				$dataset=$table;
				$table=$table."_".$Projectid;
				//}

				/********************************************************************************/
				// Get the first row to create the column headings

				$fp = fopen($filename, 'r');
				$frow = fgetcsv($fp);
				

				$ccount = 0;
				foreach($frow as $column) {
					$ccount++;
					if(isset($columns)) $columns .= ', ';
					else $columns="";
					$columns .= "`". "$column"."`". " varchar(50)";
				}

				$create = "create table `$table` ($columns);";
				echo $create;
				$mysqli->query($create);
				
				
				
				if($mysqli->error) :
				{
					var_dump($mysqli->error );
					$_SESSION['tablecheck']="DataSet name already exits!";
					$_SESSION['tablename']=$_POST["dataset"];
					header('Location: ../create_eda.php');
					return;
				}
				endif;
				
				/********************************************************************************/
				// Import the data into the newly created table.
				var_dump($_FILES);
				
				$file = $_SERVER['CONTEXT_DOCUMENT_ROOT'].'webeda/upload/' . $new;
				
				$q_loaddata = "load data infile '$file' into table `$table` fields terminated by ',' ignore 1 lines";
				echo $q_loaddata;
				$mysqli->query($q_loaddata);
				echo $file;
				
				var_dump( $mysqli->error );

				$q_insert_eda= "insert into eda_dataset(datasetname,tablename, projects_id, created_date,modified_date) values ('$dataset','$table',$Projectid,now(),now())";
				$mysqli->query($q_insert_eda);
							
				header('Location: ../eda.php');
			
		  }
		}
		else {
		  echo "<br><br><br> Invalid file : Please upload a csv file";
		}
else : 
?>
		<html>
					<p>
						<span class="error">You are not authorized to access this page.</span> Please <a href="Login.php">login</a>.
					</p>
		</html>
 <?php endif; 
?>