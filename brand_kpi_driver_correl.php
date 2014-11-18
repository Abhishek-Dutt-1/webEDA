<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
include_once 'includes/correl.php';
 
sec_session_start();

?>
<!DOCTYPE HTML>
<!--
	Alpha by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
    <head>
		<title>Correlation</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="icon" href="favicon.ico" type="image/x-icon"> 
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery-migrate-1.2.1.min.js"></script>
		
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/jquery.scrollgress.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		
 
		<!-- I use jQuery for the Ajax methods -->
		<script src="js/eda_col_map.js" ></script>
		
		<script src="viz/Highcharts/js/highcharts.js"></script>
		<script src="viz/highcharts-regression.js"></script>
		<script type="text/javascript">var edaId = "<?php echo $_SESSION['edaId']; ?>";</script>
		<script type="text/javascript">var projectId = "<?php echo $_SESSION['projectid']; ?>";</script>	
		<script src="viz/libs/bPopup/jquery.bpopup.min.js"></script>	
		<script src="viz/Correl/correl_charts.js"></script>		
		<link rel="stylesheet" href="viz/styles/charts.css" />
		
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
		</noscript>
        
        <link href="css/fixedheadertable.css" rel="stylesheet" media="screen" />
        <link href="css/custom.css" rel="stylesheet" media="screen" />
        
<!--    <script src="js/jquery-1.7.2.js"></script>   -->
        
        <script src="js/jquery.fixedheadertable.js"></script>
        
     
		<script>
			window.onload = function()
			{
				 var brand_temp = document.getElementById("brand");
				 brand_temp.selectedIndex=1;
				 document.getElementById("brand").onchange();
			};
		</script>
		
		<script>
			function showCorrel() {
			
				document.getElementById("getcorrelvalues").innerHTML="";
				  document.getElementById("loadingSpinner").innerHTML= '<i class="fa fa-spinner fa-spin"></i>  Please Wait... Loading...';	
				  
				  var brand_temp = document.getElementById("brand");
				  var brand = brand_temp.options[brand_temp.selectedIndex].text;
				  
				  
				  var var_type_temp = document.getElementById("variable_type");
				  var var_type = var_type_temp.options[var_type_temp.selectedIndex].text;
				  
				  if(var_type=="- Type -"){
					var_type_value="All";
				  } else{
				  var_type_value = var_type;
				  }
				  console.log(var_type);
				  if (brand=="- Brand -") {
					document.getElementById("getcorrelvalues").innerHTML="";
					return;
				  } 
				  if (window.XMLHttpRequest) {
					// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				  } else { // code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				  }
				  xmlhttp.onreadystatechange=function() {
					if (xmlhttp.readyState==4 && xmlhttp.status==200) {
					  document.getElementById("getcorrelvalues").innerHTML=xmlhttp.responseText;
					  document.getElementById("loadingSpinner").innerHTML="";
					  
						$('#correltable').fixedHeaderTable({
							altClass : 'odd',
							footer : false,
							fixedColumns : 1
						});
						var height = $('#firstrow').height() + $('#secondrow').height();
						height= height +16;
					document.getElementById('firstcol').setAttribute("style","height:"+height+"px");
					}
				  }
				  xmlhttp.open("GET","includes/getcorrelvalues.php?brand="+brand+"&variable_type="+var_type_value,true);
				  console.log(brand);
				  xmlhttp.send();
			  
			}
		</script>
		 <script type="text/javascript">
            /* <![CDATA[ */
			/*
            $(document).ready(function() {
				console.log("now");
                $('#correltable').fixedHeaderTable({
                    altClass : 'odd',
                    footer : false,
                    fixedColumns : 1
                });
            });
			*/
            /* ]]> */
        </script>
    </head>
    <body>
		<?php if (login_check($mysqli) == true) : ?>
            <!-- Header -->
			
			<?php include 'includes/MainMenu.php'; ?>
		<section id="main" class="container">
			<?php
					$EDAid= $_SESSION['edaId'];
			if($_SESSION['edaId']==null || $_SESSION['edaId'] == "") :
			{ ?>
			<section class="box">
				<p>
					<span class="error">Oops!! </span> Please <a href="eda.php">Select a EDA Dataset</a>.
				</p>
			</section>
			<?php return;
			}
			endif; ?>
	
			<!-- popup html -->
			<div id="correlChartPopup">
				<div id="correlChartPopupInner">
					<div id="correlBiVariateChartOuter">
						<h3>Bivariate Chart</h3>
						<div id="correlBiVariateChart">
							Content of popup
						</div>
					</div>
					<div id="correlMeanDiffChartOuter">
						<h3>Mean Difference Chart</h3>
						<div id="correlMeanDiffChart">
							Content of popup
						</div>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="12u">
					<section class="box" style="overflow:hidden;">
						<div class="row collapse-at-2">
							<div class="6u">
								<div class="breadCrumb">
									<a href="index.php">Home</a> &raquo; <a href="project.php">Projects</a> &raquo; <a href="eda.php">Data</a> &raquo; <a href="eda.php">EDA</a> &raquo; <a href="brand_kpi_driver_correl.php">Correlations</a>
								</div>
							</div>
							<div class="6u">
								<div align="right" style="font-size:smaller;">
									<b>Selected Dataset : </b><?php echo $_SESSION['selectedEDA'];?>
									<br><b>Date Period : </b><?php echo $_SESSION['EDADatePeriod']; ?>
								</div>
							</div>
						</div>
						<hr style="margin:0 0;">
						<?php include 'viz/correlationsButtons.php' ?>
						<div style="clear: both;">
							<div id="container2">
								<h3>KPI - Driver Correlation</h3>
							</div>
						</div>
						<div class="row uniform half">
							<div class="6u">
								<div class="select-wrapper">
									<select name="brand" id="brand" onchange="showCorrel()" >
										<option value="">- Brand -</option>
										<?php
											$q_Brands="SELECT distinct brand FROM  eda_column_mapping where edaid = $EDAid ORDER BY ownership DESC";				
											$result = $mysqli->query($q_Brands);
											foreach ( $result as $row) 
												{
												$brandname = stripslashes($row['brand']);
												?><option value=<?php echo $brandname;?>><?php echo $brandname;?></option><?php
												}
										?>
									</select>
								</div>
							</div>
							<div class="6u">
								<div class="select-wrapper">
									<select name="variable_type" id="variable_type" onchange="showCorrel(this.value)" >
										<option value="">- Type -</option>
										<?php
											$q_VarType="SELECT distinct variable_type FROM  eda_column_mapping where edaid = $EDAid and variable='Driver'";				
											$result = $mysqli->query($q_VarType);
											foreach ( $result as $row) 
												{
												$variableType = stripslashes($row['variable_type']);
												?><option value=<?php echo $variableType;?>><?php echo $variableType;?></option><?php
												}
										?>
									</select>
								</div>
							</div>
							<?php include 'includes/loadingSpinner.php' ?>
						</div>
						
						<div id="getcorrelvalues">	
						</div>
					</section>
				</div>
			</div>
		
		</section>
	<!-- Footer -->
			<?php include 'includes/footer.php'; ?>		
							
			    <?php else : 
						include 'includes/error.php';
				endif; ?>
    </body>
</html>
