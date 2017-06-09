<?php
    
	$charset = "utf8";
	$db_Server = "localhost";
	$db_Username = "root";
	$db_Password = "";
	$db_Name = "suggestions";
	$before = null;
	$key = null;
	$language = $_GET["language"];
	$project = $_GET["project"];
	if(isset($_GET["before"])){
		$before = $_GET["before"];
		if($before === ""){
			$before = null;
		}
	}
	if(isset($_GET["key"])){
		$key = $_GET["key"];
		if($key === ""){
			$key = null;
		}
	}
	
	$mysqli = new mysqli ( $db_Server, $db_Username, $db_Password, $db_Name );
		if ($mysqli->connect_errno) {
			echo "[{\"database\":[]}]";
			exit ();
		} else {
			mysqli_set_charset ( $mysqli, $charset );
		}
		$idmot = "";
		$mot = "";
		if($before !== null){
			$sql = "SELECT `id` FROM `suggestion` WHERE `mot` = '".addslashes ($before)."' AND `langue`='".addslashes ($language)."' AND `projet`='".addslashes ($project)."';";
			if (! $result = $mysqli->query ( $sql )) {
				//echo ' check() checking messages : There was an error running the query';
				$mot = "erreur";
				exit ();
			} else {
				if ($result->num_rows === 0) {
					
				} else {
					$idmot = $result->fetch_assoc ()["id"];
					$mot = "looking for sucessors of : ".$before.", starting with : ".$key;
				}
			}
			$results = 1;
			$toReturn = "{\"database\":[";
			if($idmot != ""){
				$sql = "SELECT suggestion.id,suggestion.mot FROM `suggestion`,`successeur` WHERE successeur.mot1='$before' AND suggestion.id=successeur.mot2 AND successeur.langue='".addslashes ($language)."' AND successeur.projet=".addslashes ($project)." AND MATCH(suggestion.mot) AGAINST('$key*' IN BOOLEAN MODE)  ORDER BY successeur.derniere_utilisation DESC LIMIT ".$results;
				//$mot .= $sql;
				if (! $result = $mysqli->query ( $sql )) {
					//echo ' check() checking messages : There was an error running the query';
					$mot = "erreur ".$sql;
					exit ();
				} else {
					if ($result->num_rows === 0) {
						$was = false;
					} else {
						$was = true;
						$results = 0;
						$toReturn .= "{\"value\":{\"id\":\"".$result->fetch_assoc()["suggestion.id"]."\",\"value\":\"".$result->fetch_assoc()["suggestion.mot"]."\"},\"source\":\"database\",\"type\":\"Last Used Successor\"}";
					}
				}
				$results+=2;
				$sql = "SELECT suggestion.id,suggestion.mot FROM `suggestion`,`successeur` WHERE successeur.mot1='$before' AND suggestion.id=successeur.mot2 AND successeur.langue='".addslashes ($language)."' AND successeur.projet=".addslashes ($project)." AND MATCH(suggestion.mot) AGAINST('$key*' IN BOOLEAN MODE) ORDER BY successeur.frequence DESC LIMIT ".$results;
				//$mot .= $sql;
				if (! $result = $mysqli->query ( $sql )) {
					//echo ' check() checking messages : There was an error running the query';
					$mot = "erreur ".$sql;
					exit ();
				} else {
					if ($result->num_rows === 0) {
						
					} else {
						
						if($result->num_rows < $results){
						    $results -= $result->num_rows;
						}
						$i = 0;
						while ($suggs = $result->fetch_assoc()) {
							if($i === 0){
								$i = 1;
								if($was){
									$toReturn .= ",{\"value\":{\"id\":\"".$suggs['suggestion.id']."\",\"value\":\"".$suggs['suggestion.mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency Successor\"}";
								}else{
									$toReturn .= "{\"value\":{\"id\":\"".$suggs['suggestion.id']."\",\"value\":\"".$suggs['suggestion.mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency\"}";
								}
							}else{
								$toReturn .= ",{\"value\":{\"id\":\"".$suggs['suggestion.id']."\",\"value\":\"".$suggs['suggestion.mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency Successor\"}";
							}
						}
						$was = true;
					}
				}
				$results+=2;
				$sql = "SELECT id,mot FROM `suggestion` WHERE suggestion.langue='".addslashes ($language)."' AND suggestion.projet=".addslashes ($project)." AND MATCH(suggestion.mot) AGAINST('$key*' IN BOOLEAN MODE) ORDER BY suggestion.frequence DESC LIMIT ".$results;
				if (! $result = $mysqli->query ( $sql )) {
					//echo ' check() checking messages : There was an error running the query';
					$mot = "erreur ".$sql;
					exit ();
				} else {
					if ($result->num_rows === 0) {
					
					} else {
						if($result->num_rows < $results){
							$results -= $result->num_rows;
						}
						$i = 0;
						while ($suggs = $result->fetch_assoc()) {
							if($i === 0){
								$i = 1;
								if($was){
									$toReturn .= ",{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency (No Successor)\"}";
								}else{
									$toReturn .= "{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency (No Successor)\"}";
								}
							}else{
								$toReturn .= ",{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency (No Successor)\"}";
							}
						}
					}
			}
			
			// 1 Derniere utilisation successor of this before using key
			// 2 highest frequency successors of this before using key
			// 2 suggestions using just key
			}
		}else{
			$mot = "looking for suggestion for ".$key;
			$results = 1;
			$was = false;
			$sql = "SELECT id,mot FROM `suggestion` WHERE langue='".addslashes ($language)."' AND projet=".addslashes ($project)." AND MATCH(mot) AGAINST('$key*' IN BOOLEAN MODE) ORDER BY derniere_utilisation DESC LIMIT ".$results;
			//$mot .= $sql;
			if (! $result = $mysqli->query ( $sql )) {
				//echo ' check() checking messages : There was an error running the query';
				$mot = "erreur ".$sql;
				exit ();
			} else {
				if ($result->num_rows === 0) {
			        $was = false;
				} else {
					$was = true;
					$results = 0;
					$toReturn .= "{\"value\":{\"id\":\"".$result->fetch_assoc()["id"]."\",\"value\":\"".$result->fetch_assoc()["mot"]."\"},\"source\":\"database\",\"type\":\"Last used\"}";
				}
			}
			$results+=4;
			$sql = "SELECT id,mot FROM `suggestion` WHERE langue='".addslashes ($language)."' AND projet=".addslashes ($project)." AND MATCH(mot) AGAINST('$key*' IN BOOLEAN MODE) ORDER BY frequence DESC LIMIT ".$results;
			if (! $result = $mysqli->query ( $sql )) {
				//echo ' check() checking messages : There was an error running the query';
				$mot = "erreur ".$sql;
				exit ();
			} else {
				if ($result->num_rows === 0) {
				} else {
					if($result->num_rows < $results){
						$results -= $result->num_rows;
					}
					$i = 0;
					while ($suggs = $result->fetch_assoc()) {
						if($i === 0){
							$i = 1;
							if($was){
								$toReturn .= ",{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency\"}";
							}else{
								$toReturn .= "{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency\"}";
							}
						}else{
							$toReturn .= ",{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\",\"type\":\"Highest Frequency\"}";
						}
					}
				}
			}
			// 1 Derniere utilisation using key
			// 4 highest frequency using key
		}
		$toReturn .= "],\"data\":[\"$idmot\",\"$mot\"]}";
		echo $toReturn;
	/*$sql = "SELECT * FROM `suggestion`";
		if (! $result = $mysqli->query ( $sql )) {
			//echo ' check() checking messages : There was an error running the query';
			echo "{\"database\":[]}";
			exit ();
		} else {
		$toReturn = "{\"database\":[";
		$i = 0;
		while ($suggs = $result->fetch_assoc()) {
			if($i === 0){
				$toReturn .= "{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\"}";
			}else{
				$toReturn .= ",{\"value\":{\"id\":\"".$suggs['id']."\",\"value\":\"".$suggs['mot']."\"},\"source\":\"database\"}";
			}
			$i++;
			
		}
		$toReturn .= "],\"data\":[\"$idmot\",\"$mot\"]}";
		echo $toReturn;
			//echo "<p>Last persisted Message : " . $this->exists_Message . ", offset : " . $this->offset_Messages . "</p>";
		}*/
?>