<?php

// Get you site url => 'http://example.com/'
function websiteUrl ($www=false) {
    $withW  = (($www) ? 'www.' : '');
    $scheme = (isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) == 'on') ? 'https' : 'http';
    $url    = sprintf('%s://%s%s/',$scheme,$withW,$_SERVER['HTTP_HOST']);
    return (string) $url;
}

// Adds path to css folder => 'http://example.com/css/'
$sitepath = websiteUrl() . "css/";

// Calling less.php & compiling less
require 'less.php';
$options = array( 'compress'=>true );
$parser = new Less_Parser();
$parser->parseFile( '../css/bootstrap.less', $sitepath );
$css = $parser->getCss();

// Writing css to file
file_put_contents('../css/bootstrap.css', $css);

echo "<h1 style=\" font-family: Arial; text-align:center; position: absolute; left:50%; margin-left: -155px; margin-top: 5%; padding:20px; border: 3px solid #cc1433;\">LESS COMPILED! <br> <a style=\" font-size:16px; margin-top:15px; display:block;\"href=\"/\">back</a></h1>" . "\r\n";