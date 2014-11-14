<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';

sec_session_start();

?>
<!DOCTYPE html>
<html>
    <head>
        <title>EDA</title>
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
		<script src="viz/Highcharts/js/highcharts.js"></script>
		<script src="viz/highcharts-regression.js"></script>
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
		</noscript>

		<link rel="stylesheet" href="viz/styles/charts.css" />
        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script> 
    </head>
    <body>
	
        <?php if (login_check($mysqli) == true) : ?>
            <!-- Header -->
			
			<?php include 'includes/MainMenu.php'; ?>
					
			<section id="main" class="container">
				<div class="row">
					<div class="12u">
						<!-- Buttons -->
						<section class="box" id="chartContainer1">
							<div class="row collapse-at-2">
								<div class="6u">
									<div class="breadCrumb">
										<a href="index.php">Home</a> &raquo; <a href="project.php">Projects</a> &raquo; <a href="eda.php">Data</a> &raquo; <a href="Charts.php">EDA</a> &raquo; <a href="comparekpi.php">Compare KPI</a>
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
							
							<?php include 'viz/queryButtons.php' ?>
							<div style="clear: both;">
								<div id="container2">
									<h3 style="float: left; width: 30%;">Custom Query</h3>
									<div style="float: right;">
										<a href="#" class="button alt small" onclick="toggleKPISelectExpand(); return false;">1 : Select KPI</a>
										<a href="#" class="button alt small" onclick="toggleDriverSelectExpand(); return false;">2 : Select Driver</a>
										<a href="#" class="button small" onclick="updateChart(); return false;">3 : Chart</a>
									</div>
									<div style="clear: both;"></div>
									<div id="trackSelection" style="color: #777; float: right;">KPI : <b>0</b> | Driver : <b>0</b></div>
									<div id="queryKPISelectionPanel" style="border: 0px solid lightgrey; overflow: hidden1; clear:both; line-height: 1em;">
										<div id="slideToggleKPIPanel1" style="float: left; width: 25%; padding: 20px;"></div>
										<div id="slideToggleKPIPanel2" style="float: left; width: 70%; padding: 20px;"></div>
										<div id="slideToggleKPIPanel3" style="float: left; width: 25%; padding: 20px;"></div>
									</div>
									<div id="queryDriverSelectionPanel" style="border: 0px solid lightgrey; overflow: hidden1; clear:both; line-height: 1em;">
										<div id="slideToggleDriverPanel1" style="float: left; width: 20%; padding: 20px;"></div>
										<div id="slideToggleDriverPanel2" style="float: left; width: 20%; padding: 20px;"></div>
										<div id="slideToggleDriverPanel3" style="float: left; width: 60%; padding: 20px;"></div>
									</div>
									<!-- //Popup
									<div style="float: right;">
										<a href="#" class="button alt small" onclick="showKPISelectPopup(); return false;">Select KPI</a>
										<a href="#" class="button alt small" onclick="showDriverSelectPopup(); return false;">Select Driver</a>
										<a href="#" class="button small" onclick="updateChart()">Chart</a>
									</div>
									-->
									<div id="queryOuterDiv">
										<!-- // Multi select
										<div class="row uniform half ollapse-at-2">
											<div class="4u">
												<div>
													<h4>KPI</h4>
													<select name="category" id="kpiSelectInput" multiple>
													</select>
												</div>
											</div>
											<div class="1u">
												<b>vs.</b>
											</div>
											<div class="4u">
												<div>
													<h4>Driver</h4>
													<select name="category" id="driverSelectInput" multiple>
													</select>
												</div>
											</div>
										</div>
										<div id="queryUpdateButton">
											<a href="#" class="button alt small" onclick="updateChart()">Update</a>
										</div>
										-->
										<div id="chartsOuterDiv">
										</div>
									</div>
								</div>
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

<div id="kpiSelectPopup">
	<div id="kpiSelectPopupInner">
		<div id="kpiSelectContainer">
			KPI SELECT HERE
		</div>
	</div>
</div>
<div id="driverSelectPopup">
	<div id="driverSelectPopupInner">
		<div id="driverSelectContainer">
			DRIVER SELECT HERE
		</div>
	</div>
</div>	
		
		<script type="text/javascript">var edaId = "<?php echo $_SESSION['edaId']; ?>";</script>
		<script type="text/javascript">var projectId = "<?php echo $_SESSION['projectid']; ?>";</script>
		<script src="viz/libs/linkedin-dustjs/dist/dust-full.min.js"></script>
		<script src="viz/libs/bPopup/jquery.bpopup.min.js"></script>
		<script src="viz/Compare/customquery_charts.js"></script>
		
    </body>
</html>