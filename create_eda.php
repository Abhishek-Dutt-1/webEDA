<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
 
sec_session_start();

?>
<html>
	<head>
        <title>Upload a new EDA dataset</title>
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
			<section class="box">
				<h3>Upload a new Dataset for EDA:</h3>
				<form action="includes/upload_EDA.php" method="post" enctype="multipart/form-data">
				<div class="row uniform half ollapse-at-2">
					<div class="6u">
						
						<?php if($_SESSION['tablecheck']<>"") :
								{ ?>
									<input type="text" name="dataset" id="dataset" value=<?php echo $_SESSION['tablename'];?> placeholder="Dataset Name" />
									<label><font color="red">The Dataset Name already exists!!</font></label>
						<?php 	} 
								else :
								{ ?>
									<input type="text" name="dataset" id="dataset" value="" placeholder="Dataset Name" />
						<?php	}
								endif; ?>
					</div>
				</div>
				<div class="row uniform half ollapse-at-2">
					
						<label for="file">Select the csv file to upload:</label>
						<input type="file" name="file" id="file" accept=".csv"><br>
				</div>
				<input type="submit" name="submit" value="Submit">
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