<?php

/*

	SIMPLE WEB ENGINE ver.25-11-2012
	--------------------------------
	(c)2012 Krzysztof Jankowski .com

*/

session_start();

if(!isset($_GET['nav'])){
		$_GET['nav'] = 'home';
	}

function pwd(){
	return $_GET['nav'];
}

function article(){ 
	if(isset($_GET['nav'])){
		if(file_exists('www/'.$_GET['nav'].'.html')){			

				include ('www/'.$_GET['nav'].'.html');

		}else{
			include ('www/error.html');
		}
	}
}

function element($name){
	include ('www/'.$name.'.html');
}

function isActive($name){
	if( $name == pwd() ){
		echo 'active';
	}
}

function db_con(){
	$link = mysql_connect(localhost,'xxx','xxx');
	mysql_set_charset('utf8',$link);
	@mysql_select_db('xxx') or die( "Unable to select database");
}

function db_die(){
	mysql_close();
}
	
function db_query($query){
	db_con();
	return mysql_query($query);
	db_die();
}


function getRandomPhoto(){
	mt_srand((double)microtime()*1000);
	$photodir = dir('img/ads/');
	
	while ($file = $photodir->read()) {
		if (eregi("gif", $file) || eregi("jpg", $file) || eregi("png", $file))
		$photolist .= "$file ";
	} 
	closedir($photodir->handle);
	
	$photolist = explode(" ", $photolist);
	$photo = $photolist[mt_rand(0, (sizeof($photolist)-2))];
	if ($photo) {
		return $photo;
	}else{
		return null;
	}
} 


function isFree($photo){
	$filename = 'photos/'.$photo;
	
	if(date("Ymd") == date ("Ymd", filemtime($filename))){
		return true;
	}else{
		return false;
	}
}

function RandomFile($folder='', $extensions='.*', $id){
 	
    // fix path:
    $folder = trim($folder);
    $folder = ($folder == '') ? './' : $folder;
 
    // check folder:
    if (!is_dir($folder)){ die('invalid folder given!'); }
 
    // create files array
    $files = array();
 
    // open directory
    if ($dir = @opendir($folder)){
 
        // go trough all files:
        while($file = readdir($dir)){
 
            if (!preg_match('/^\.+$/', $file) and 
                preg_match('/\.('.$extensions.')$/', $file)){
	                	$files[] = $file;                
            }            
        }        
        // close directory
        closedir($dir);    
    }
    else {
        die('Could not open the folder "'.$folder.'"');
    }
 
    if (count($files) == 0){
        die('No files where found :-(');
    }
 
    // seed random function:
    mt_srand((double)microtime()*1000000);
    
    // get an random index:
    $rand = mt_rand(0, count($files)-1);
 
    // check again:
    if (!isset($files[$rand])){
        die('Array index was not found! very strange!');
    }
 
    // return the random file:
    return $files[$rand];
 
}

?>