var application = angular.module('application', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
application.controller("controller", function($scope, $http) {
	$scope.configuration = {
			projects:{
				current:null,
				feed:[
					{id:"1",
					 value:"Projet1",
					 default:true
					},
					{id:"2",
					 value:"Projet2",
					 default:false
					},
					{id:"3",
					 value:"Projet3",
					 default:false
					}
				]
			},
			languages:{
				current:null,
				feed:[
					{id:"ar",
					 value:"Arabic",
					 default:false
					},
					{id:"fr",
					 value:"Frensh",
					 default:true
					}
				]
	        }
	};
    $scope.suggestions = {
    		data:{
	    		databaseSuggestions:[],
	    		yamliSuggestions:[],
	    		googleSuggestions:[]
    		},
    		max:{
    			DataBase:3,
    			Yamli:1,
    			Google:2
    		},
    		vars:{
    			delimiterPresent:false,
    			inputRTL:false,
    			arabicRegEx:/[\u0600-\u06FF\u0750-\u077F\ufb50-\ufc3f\ufe70-\ufefc]+/,
    			frenchRegEx:/[A-Za-z]+/,
    			initialized:false,
    			fullText:null,
    			inputID:null,
    			words:null,
    			last:null,
    			feed:null,
    			hasPrevious:false,
    			predecessor:null,
    			shouldSuggest:false,
    			isSuggesting:false,
    			isSaving:false,
    			selected:null,
    			selectedString:null,
    			toDeselect:null,
    			isDefault:true,
    			fixed:null,
    			lastReplaced:null,
    			lastSelected:null,
    			canRestore:false,
    			replace:true
    		},
    		functions:{
    			getGoogleSuggestions:null,
    			getYamliSuggestions:null,
    			getDataBaseSuggestions:null,
    			updateSuggestions:null,
    			getSuggestions:null,
    			useSuggestion:null,
    			persistSuggestion:null
    		}
    };
    $scope.events = {
    		codes:{
    		    arrowDown:40,
    		    arrowUp:38,
    		    ctrl:17,
    		    space:32,
    		    echap:27,
    			enter:13,
    		    backSpace:8,
    		    pageUp:33,
    		    pageDown:34,
    		    shortcuts:[49, 50, 51, 52, 53, 54, 55, 56, 57],
    		},
    		happened:{
    			keyDown:{
    				first:null,
    				second:null
    			},
    			keyReleased:null,
    			KeyPressed:null,
    			combinations:null,
    			selection:{
    				selectionStart:null,
    				selectionEnd:null
    			},
    			numbers:{
    				space:0,
    				enter:0,
    				echap:0
    			}
    		},
    		functions:{
    			updateOnChange:null,
    			onChange:null,
    			onKeyDown:null,
    			onKeyUp:null,
    			onKeyPress:null,
    			onClickText:null,
    			onClickSuggestion:null,
    			getKeyboardEvent:null,
    			shortcutDetected:null,
    			spaceDetected:null,
    			backSpaceDetected:null
    		},
    		updating:false
    };
 
  $scope.$watchCollection('suggestions.data', function () {
	 /* if($scope.suggestions.vars.toDeselect !== null){
		if($scope.suggestions.vars.toDeselect.source === "google"){
			$scope.suggestions.data.googleSuggestions[$scope.suggestions.vars.toDeselect.source.index].selected = false;
		}else if($scope.suggestions.vars.toDeselect.source === "yamli"){
			$scope.suggestions.data.yamliSuggestions[$scope.suggestions.vars.toDeselect.source.index].selected = false;
		}else{
			$scope.suggestions.data.databaseSuggestions[$scope.suggestions.vars.toDeselect.source.index].selected = false;
		}
		$scope.suggestions.vars.toDeselect = null;
	  }*/
	  /*
		 * angular.forEach($scope.suggestions.data, function (value, key) {
		 * 
		 * });
		 */
  });
 
    $scope.checkLanguage = function(){
    	if($scope.suggestions.vars.inputRTL){
    		$scope.configuration.languages.current = "ar";
    	}else{
    		$scope.configuration.languages.current = "fr";
    	}
        /*if (typeof($scope.suggest.QueryLanguageModel) === 'undefined') {
        	for(var i=0;i<$scope.configuration.languages.feed.length;i++){
        		if($scope.configuration.languages.feed[i].default === true){
        			document.getElementById('suggest.QueryLanguageID').selectedIndex = i+1;
        			$scope.suggest.QueryLanguageModel = $scope.configuration.languages.feed[i].id;
        			$scope.configuration.languages.current = $scope.configuration.languages.feed[i].id
        		}
        	}
        }*/
        if (typeof($scope.suggest.ProjectModel) === 'undefined') {
			document.getElementById('suggest.ProjectID').selectedIndex = 1;
			$scope.suggest.ProjectModel = "1";
			$scope.configuration.projects.current = "1";
        }
    };

    /*
	 * $scope.test = function($inputID){ if($scope.suggestions.vars.initialized
	 * === false){ document.getElementById($inputID).addEventListener('click',
	 * $scope.events.functions.onClickText()); } }
	 */
    $scope.events.functions.getKeyboardEvent = function(keyEvent, keyEventDesc) {
        return (window.event ? keyEvent.keyCode : keyEvent.which);
    };
    $scope.events.functions.updateOnChange = function() {
    	$scope.suggestions.vars.fullText = document.getElementById($scope.suggestions.vars.inputID).value;
        var filterVoids = function (element,index,array) {
        	if(array.length === 1 && element === ""){
        		return false;
        	}
        	else if(index === 0){
        		return true;
        	}else if(index < array.length-1){
        		if(element === "") return false;
        		else return true;
        	}else return true;
        };
        var filterDelimiters = function (element,index,array) {
        	if(element === "," || element === "."){
        		if($scope.suggestions.vars.delimiterPresent) {return false;}
        		else {$scope.suggestions.vars.delimiterPresent = true;return true;}
        	}else {$scope.suggestions.vars.delimiterPresent = false;return true;}
        };
        $scope.suggestions.vars.words = document.getElementById($scope.suggestions.vars.inputID).value.split(/[\n]+/).join(" . ").split(/[\s]+/).join(" ").split(/[.]+/).join(" . ").split(/[,]+/).join(" , ").split(" ").filter(filterVoids);
        $scope.suggestions.vars.words = $scope.suggestions.vars.words.filter(filterDelimiters);
        if($scope.suggestions.vars.words.length>1){
        	if($scope.suggestions.vars.words[0] === ""){
        		$scope.suggestions.vars.words.shift();
        	}
        	if($scope.suggestions.vars.words[0] === "." || $scope.suggestions.vars.words[0] === ","){
        		$scope.suggestions.vars.words.shift();
        	}
        	if($scope.suggestions.vars.words[0] === ""){
        		$scope.suggestions.vars.words.shift();
        	}
        }
        if($scope.suggestions.vars.words.length>1){
        	if($scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1] === "" && $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2] === ""){
        		$scope.suggestions.vars.words.pop();
        	}
        }
        //$scope.suggestions.vars.isArabic = arabic.exec($scope.suggestions.vars.fullText);
        // Traitement
        // ["face",".",""]["face","ta"]
        if($scope.suggestions.vars.words.length == 1){
        	if($scope.suggestions.vars.words[0].length > 0){
        		$scope.suggestions.vars.shouldSuggest = true;
        		$scope.suggestions.vars.isSaving = false;
            	$scope.suggestions.vars.feed = $scope.suggestions.vars.words[0];
            	$scope.suggestions.vars.replace = true;
            	$scope.suggestions.vars.hasPrevious = false;
            	$scope.suggestions.vars.predecessor = null;
        	}else{
        		$scope.suggestions.vars.shouldSuggest = false;
        		$scope.suggestions.vars.replace = false;
        		$scope.suggestions.vars.isSaving = false;
            	$scope.suggestions.vars.feed = null;
            	$scope.suggestions.vars.hasPrevious = false;
            	$scope.suggestions.vars.predecessor = null;
        	}
        }else{
        	if($scope.suggestions.vars.words.length > 1){
        		if($scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1] === ""){
        			if($scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2] === "," || $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2] === "."){
                		$scope.suggestions.vars.shouldSuggest = false;
                		$scope.suggestions.vars.isSaving = false;
                		$scope.suggestions.vars.replace = false;
                    	$scope.suggestions.vars.feed = null;
                    	$scope.suggestions.vars.hasPrevious = false;
                    	$scope.suggestions.vars.predecessor = null;
                    	if($scope.suggestions.vars.words.length-4 >= 0){
                        	$scope.suggestions.vars.feed = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-3];
                        	if($scope.suggestions.vars.words[$scope.suggestions.vars.words.length-4] !== "," && $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-4] !== "." ){
                            	$scope.suggestions.vars.hasPrevious = true;
                            	$scope.suggestions.vars.predecessor = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-4];
                        	}
                    	}if($scope.suggestions.vars.words.length-3 >= 0){
                    		$scope.suggestions.vars.shouldSuggest = false;
                    		$scope.suggestions.vars.isSaving = true;
                        	$scope.suggestions.vars.feed = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-3];
                    	}
        			}else{
                		$scope.suggestions.vars.shouldSuggest = true;
                		$scope.suggestions.vars.replace = false;
                		$scope.suggestions.vars.isSaving = false;
                    	$scope.suggestions.vars.feed = null;
                    	$scope.suggestions.vars.hasPrevious = true;
                    	$scope.suggestions.vars.predecessor = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2];
        			}
        		}else{
            		$scope.suggestions.vars.shouldSuggest = true;
            		$scope.suggestions.vars.isSaving = false;
            		$scope.suggestions.vars.replace = false;
                	$scope.suggestions.vars.feed = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1];
        			if($scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2] === "," || $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2] === "."){
        				$scope.suggestions.vars.hasPrevious = false;
                    	$scope.suggestions.vars.predecessor = null;
        			}else{
                    	$scope.suggestions.vars.hasPrevious = true;
                    	$scope.suggestions.vars.predecessor = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-2];
        			}
        		}
        	}else{
        		$scope.suggestions.vars.shouldSuggest = false;
        		$scope.suggestions.vars.replace = false;
        		$scope.suggestions.vars.isSaving = false;
            	$scope.suggestions.vars.feed = null;
            	$scope.suggestions.vars.hasPrevious = false;
            	$scope.suggestions.vars.predecessor = null;
        	}
        }
		if($scope.suggestions.vars.selected !== null){
			if($scope.suggestions.vars.selected.source === "google" && $scope.suggestions.data.googleSuggestions.length === 0){
				$scope.suggestions.vars.selected = null;
			}
			if($scope.suggestions.vars.selected.source === "yamli" && $scope.suggestions.data.yamliSuggestions.length === 0){
				$scope.suggestions.vars.selected = null;
			}
			if($scope.suggestions.vars.selected.source === "database" && $scope.suggestions.data.databaseSuggestions.length === 0){
				$scope.suggestions.vars.selected = null;
			}
		}
    };
	$scope.suggestions.functions.updateSuggestions = function($bool,$data,$source){
		if($bool){
			if($scope.suggestions.vars.shouldSuggest){
				if($source === "database"){
					if($data.database.length > 0){
						var length = $scope.suggestions.max.DataBase;
						if($data.database.length < length){
							length = $data.database.length;
						}
						for(var i =0;i<length;i++){
							$scope.suggestions.data.databaseSuggestions[i] = {id:$data.database[i].value.id,value: $data.database[i].value.value,source: $data.database[i].source,selected:false,type: $data.database[i].type,index:i};
						}
						$scope.suggestions.vars.isSuggesting = true;
					}else{
						$scope.suggestions.data.databaseSuggestions = [];
					}
				}if($source === "google"){
					if($scope.suggestions.vars.feed !== null){
						if($data.length > 0){
							var length = $scope.suggestions.max.Google;
							if($data.length < length){
								length = $data.length;
							}
							for(var i =0;i<length;i++){
								$scope.suggestions.data.googleSuggestions[i] = {value: $data[i],source: "google",selected:false,index:i};
							}
							$scope.suggestions.vars.isSuggesting = true;
						}else{
							$scope.suggestions.data.googleSuggestions = [];
						}
					}else{
						$scope.suggestions.data.googleSuggestions = [];
					}
				}if($source === "yamli"){
					if($scope.suggestions.vars.feed !== null && $scope.configuration.languages.current === "ar"){
						if($data.length > 0){
							var length = $scope.suggestions.max.Yamli;
							if($data.length < length){
								length = $data.length;
							}
							for(var i =0;i<length;i++){
								$scope.suggestions.data.yamliSuggestions[i] = {value: $data[i],source: "yamli",selected:false,index:i};
							}
							$scope.suggestions.vars.isSuggesting = true;
						}else{
							$scope.suggestions.data.yamliSuggestions = [];
						}
					}else{
						$scope.suggestions.data.yamliSuggestions = [];
					}
				}
			}else{
				if($source === "database"){
					$scope.suggestions.data.databaseSuggestions = [];
				}
				if($source === "google"){
					$scope.suggestions.data.googleSuggestions = [];
				}
				if($source === "yamli"){
					$scope.suggestions.data.yamliSuggestions = [];
				}
				if($scope.suggestions.data.databaseSuggestions.length === 0 && $scope.suggestions.data.googleSuggestions.length === 0 && $scope.suggestions.data.yamliSuggestions.length === 0){
					$scope.suggestions.vars.isSuggesting = false;
				}
			}
		}else{
			if($source === "database"){
				$scope.suggestions.data.databaseSuggestions = [];
			}
			if($source === "google"){
				$scope.suggestions.data.googleSuggestions = [];
			}
			if($source === "yamli"){
				$scope.suggestions.data.yamliSuggestions = [];
			}
			if($scope.suggestions.data.databaseSuggestions.length === 0 && $scope.suggestions.data.googleSuggestions.length === 0 && $scope.suggestions.data.yamliSuggestions.length === 0){
				$scope.suggestions.vars.isSuggesting = false;
			}
		}
		if($scope.events.happened.numbers.echap === 0){
	        if($scope.suggestions.data.databaseSuggestions.length > 0){
	        	$scope.suggestions.vars.selected = {value:$scope.suggestions.data.databaseSuggestions[0].value,source:$scope.suggestions.data.databaseSuggestions[0].source,selected:"default",index:$scope.suggestions.data.databaseSuggestions[0].index};
	        }else if($scope.suggestions.data.yamliSuggestions.length > 0){
	        	$scope.suggestions.vars.selected = {value:$scope.suggestions.data.yamliSuggestions[0].value,source:$scope.suggestions.data.yamliSuggestions[0].source,selected:"default",index:$scope.suggestions.data.yamliSuggestions[0].index};
	        }else if($scope.suggestions.data.googleSuggestions.length > 0){
	        	$scope.suggestions.vars.selected = {value:$scope.suggestions.data.googleSuggestions[0].value,source:$scope.suggestions.data.googleSuggestions[0].source,selected:"default",index:$scope.suggestions.data.googleSuggestions[0].index};
	        }else{
	        	$scope.suggestions.vars.selected = null;
	        }
		}
	};
	$scope.suggestions.functions.getSuggestions = function(){
		$scope.suggestions.functions.getDataBaseSuggestions();
		$scope.suggestions.functions.getYamliSuggestions();
		$scope.suggestions.functions.getGoogleSuggestions();
	};
	$scope.suggestions.functions.useSuggestion = function(){
		document.getElementById($scope.suggestions.vars.inputID).focus();
    	$scope.suggestions.vars.selected = {value:$scope.suggestions.vars.selected.value,source:$scope.suggestions.vars.selected.source,selected:"manual",index:$scope.suggestions.vars.selected.index};;
	    $scope.suggestions.vars.lastReplaced = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1];
	    $scope.suggestions.vars.lastSelected = $scope.suggestions.vars.selected;
    	if($scope.suggestions.vars.replace === true){
	    	document.getElementById($scope.suggestions.vars.inputID).value = $scope.suggestions.vars.selected.value+" ";
	    	$scope.suggestions.vars.canRestore = true;
	    }else{
	    	if($scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1] === ""){
	    		document.getElementById($scope.suggestions.vars.inputID).value += $scope.suggestions.vars.selected.value;
	    	}else{
	    		document.getElementById($scope.suggestions.vars.inputID).value = document.getElementById($scope.suggestions.vars.inputID).value.slice(0,document.getElementById($scope.suggestions.vars.inputID).value.length - $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1].length) + $scope.suggestions.vars.selected.value+" ";
	    	}
	    	$scope.suggestions.vars.canRestore = true;
	    }
    	
    	$scope.suggestions.vars.selected = null;
    	$scope.events.functions.updateOnChange();
    	$scope.events.functions.onChange($scope.suggest.ProjectModel,$scope.suggestions.vars.inputID);
    	$scope.suggestions.functions.getSuggestions();
	};
	
	// database suggestions begins
	$scope.suggestions.functions.persistSuggestion = function(){
		var params = "?hasPrevious="+$scope.suggestions.vars.hasPrevious+"&before="+$scope.suggestions.vars.predecessor+"&"+"key="+$scope.suggestions.vars.feed+"&language="+$scope.configuration.languages.current+"&project="+$scope.configuration.projects.current;
		var url = "resources/PHP/PersistSuggestion.php"+params;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
			//$scope.persisted = response.data;
        }, function errorCallback(response) {
        	//$scope.persisted = response;
        });
	}
	$scope.suggestions.functions.getDataBaseSuggestions = function(){
		
		/*if($scope.suggestions.vars.isSaving){

		}else{
			if($scope.suggestions.vars.shouldSuggest){*/
				if($scope.suggestions.vars.feed === null && $scope.suggestions.vars.hasPrevious === false){
					$scope.suggestions.functions.updateSuggestions(false,null,"database");
				}else{
					var params = "?before="+$scope.suggestions.vars.predecessor+"&key="+$scope.suggestions.vars.feed+"&language="+$scope.configuration.languages.current+"&project="+$scope.configuration.projects.current;
					var url = "resources/PHP/GetDataBaseSuggestions.php"+params;
					
			        $http({
			            method: 'GET',
			            url: url
			        }).then(function successCallback(response) {
						$scope.suggestions.functions.updateSuggestions(true,response.data,"database");
			        }, function errorCallback(response) {
						$scope.suggestions.functions.updateSuggestions(false,null,"database");
			        });
				}
			//}
		//}

	};
	// database suggestions ends
	
    // google suggestions begins
	$scope.suggestions.functions.getGoogleSuggestions = function(){
		if($scope.suggestions.vars.shouldSuggest && $scope.suggestions.vars.feed != null){
			var params = "?feed="+$scope.suggestions.vars.feed+"&language="+$scope.configuration.languages.current;
			var url = "resources/PHP/GetGoogleSuggestions.php"+params;
	        $http({
	            method: 'GET',
	            url: url
	        }).then(function successCallback(response) {
	            // if (response.data.length > 0 && !(response.data.length === 4
				// && response.data.indexOf("null") === 0)) {
	        	$scope.suggestions.functions.updateSuggestions(true,response.data,"google");
	            // } else {
	            	// $scope.updateSuggestions(false,response.data,"google");
	            // }
	        }, function errorCallback(response) {
	        	$scope.suggestions.functions.updateSuggestions(false,response,"google");
	        });
		}else{
			$scope.suggestions.data.googleSuggestions = [];
		}

	};
    // google suggestions ends
    // yamli suggestions begins
	$scope.suggestions.functions.getYamliSuggestions = function(){
		if($scope.suggestions.vars.shouldSuggest && $scope.suggestions.vars.feed != null && $scope.configuration.languages.current === "ar"){
			var url = "resources/PHP/GetYamliSuggestions.php?feed="+$scope.suggestions.vars.feed;
	        $http({
	            method: 'GET',
	            url: url
	        }).then(function successCallback(response) {
	        	$scope.suggestions.functions.updateSuggestions(true,response.data,"yamli");
	        }, function errorCallback(response) {
	        	$scope.suggestions.functions.updateSuggestions(false,response,"yamli");
	        });
		}else{
			$scope.suggestions.data.yamliSuggestions = [];
		}

	};
    // yamli suggestions ends
    $scope.events.functions.spaceDetected = function($event){
    	if(($scope.events.happened.keyDown.first !== null) && ($scope.events.happened.keyDown.first === $scope.events.codes.space)){
    		$scope.events.happened.numbers.space++;
            if($scope.suggestions.vars.selected !== null){
        	    $scope.suggestions.vars.lastReplaced = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1];
        	    $scope.suggestions.vars.lastSelected = $scope.suggestions.vars.selected;
        	    if($scope.suggestions.vars.replace === true){
        	    	document.getElementById($scope.suggestions.vars.inputID).value = $scope.suggestions.vars.selected.value;
        	    	$scope.suggestions.vars.canRestore = true;
        	    }else{
    	    		document.getElementById($scope.suggestions.vars.inputID).value = document.getElementById($scope.suggestions.vars.inputID).value.slice(0,document.getElementById($scope.suggestions.vars.inputID).value.length - $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1].length) + $scope.suggestions.vars.selected.value;
    	    		$scope.suggestions.vars.canRestore = true;
        	    }
    	    	$scope.suggestions.vars.selected = null;
    	    	$scope.events.functions.updateOnChange();
    	    	$scope.events.functions.onChange($scope.suggest.ProjectModel,$scope.suggestions.vars.inputID);
    	    	$scope.suggestions.functions.getSuggestions();
            }else{
            	$scope.suggestions.vars.canRestore = false;
            }
            $scope.suggestions.functions.persistSuggestion();
    	}else{
    		$scope.events.happened.numbers.space=0;
    		if(($scope.events.happened.keyDown.first !== null) && ($scope.events.happened.keyDown.first !== $scope.events.codes.backSpace)){
    			$scope.suggestions.vars.canRestore = false;
    		}
    	}
    };
    $scope.events.functions.backSpaceDetected = function($event){
    	if(($scope.events.happened.keyDown.first !== null) && ($scope.events.happened.keyDown.first === $scope.events.codes.backSpace)){
    		if($scope.suggestions.vars.canRestore === true){
    			//alert(document.getElementById($scope.suggestions.vars.inputID).value.length+" : "+$scope.suggestions.vars.lastSelected.value.length)
	    		$scope.suggestions.vars.canRestore = false;
	    		if($scope.suggestions.vars.words.length == 2 && $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1] === ""){
		    		document.getElementById($scope.suggestions.vars.inputID).value = $scope.suggestions.vars.lastReplaced+" ";
	    		}else{
		    		document.getElementById($scope.suggestions.vars.inputID).value = document.getElementById($scope.suggestions.vars.inputID).value.slice(0,document.getElementById($scope.suggestions.vars.inputID).value.length - $scope.suggestions.vars.lastSelected.value.length-1) + $scope.suggestions.vars.lastReplaced+" ";
	    		}
	    		$scope.suggestions.vars.selected = null;
		    	$scope.events.functions.updateOnChange();
		    	$scope.events.functions.onChange($scope.suggest.ProjectModel,$scope.suggestions.vars.inputID);
		    	$scope.suggestions.functions.getSuggestions();
    		}
    	}
    };
    // bug en enter with no suggestion selected doesn't refresh, works only after 2 times echap
    $scope.events.functions.enterDetected = function($event){
    	if(($scope.events.happened.keyDown.first !== null) && ($scope.events.happened.keyDown.first === $scope.events.codes.enter)){
    		$scope.events.happened.numbers.enter+=2;
            if($scope.suggestions.vars.selected !== null){
				if ($event.preventDefault) {
					$event.preventDefault();
				}
        	    $scope.suggestions.vars.lastReplaced = $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1];
        	    $scope.suggestions.vars.lastSelected = $scope.suggestions.vars.selected;
        	    if($scope.suggestions.vars.replace === true){
        	    	document.getElementById($scope.suggestions.vars.inputID).value = $scope.suggestions.vars.selected.value+" ";
        	    	$scope.suggestions.vars.canRestore = true;
        	    }else{
    	    		document.getElementById($scope.suggestions.vars.inputID).value = document.getElementById($scope.suggestions.vars.inputID).value.slice(0,document.getElementById($scope.suggestions.vars.inputID).value.length - $scope.suggestions.vars.words[$scope.suggestions.vars.words.length-1].length) + $scope.suggestions.vars.selected.value+" ";
    	    		$scope.suggestions.vars.canRestore = true;
        	    }
    	    	$scope.suggestions.vars.selected = null;
    	    	$scope.events.functions.updateOnChange();
    	    	$scope.events.functions.onChange($scope.suggest.ProjectModel,$scope.suggestions.vars.inputID);
    	    	$scope.suggestions.functions.getSuggestions();
            }else{
            	$scope.suggestions.vars.selected = null;
            	$scope.suggestions.vars.canRestore = false;
    	    	$scope.events.functions.updateOnChange();
    	    	$scope.events.functions.onChange($scope.suggest.ProjectModel,$scope.suggestions.vars.inputID);
    	    	$scope.suggestions.functions.getSuggestions();
    	    	
            }
            $scope.suggestions.functions.persistSuggestion();
    	}else{
    		$scope.events.happened.numbers.enter=0;
    	}
    };
    
    $scope.events.functions.echapDetected = function($event){
    	if(($scope.events.happened.keyDown.first !== null) && ($scope.events.happened.keyDown.first === $scope.events.codes.echap)){
    		$scope.events.happened.numbers.echap++;
    		// cancel selection
    		$scope.events.functions.onClickText();
    	}else{
    		$scope.events.happened.numbers.echap=0;
    	}
    };
    $scope.events.functions.shortcutDetected = function($event){
    	if((($scope.events.happened.keyDown.first === $scope.events.codes.ctrl) || ($scope.events.happened.keyDown.second === $scope.events.codes.ctrl)) && (($scope.events.codes.shortcuts.indexOf($scope.events.happened.keyDown.first) !== -1) || ($scope.events.codes.shortcuts.indexOf($scope.events.happened.keyDown.second) !== -1))){
			var blockShortcut = false;
			if ((($scope.events.happened.keyDown.first === $scope.events.codes.ctrl) || ($scope.events.happened.keyDown.second === $scope.events.codes.ctrl)) && (($scope.events.codes.shortcuts.indexOf($scope.events.happened.keyDown.first) !== -1) || ($scope.events.codes.shortcuts.indexOf($scope.events.happened.keyDown.second) !== -1))) {
				blockShortcut = true;
				if (blockShortcut) {
					if ($event.preventDefault) {
						$event.preventDefault();
					}
				}
				// alert("shortcut");
				var indexOf = $scope.events.codes.shortcuts.indexOf($scope.events.happened.keyDown.first);
				if(indexOf === -1){
					indexOf = $scope.events.codes.shortcuts.indexOf($scope.events.happened.keyDown.second);
				}
				// do Suggestion
				
				// do Suggestion
				if ($scope.events.happened.combinations === null) {
					$scope.events.happened.combinations = "(" + $scope.events.happened.keyDown.first + " + " + $scope.events.happened.keyDown.second + ") "+indexOf;
				} else {
					$scope.events.happened.combinations += ", (" + $scope.events.happened.keyDown.first + " + " + $scope.events.happened.keyDown.second + ") "+indexOf;
				}
			}
    	}else{
    		if(($scope.events.happened.keyDown.first !== null) && ($scope.events.happened.keyDown.second !== null)){
    			$scope.events.happened.keyDown.first = null;
    			$scope.events.happened.keyDown.second = null;
    		}
    	}
    };
    $scope.events.functions.onChange = function($project,$inputID){
    	$scope.configuration.projects.current = $project;
    	//$scope.suggestions.vars.fullText = $input;
    	$scope.suggestions.vars.inputID = $inputID;
    	document.getElementById($scope.suggestions.vars.inputID).focus();
    	$scope.checkLanguage();
    	$scope.events.functions.updateOnChange();
    	$scope.suggestions.functions.getSuggestions();
    };
    // on key down event
    $scope.events.functions.onKeyDown = function($event){
        if ($scope.events.happened.keyDown.first !== null) {
            if ($scope.events.functions.getKeyboardEvent($event, "Key down") !== $scope.events.happened.keyDown.first) {
            	$scope.events.happened.keyDown.second = $scope.events.functions.getKeyboardEvent($event, "Key down");
            }
        }
        if ($scope.events.happened.keyDown.first === null) {
        	$scope.events.happened.keyDown.second = null;
        	$scope.events.happened.keyDown.first = $scope.events.functions.getKeyboardEvent($event, "Key down");
        }
        $scope.events.functions.shortcutDetected($event);
        $scope.events.functions.spaceDetected($event);
        $scope.events.functions.backSpaceDetected($event);
        $scope.events.functions.enterDetected($event);
        $scope.events.functions.echapDetected($event);
    };
    // on key up event
    $scope.events.functions.onKeyUp = function($event){
        if ($scope.events.functions.getKeyboardEvent($event, "Key up") === $scope.events.happened.keyDown.first) {
        	$scope.events.happened.keyDown.first = null;
        }
        if ($scope.events.functions.getKeyboardEvent($event, "Key up") === $scope.events.happened.keyDown.second) {
        	$scope.events.happened.keyDown.second = null;
        }
        if($scope.events.happened.numbers.space <= 1 && $scope.events.happened.numbers.enter<=1){
        	$scope.events.functions.updateOnChange();
        	// Autre traitement ICI
        	$scope.suggestions.functions.getSuggestions();
        	// Autre traitement ICI
        	$scope.events.updating = true;
        }else{
        	$scope.events.updating = false;
        }
    };
    // on key press event
    $scope.events.functions.onKeyPress = function($event){
    	
    };
    // on click event
    $scope.events.functions.onClickText = function(){
    	$scope.suggestions.vars.selected = null;
    };
});