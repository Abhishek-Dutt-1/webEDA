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

		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
		</noscript>

		<link rel="stylesheet" href="viz/styles/charts_compareDriver.css" />
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
										<a href="index.php">Home</a> &raquo; <a href="project.php">Projects</a> &raquo; <a href="eda.php">Data</a> &raquo; <a href="Charts.php">EDA</a> &raquo; <a href="comparedriver.php">Media Schedule</a>
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
							
							<?php include 'viz/mediaButtons.php' ?>
							<div style="clear: both;">
								<div id="container2">
									<h3>Media Schedule</h3>
									<div id="compareOuterDiv">
<div id="selectionTableContainer">
</div>
									</div>
								</div>
								<?php include 'includes/loadingSpinner.php' ?>
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


<!-- template -->
<script type="text/x-template" id="selectionTableTemplate">
	<div id="selectionOuter">
	<div id="selectionInner">
	<div class="selectionColumn selectionLabelsColumn">
		<div class="selectionLabelsFirst"></div> <!-- upper left empty cell-->
	{#varTypes}
		<div class="selectionLabels"><div class="selectionLabelsInner">
			{driver}
		</div></div>
	{/varTypes}
	</div>
	{#brands}
		<div class="selectionColumn">
			{?brand}
			<div class="selectionHeader"><div class="selectionHeaderInner">
				<image src="images/brand/{brand}.png" height="50"><br>
				{brand} <a href="#" onclick="selectionRemoveBrand('{$idx}'); return false;">x</a>
			</div></div>
			{#drivers}
				
				{#info}
					<div class="selectionSparklineCell"><div class="selectionSparklineCellInner">
					{?Brand}
						<div id="{VarNameId}">
						</div>
						<div class="selectionVarName"><a href="#" onclick="showDriverChart('{VarName}'); return false;">{VarName}</a></div>
						{:else}
						<div class="selectionEmptyCell">-</div>
					{/Brand}
					</div></div>
				{/info}
				
			{/drivers}
			{:else}
			<div class="selectionHeader">
				<div class="selectionAddMore">
					<a href="#" onclick="selectionShowAddPopup({$idx}); return false;" class="selectionAddMoreLink">Add Brand</a>
				</div>
			</div>
			{/brand}
		</div>
	{/brands}
	</div>
	</div>
</script>

<div id="selectTableVariable">
	<div id="selectTableVariableInner">
		<div id="selectTableVariablesList">
			Content of popup
		</div>
	</div>
</div>
<div id="driverChartPopup">
	<div id="driverChartPopupInner">
		<div id="driverChart">
			Driver Chart
		</div>
	</div>
</div>
		<script type="text/javascript">var edaId = "<?php echo $_SESSION['edaId']; ?>";</script>
		<script type="text/javascript">var projectId = "<?php echo $_SESSION['projectid']; ?>";</script>
		<script src="viz/libs/linkedin-dustjs/dist/dust-full.min.js"></script>
		<script src="viz/libs/bPopup/jquery.bpopup.min.js"></script>
		<script src="viz/Compare/comparedriver_charts.js"></script>
		
    </body>
</html>