<?php
include_once 'includes/db_connect.php';
include_once 'includes/functions.php';
 
sec_session_start();
 
if (login_check($mysqli) == true) {
    $logged = 'in';
} else {
    $logged = 'out';
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Secure Login</title>
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
	<header id="header">
				<h1><a href="index.html">EDA WEBTOOL</a> by Madison Business Analytics</h1>
				<nav id="nav">
					<ul>
						<li><a href="index.html">Home</a></li>
						<li><a href="#" class="button">Register</a></li>
					</ul>
				</nav>
			</header>
			<section id="banner">
				<header>
					<h2>Login</h2>
					<p>Please enter your credentials to proceed.</p>
				</header>
				
				<?php
				if (isset($_GET['error'])) {
					echo '<p class="error">Error Logging In!</p>';
				}
				?> 
				 <form action="includes/process_login.php" method="post" name="login_form">   
					
				<div align="center">
					<div class="4u">
						<input type="text" name="email" id="email" value="" placeholder="Email" />
					</div>
					<br>
					<div class="4u">
						<input type="password" name="password" id="password" value="" placeholder="Password" />
					</div>
					<br>
				</div>
					<div class="row uniform">
						<div class="12u">
						<ul class="actions">
								<li><input type="button" 
								   value="Login" 
								   onclick="formhash(this.form, this.form.password);" /></li>
								<li><input type="reset" class="button alt value="Reset"  /></li>
							</ul>
							</div>
						</div>
				<br>					
				<p>If you don't have a login, please <a href="register.php">register</a></p>
					
				</form>
			</section>
		     
        </form>
        
       <!-- <p>If you are done, please <a href="includes/logout.php">log out</a>.</p>
        <p>You are currently logged <?php echo $logged ?>.</p> -->
	
	<footer id="footer">
				
				<ul class="copyright">
					<li>&copy; Madison Business Analytics. All rights reserved.</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
				</ul>
	</footer>
    </body>
</html>