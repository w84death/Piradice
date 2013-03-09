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
            <p>alpha version #piradice <a href="piradice2x.png">art</a> <strong>☼suno</strong></p>
        </header>
        <div id="game">
            <canvas id="map"></canvas>
            <canvas id="entities"></canvas>
            <canvas id="gui"></canvas>
        </div>        
        <script src="app/entities.js"></script>
        <script src="app/items.js"></script>        
        <script src="app/app.js"></script>                
    </body>
</html>