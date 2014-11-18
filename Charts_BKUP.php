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
		<script src="viz/Highcharts/js/modules/exporting.js"></script>	
		
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
				<header  style="display: none;">
					<h2>EDA Charts</h2>
					<p>Select from the list of eda below.</p>
				</header>
				<div class="row">
					<div class="12u">

						<!-- Buttons -->
						<section class="box" id="chartContainer1">
							<div class="row collapse-at-2">
								<div class="6u">
									<div class="breadCrumb">
										<a href="index.php">Home</a> &raquo; <a href="project.php">Projects</a> &raquo; <a href="eda.php">Data</a> &raquo; <a href="Charts.php">EDA</a> &raquo; <a href="Charts.php">Bivariates</a>
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
							
							<?php include 'viz/edaButtons.php' ?>
							<div style="clear: both;">
								<div id="chartContainer2">
									
									<!-- <h3>Trend Chart</h3>
									<div id="trendChartContainer">
									</div>
									-->
									<h3>Bivariate Charts</h3>
									<?php include 'includes/loadingSpinner.php' ?>
									<div id="edaChartContainer">
										
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

		<script type="text/javascript">var edaId = "<?php echo $_SESSION['edaId']; ?>";</script>
		<script type="text/javascript">var projectId = "<?php echo $_SESSION['projectid']; ?>";</script>
		<script src="viz/TrendEda/trend_charts.js"></script>
		
    </body>
</html>