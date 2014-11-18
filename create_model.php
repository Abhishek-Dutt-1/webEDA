<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
 
sec_session_start();
$edaid = $_SESSION['edaId'];
?>
<html>
	<head>
        <title>Upload a new Model</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="icon" href="favicon.ico" type="image/x-icon"> 
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"> 
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/jquery.scrollgress.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
		</noscript>
        
        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script> 
    </head>
<body>

		 <?php if (login_check($mysqli) == true) : ?>
            <!-- Header -->
			<?php include 'includes/MainMenu.php'; ?>
			
		<section id="main" class="container">
		<?php 		
				if(($_SESSION['projectid'] == "") || ($_SESSION['edaId']=="")):
				{ ?>
					<section class="box">
					<p>
						<span class="error">Oops!! </span> Please <a href="eda.php">Select EDA</a>.	
					</p>
					</section>
		<?php	
				return;
				}
				endif; ?>
		<section class="box">
			<h3>Upload Models:</h3>
			<form action="includes/upload_model.php" method="post" enctype="multipart/form-data">
			
			<div class="row uniform half ollapse-at-2">
				<div class="6u">
					
					
					<?php if($_SESSION['tablecheck']<>"") :
								{ ?>
									<input type="text" name="dataset" id="dataset" value=<?php echo $_SESSION['tablename'];?> placeholder="Model Set Name" />
									<label><font color="red"><?php echo $_SESSION['tablecheck'];?></font></label>
						<?php 	} 
								else :
								{ ?>
									<input type="text" name="dataset" id="dataset" value="" placeholder="Model Set Name" />
						<?php	}
								endif; ?>
				</div>
				
			</div>
			<div class="row uniform half ollapse-at-2">
			<div class="6u">
				<div class="select-wrapper">
											
					<select name="kpi" id="kpi">
						<option value="">- Select KPI for the model set -</option>
						<?php
							$q_KPI="SELECT DISTINCT `Column Name` as KPI FROM  eda_column_mapping WHERE edaid = $edaid AND Variable='KPI' AND Ownership ='Own'";				
							$result = $mysqli->query($q_KPI);
							
							foreach ( $result as $row) 
									{
									$kpi = stripslashes($row['KPI']);
									?><option value="<?php echo $kpi;?>"><?php echo $kpi;?></option><?php
									}
								
						?>
					</select>
				</div>
				</div>
			</div>
			<div class="row uniform half ollapse-at-2">
					<label for="file">Select the csv file to upload:</label>
					<input type="file" name="file" id="file" accept=".csv" ><br>
			</div>
			
			<input type="submit" name="submit" value="Submit">
			<a href="models.php" class="button alt">Cancel</a>
			</form>
		</section>
		</section>
		
		<?php else : 
					include 'includes/error.php';
			endif; ?>
		<!-- Footer -->
			<?php include 'includes/footer.php'; ?>
</body>
</html>