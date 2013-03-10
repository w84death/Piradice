<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Piradice</title>
        <meta name="description" content="Pirates and dices in paradise for pirates! Turn-based HTML5 strategy game.">        
        <link rel="shortcut icon" href="media/favicon.ico">
        <link href='http://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="app/app.css">        
    </head>
    <body>
        <header>
            <h1><img src="media/logo.png" alt="Piradice"/></h1>
            <p>beta version <a href="https://twitter.com/search?q=%23piradice" alt="#piradice on twitter">#piradice</a> by <strong>suno</strong></p>
        </header>
        <div id="game">
            <canvas id="map"></canvas>
            <canvas id="entities"></canvas>
            <canvas id="gui"></canvas>
        </div> 
        <article>
            <h2>Help</h2>
            <p>You are a pirate. Open all chests to sail to another island! Every single unit = K6 dice. Double unit = 2x K6 dices and so on..</p>
            <p>All units must be used before end turn. Same units can be grouped up.</p>
            <p><span class="sprite" style="background-position: 0px -288px;"></span> <strong>Pirate</strong> Moves 1-2 klocks. Attacks only nearby units.</p>
            <p><span class="sprite" style="background-position: 0px -134px;"></span> <strong>Range Pirate</strong> Shoots at a distance of 3 blocks. After each shot, unit must reload weapon. Waits one turn.</p>
            <p class="animate"><span class="sprite" style="background-position: 0px -68px;"></span> <strong>Chest</strong> Your quest! One turn for opening.</p>
            <p><span class="sprite" style="background-position: 0px -160px;"></span> <strong>Skeleton</strong> They don't like You..</p>
            
        </article>
        <footer>
            <p><a href="http://krzysztofjankowski.com" alt="suno"><strong>suno</strong></a></p>
        </footer>
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