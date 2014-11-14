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
		<script src="viz/Highcharts/js/highcharts-more.js"></script>
		<script src="viz/Highcharts/js/modules/solid-gauge.js"></script>
		

		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
		</noscript>

		<link rel="stylesheet" href="viz/styles/charts_Diagnostics.css" />
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
										<a href="index.php">Home</a> &raquo; <a href="project.php">Projects</a> &raquo; <a href="eda.php">Data</a> &raquo; <a href="Charts.php">EDA</a> &raquo; <a href="comparediagnostics.php">Compare Diagnostics</a>
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
									<div style="margin: 100px 0 70px 0;">
										<h3 style="width: 30%; float: left; position: relative; top: 20px;">WoA/MoA</h3>										
										<div id="thresholdInputsOuter">
										</div>
									</div>
									<div id="compareOuterDiv">
										<div style="clear: both;"></div>
										<div id="selectionTableContainer">
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
						<div style="height: 89px; overflow: hidden;"	>
							<div id="{VarNameId}">
							</div>
						</div>
						<div class="selectionVarName"><a href="#" onclick="showDiagnosticsChart('{VarName}'); return false;">{VarName}</a></div>
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
<!-- template -->
<script type="text/x-template" id="diagnosticsThresholdInputsTemplate">
<div style="margin: 0 0px 20px 0; overflow: hidden;">
	{#varTypes}
		<div style="float: right; width: 90px; margin: 0 5px;">
			<div style="font-size: 12px; text-align: center;">{varType}</div>		
			<input type="text" id="{varTypeId}" style="height: 30px; font-size: 12px;" value="10" onchange="updateSelectionTable();">
		</div>
	{/varTypes}
</div>
</script>

<div id="selectTableVariable">
	<div id="selectTableVariableInner">
		<div id="selectTableVariablesList">
			Content of popup
		</div>
	</div>
</div>
<div id="diagnosticsChartPopup">
	<div id="diagnosticsChartPopupInner">
		<div id="diagnosticsChart">
			Diagnostics Chart
		</div>
	</div>
</div>
		<script type="text/javascript">var edaId = "<?php echo $_SESSION['edaId']; ?>";</script>
		<script type="text/javascript">var projectId = "<?php echo $_SESSION['projectid']; ?>";</script>
		<script src="viz/libs/linkedin-dustjs/dist/dust-full.min.js"></script>
		<script src="viz/libs/bPopup/jquery.bpopup.min.js"></script>
		<script src="viz/Compare/comparediagnostics_charts.js"></script>
		
    </body>
</html>