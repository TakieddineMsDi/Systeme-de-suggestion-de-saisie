<?php
function errorHandler($errno, $errmsg, $errfile) {
}
$feed = $_GET ["feed"];
$regex = "/[[:alnum:]]+/";
if (preg_match ( $regex, $feed )) {
	set_error_handler ( "errorHandler" );
	$dataArray = explode ( "|", (json_decode ( file_get_contents ( "http://api.yamli.com/transliterate.ashx?word=$feed&tool=api&account_id=&prot=file%3A&hostname=&path=%2FC%3A%2Fxampp%2Fhtdocs%2FSaisieRapid%2Fyamli.html&build=5447" ) )->r) );
	$toReturn = "[";
	for($i = 0; $i < count ( $dataArray ); $i ++) {
		if ($i === 0) {
			$toReturn .= "\"" . explode ( '/', $dataArray [$i] ) [0] . "\"";
		} else {
			$toReturn .= ",\"" . explode ( '/', $dataArray [$i] ) [0] . "\"";
		}
	}
	$toReturn .= "]";
	if ($toReturn === "[\"\"]") {
		echo "[]";
	} else {
		echo $toReturn;
	}
	restore_error_handler ();
} else {
	echo "[]";
}
?>