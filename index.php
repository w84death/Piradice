<?php include_once('app/engine.php'); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Piradice - Turn-based strategy game in HTML5</title>
  
  <meta name="description" content="Pirates and dices in paradise! Free turn-based strategy game in Your browser." />        
  <meta name = "viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, width=device-width"/>
  
  <meta property="og:title" content="Piradice - Turn-based strategy game in HTML5"> 
  <meta property="og:image" content="http://piradice.krzysztofjankowski.com/media/thumb.png"> 
  <meta name="description" content="Pirates and dices in paradise! Play this free turn-based strategy game in Your browser on any device.">

  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <link rel="apple-touch-icon" href="/media/apple-touch-icon-precomposed.png"/>
  <link rel="apple-touch-startup-image" href="/media/startup.png"/>
  <link rel="shortcut icon" href="/media/favicon.ico"/>
  <link href='http://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'/>
  <link rel="stylesheet" href="/app/app.css"/>        
</head>
<body>

  <section class="<?php echo pwd(); ?>" id="play">       
    <?php article(); ?>
  </section>        
  
  <script type="text/javascript">
  
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-39133686-1']);
    _gaq.push(['_trackPageview']);
  
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  
  </script> 
</body>
</html>
