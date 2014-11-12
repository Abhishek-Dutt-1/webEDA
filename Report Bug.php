<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
 
sec_session_start();
//var_dump($_SESSION);
?>
<!DOCTYPE HTML>
<!--
	Alpha by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
	<head>
		<title>M:Modeler - Report an Issue</title>
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
		<!--[if lte IE 8]><link rel="stylesheet" href="css/ie/v8.css" /><![endif]-->
	</head>
	<body>
		 <?php if (login_check($mysqli) == true) : ?>

			<!-- Header -->
				<?php include 'includes/MainMenu.php'; ?>

			<!-- Main -->
				<section id="main" class="container small">
					
					<div class="box">
						<iframe src="https://docs.google.com/spreadsheet/embeddedform?formkey=dFNULTdUb0h1c2tTdFZTX2ZuWTJyUFE6MA" width="575" height="648" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
					</div>
				</section>
				
			<!-- Footer -->
				<?php include 'includes/footer.php'; ?>
		 <?php else : ?>
            <p>
                <span class="error">You are not authorized to access this page.</span> Please <a href="Login.php">login</a>.
            </p>
        <?php endif; ?>

	</body>
</html>