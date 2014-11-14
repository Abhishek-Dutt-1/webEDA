<header id="header">
	<h1>
		<img src="images/EDA WT.png" id="logo" height="32" width="32" style="top:7px;position:relative;right=5px" />
		<a href="index.php">M:Modeler</a> by Madison Business Analytics
	</h1>
	
	
	<nav id="nav">
		<ul>
			<?php if (isset($_SESSION['username'])) :
					echo "<li> Welcome! ".ucfirst(strtolower($_SESSION['username']))."</li>";
					endif;?>
			<li><a href="index.php">Home</a></li>
			<li>
				<a href="" class="icon fa-angle-down">Go To</a>
				<ul>
					<li><a href="project.php">Project</a></li>
					<li><a href="eda.php">EDA</a></li>
					<li><a href="kpi.php">KPI</a></li>
					<li><a href="comparekpi.php">Compare KPI</a></li>
					<li><a href="avp.php">Model</a></li>
					<li><a href="Report Bug.php">Report an Issue</a></li>
				</ul>
			</li>
			<?php 
				$role=$_SESSION['role'];
				if($role==1) :
				{ ?>
			<li>
				<a href="" class="icon fa-angle-down">Admin</a>
				<ul>
					<li><a href="admin.php">User-Project Mapping</a></li>
					<li><a href="eda_col_map.php">EDA Column Mapping</a></li>
					<li><a href="color-selection.php">Color Selection</a></li>
					<li><a href="user admin access.php">User Access</a></li>
				</ul>
			</li>
			<?php	} 
				endif; ?>
			<li><a href="includes/logout.php" class="button">Log Out</a></li>
		</ul>
	</nav>
	<hr style="display: block; height: 2px; border: 0; border-top: 3px solid #FCFFFF; margin: 2.9em 0; padding: 0;">
	<hr style="display: block; height: 2px; border: 0; border-top: 8px solid #890000; margin: -2.9em 0; padding: 0;">
</header>

