<?php
function errorHandler($errno,$errmsg,$errfile) {
}
$feed = $_GET["feed"];
$language = $_GET["language"];
set_error_handler("errorHandler");
$toReturn = iconv('WINDOWS-1256', 'UTF-8', ("[".explode(',[',(explode("],",file_get_contents("http://suggestqueries.google.com/complete/search?output=chrome&hl=$language&q=$feed"))[0])."]")[1]));
if($toReturn === "["){
	echo $toReturn."]";
}else{
	echo $toReturn;
}
restore_error_handler();
?>