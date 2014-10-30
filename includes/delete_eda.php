<?php
include_once 'db_connect.php';
include_once 'psl-config.php';
include_once 'db_connect.php';
include_once 'functions.php';
 
sec_session_start();
if (login_check($mysqli) == true) :
		var_dump($_POST);
		$EDAid = $_POST['edaid'];
		
		iF ($_POST["Action"] == "OK") :
		{
			$_SESSION['edaId'] = $EDAid;
			header('Location: ../kpi.php');
		}
		elseif($_POST["Action"] == "Testing for Model") :
		{
			$_SESSION['edaId'] = $EDAid;
			header('Location: ../Models.php');
		}
		elseif ($_POST["Action"] == "Delete") :
		{
			 echo $EDAid;
			if ($EDAid==null || $EDAid=="")
			{
			echo "Please Select a EDA to Delete";
			header('Location: ../eda.php');
			return false;
			}
			
			$select_table= "SELECT tablename FROM eda_dataset WHERE id =  $EDAid ";
			$result = $mysqli->query($select_table);
			
			if($result->num_rows > 0) 
				{
					while($row = $result->fetch_assoc()) 
						{
						$tablename =  stripslashes($row['tablename']);	
					}
				}
				else {
					echo "NO RESULTS";	
					}
				
			$delete_table = "drop table $tablename";
			$mysqli->query($delete_table);

			$delete_eda = "delete from eda_dataset where id = $EDAid";
			$mysqli->query($delete_eda);
			
			
			header('Location: ../eda.php');
		
		}
		endif;
		
else : 
?>
		<html>
					<p>
						<span class="error">You are not authorized to access this page.</span> Please <a href="Login.php">login</a>.
					</p>
		</html>
 <?php endif; 
?>