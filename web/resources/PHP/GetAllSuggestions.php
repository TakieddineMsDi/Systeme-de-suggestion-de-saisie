<?php
function errorHandler($errno,$errmsg,$errfile) {        
        echo "[{\"yamli\":[]},{\"google\":[]}]:".$test;
		
        exit();     
}

$key = $_GET["key"];
$what = $_GET["what"];
$language = $_GET["language"];
// DataBase Suggestions
$break = false;
if(count(explode(',',$what)) === 1){
	$break = true;
}

// Yamli Suggestions
//set_error_handler("errorHandler");
$yamliData = explode("|",(json_decode(file_get_contents("http://api.yamli.com/transliterate.ashx?word=$key&tool=api&account_id=&prot=file%3A&hostname=&path=%2FC%3A%2Fxampp%2Fhtdocs%2FSaisieRapid%2Fyamli.html&build=5447"))->r));
//restore_error_handler();
$yamliToReturn = "[";
$noData = false;
if(count($yamliData) === 1){
	$noData = true;
}
for($i=0;$i<count($yamliData);$i++){
	if($break){
		break;
	}
	$exploded = explode('/',$yamliData[$i])[0];
	if($noData){
		if($exploded === $key){
			break;
		}
	}
	if($i===0){
		$yamliToReturn .= "{\"value\":\"".$exploded."\", \"source\": \"yamli\"}";
	}
	else{
		$yamliToReturn .= ",{\"value\":\"".$exploded."\", \"source\": \"yamli\"}";;
	}
}
$yamliToReturn .= "]";

// Google Suggestions

$googleDataExploded = explode('","',("[".explode(',[',(explode("],",file_get_contents("http://suggestqueries.google.com/complete/search?output=chrome&hl=$language&q=$key"))[0])."]")[1]));
$noData = false;
if(count($googleDataExploded) === 1 && $googleDataExploded[0] === "[]"){
	$noData = true;
}
$googleToReturn = "[";
for($i=0;$i<count($googleDataExploded);$i++){

	if($noData){
		break;
	}
	
	if($i===0){
	    $exploded = explode('["',$googleDataExploded[$i])[1];
	}else if($i === count($googleDataExploded)-1){
		$exploded = explode('"]',$googleDataExploded[$i])[0];
	}else{
		$exploded = $googleDataExploded[$i];
	}
	if($i===0){
		$googleToReturn .= "{\"value\":\"".$exploded."\", \"source\": \"google\"}";
	}
	else if($i===count($googleDataExploded)-1){
		$googleToReturn .= ",{\"value\":\"".$exploded."\", \"source\": \"google\"}";;
	}else{
		$googleToReturn .= ",{\"value\":\"".$exploded."\", source: \"google\"}";;
	}
}
$googleToReturn .= "]";
//echo iconv('WINDOWS-1256', 'UTF-8', $googleToReturn);
echo "[{\"yamli\":".$yamliToReturn."},{\"google\":".iconv('WINDOWS-1256', 'UTF-8', $googleToReturn)."}]";
//echo $yamliToReturn;

?>