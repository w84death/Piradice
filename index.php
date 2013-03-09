<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Piradice</title>
        <meta name="description" content="Pirates and dices in paradise for pirates! Turn-based HTML5 strategy game.">        
        <link rel="shortcut icon" href="media/favicon.ico">
        <link rel="stylesheet" href="app/app.css">        
    </head>
    <body>
        <header>
            <h1><img src="media/logo.png" alt="Piradice"/></h1>
            <p>alpha version #piradice <a href="piradice_concept_art.png">art</a> <strong>☼suno</strong></p>
        </header>
        <div id="game">
            <canvas id="map"></canvas>
            <canvas id="entities"></canvas>
            <canvas id="gui"></canvas>
        </div>        
        <script src="app/entities.js"></script>
        <script src="app/items.js"></script>
        <script src="app/maps.js"></script>
        <script src="app/app.js"></script>
        
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