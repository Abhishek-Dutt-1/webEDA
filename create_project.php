<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
 
sec_session_start();

?>
<html>
	<head>
        <title>Create Project</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
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
        <link rel="stylesheet" href="styles/main.css" />
        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script> 
    </head>
<body>

		 <?php if (login_check($mysqli) == true) : ?>
            <!-- Header -->
			<header id="header">
				<h1><a href="index.html">EDA WEBTOOL</a> by Madison Business Analytics</h1>
				<nav id="nav">
					<ul>
						<?php if (isset($_SESSION['username']))
		echo "<li> Welcome! ".$_SESSION['username']."</li>";?>
						<li><a href="index.html">Home</a></li>
						<li>
							<a href="" class="icon fa-angle-down">Options</a>
							<ul>
								<li><a href="generic.html">Generic</a></li>
								<li><a href="contact.html">Contact</a></li>
								<li><a href="elements.html">Elements</a></li>
								<li>
									<a href="">EDA</a>
									<ul>
										<li><a href="#">Trend Chart</a></li>
										<li><a href="#">EDA Charts</a></li>
										<li><a href="#">Diagnostic Charts</a></li>
										<li><a href="#">Mean Difference Charts</a></li>
									</ul>
								</li>
								<li>
									<a href="">Model</a>
									<ul>
										<li><a href="#">Contribution Charts</a></li>
										<li><a href="#">Sensitivity Charts</a></li>
										<li><a href="#">Saturation Curves</a></li>
										<li><a href="#">Actual vs Predicted</a></li>
										<li><a href="#">Contribution Series</a></li>
										<li><a href="#">Simulation</a></li>
									</ul>
								</li>
							</ul>
						</li>
						<li><a href="includes/logout.php" class="button">Log Out</a></li>
					</ul>
				</nav>
			</header>
		<section id="main" class="container">
			<header>
				<h2>Create Project</h2>
				<p>Please enter the name of the new project.</p>
			</header>
		<section class="box">
			<form action="includes/new_project.php" method="post" enctype="multipart/form-data">
			
			
				<div class="row uniform half collapse-at-2">
					<div class="9u">
						<input type="text" name="dataset" id="dataset" value="" placeholder="Project Name" />
					</div>	
					<div class="3u">
						<input type="submit" value="Submit" class="fit" />
					</div>
				</div>
			
			
			</form>
		</section>
		</section>
		
		<?php else : ?>
					<p>
						<span class="error">You are not authorized to access this page.</span> Please <a href="Login.php">login</a>.
					</p>
        <?php endif; ?>
</body>
</html>