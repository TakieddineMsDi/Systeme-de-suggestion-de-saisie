<?php
session_start ();
class PersistSuggestion {
	private $charset = "utf8";
	private $db_Server = "localhost";
	private $db_Username = "root";
	private $db_Password = "";
	private $db_Name = "suggestions";
	private $mysqli = null;
	private $input = null;
	function __construct() {
		$this->connectMysql ();
		$this->getInput();
		$this->saveData();
	}

	function connectMysql() {
		$this->mysqli = new mysqli ( $this->db_Server, $this->db_Username, $this->db_Password, $this->db_Name );
		if ($this->mysqli->connect_errno) {
			echo "connect error";
			exit ();
		} else {
			mysqli_set_charset ( $this->mysqli, $this->charset );
		}
	}
	function getInput(){
		$this->input = [];
		if($_GET["hasPrevious"] === "false"){
			$this->input["hasPrevious"] = false;
		}else{
			$this->input["hasPrevious"] = true;
		}
		if(isset($_GET["before"])){
			if($_GET["before"] !== ""){
				$this->input["before"] = $_GET["before"];
			}
		}
		if(isset($_GET["key"])){
			if($_GET["key"] !== ""){
				$this->input["key"] = $_GET["key"];
			}
		}
		$this->input["language"] = $_GET["language"];
		$this->input["project"] = $_GET["project"];
		return $this->input;
	}
	function saveData(){
		if(!$this->input["hasPrevious"]){
			$sql = "SELECT `id` FROM `suggestion` WHERE `mot`='".addslashes ($this->input["key"])."' AND `langue`='".addslashes ($this->input["language"])."' AND `projet`='".addslashes ($this->input["project"])."'";
			$id = null;
			if (! $result = $this->mysqli->query ( $sql )) {
				echo "erreur no previous select";
				exit ();
			} else {
				if ($result->num_rows === 0) {
					$add = true;
				} else {
					$add = false;
					$id = $result->fetch_assoc ()["id"];
				}
			}
			if($add){
				$sql = "INSERT INTO `suggestion` (`mot`, `langue`, `frequence`, `projet`)
    VALUES ('" . addslashes ($this->input["key"]) . "','" . addslashes ($this->input["language"]) . "',1," . addslashes ($this->input["project"]) . ");";
				$id = null;
				if (! $result = $this->mysqli->query ( $sql )) {
					echo "erreur no previous insert";
					exit ();
				} else {
					$id = mysqli_insert_id($this->mysqli);
					echo "inserted(no previous) : ".$id." : ".$this->input["key"];
				}
			}else{
				$sql = "UPDATE `suggestion` SET `frequence` = `frequence`+1 WHERE `id` = ".$id.";";
				if (! $result = $this->mysqli->query ( $sql )) {
					echo "erreur no previous update";
					exit ();
				} else {
					echo "updated(no previous) : ".$id." : ".$this->input["key"];
				}
			}
		}else{
			$sql = "SELECT `id` FROM `suggestion` WHERE `mot`='".addslashes ($this->input["before"])."' AND `langue`='".addslashes ($this->input["language"])."' AND `projet`='".addslashes ($this->input["project"])."'";
			$id = null;
			if (! $result = $this->mysqli->query ( $sql )) {
				echo "erreur previous select";
				exit ();
			} else {
				if ($result->num_rows === 0) {
					$add = true;
				} else {
					$add = false;
					$id = $result->fetch_assoc ()["id"];
				}
			}
			if($add){
				$sql = "INSERT INTO `suggestion` (`mot`, `langue`, `frequence`, `projet`)
    VALUES ('".addslashes ($this->input["before"])."','" . addslashes ($this->input["language"]) . "',1," . addslashes ($this->input["project"]) . ");";
				$id = null;
				if (! $result = $this->mysqli->query ( $sql )) {
					echo "erreur previous insert";
					exit ();
				} else {
					$id = mysqli_insert_id($this->mysqli);
					echo "inserted(previous) : ".$id." : ".$this->input["before"];
				}
			}else{
				$sql = "UPDATE `suggestion` SET `frequence` = `frequence`+1 WHERE `id` = ".$id.";";
				if (! $result = $this->mysqli->query ( $sql )) {
					echo "erreur previous update";
					exit ();
				} else {
			       echo "updated(previous) : ".$id." : ".$this->input["before"];
				}
			}
			if($id !== null){
				$sql = "SELECT `id` FROM `suggestion` WHERE `mot`='".addslashes ($this->input["key"])."' AND `langue`='".addslashes ($this->input["language"])."' AND `projet`='".addslashes ($this->input["project"])."'";
				$id1 = null;
				if (! $result = $this->mysqli->query ( $sql )) {
					echo "erreur pervious select new";
					exit ();
				} else {
					if ($result->num_rows === 0) {
						$add = true;
					} else {
						$add = false;
						$id1 = $result->fetch_assoc ()["id"];
					}
				}
				if($add){
					$sql = "INSERT INTO `suggestion` (`mot`, `langue`, `frequence`, `projet`)
    VALUES ('" . addslashes ($this->input["key"]) . "','" . addslashes ($this->input["language"]) . "',1," . addslashes ($this->input["project"]) . ");";
					$id1 = null;
					if (! $result = $this->mysqli->query ( $sql )) {
						echo "erreur previous insert new";
						exit ();
					} else {
						$id1 = mysqli_insert_id($this->mysqli);
						echo "inserted(previous) new : ".$id1." : ".$this->input["key"];
					}
				}else{
					$sql = "UPDATE `suggestion` SET `frequence` = `frequence`+1 WHERE `id` = ".$id1.";";
					if (! $result = $this->mysqli->query ( $sql )) {
						echo "erreur";
						exit ();
					} else {
						echo "updated(previous) new : ".$id1." : ".$this->input["key"];
					}
				}
				if($id1 !== null){
					// **********************************
					$sql = "SELECT `id` FROM `successeur` WHERE `mot1`=".$id." AND `mot2`=".$id1." AND `langue`='".addslashes ($this->input["language"])."' AND `projet`='".addslashes ($this->input["project"])."'";
					$id2 = null;
					if (! $result = $this->mysqli->query ( $sql )) {
						echo "erreur pervious select successeur";
						exit ();
					} else {
						if ($result->num_rows === 0) {
							$add = true;
						} else {
							$add = false;
							$id2 = $result->fetch_assoc ()["id"];
						}
					}
					if($add){
						$sql = "INSERT INTO `successeur` (`mot1`,`mot2`,`frequence`, `langue` , `projet`)
    VALUES (".$id.",".$id1.",1,'" . addslashes ($this->input["language"]) . "'," . addslashes ($this->input["project"]) . ");";
						$id2 = null;
						if (! $result = $this->mysqli->query ( $sql )) {
							echo $sql;
							echo "erreur previous insert successeur";
							exit ();
						} else {
							$id2 = mysqli_insert_id($this->mysqli);
							echo "inserted(previous) successeur : ".$id2." : ".$id." : ".$this->input["before"].", ".$id1." : ".$this->input["key"];
						}
					}else{
						$sql = "UPDATE `successeur` SET `frequence` = `frequence`+1 WHERE `id` = ".$id2.";";
						if (! $result = $this->mysqli->query ( $sql )) {
							echo $sql;
							echo "erreur(previous) update successeur";
							exit ();
						} else {
							echo "updated(previous) successeur : ".$id2." : ".$id." : ".$this->input["before"].", ".$id1." : ".$this->input["key"];
						}
					}
					// **********************************
				}
			}
		}
	}
}
$handler = new PersistSuggestion ();
//var_dump($handler->getInput());
/*// First word then enter
array(4) { ["hasPrevious"]=> bool(false) ["key"]=> string(4) "face" ["language"]=> string(2) "fr" ["project"]=> string(1) "1" }
//First Word is suggestion
array(4) { ["hasPrevious"]=> bool(false) ["key"]=> string(8) "facebook" ["language"]=> string(2) "fr" ["project"]=> string(1) "1" }
//First word, space then second word
array(5) { ["hasPrevious"]=> bool(true) ["before"]=> string(5) "face " ["key"]=> string(4) "taki" ["language"]=> string(2) "fr" ["project"]=> string(1) "1" }
//first, second then suggestion
array(5) { ["hasPrevious"]=> bool(true) ["before"]=> string(4) "taki" ["key"]=> string(10) "traduction" ["language"]=> string(2) "fr" ["project"]=> string(1) "1" }
*/

?>