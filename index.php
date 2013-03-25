<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Piradice - Turn-based strategy game in HTML5</title>
  <meta name="description" content="Pirates and dices in paradise! Free turn-based strategy game in Your browser.">        
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <link rel="apple-touch-icon" href="/media/apple-touch-icon-precomposed.png"/>
  <link rel="apple-touch-startup-image" href="/media/startup.png">
  <link rel="shortcut icon" href="/media/favicon.ico">
  <link href='http://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="/app/app.css">        
</head>
<body id="container">
             
  <div id="mainMenu">
      <h1>WELCOME TO PIRADICE</h1>
      <p>Turn-based strategy game in Your browser. Pirates and dices in paradise!</p>
      <ul>
          <li><button class="big" onclick="editor.init({random:true})">PLAYER VS PLAYER</button>
          <li><button class="big disabled">PLAY VS AI</button>
      </ul>
      <h2>News &amp; Discussion</h2>                
      <p>Explore <a href="https://twitter.com/search?q=%23piradice&src=typd" alt="twitter">#piradice</a>, follow <a href="https://twitter.com/w84death" alt="Krzysztof Jankowski on twitter">@w84death</a> and join the discussion on <a href="http://www.reddit.com/r/WebGames/comments/19zlc5/piradice_pirates_pixelart_turnbased_strategy_game/" alt="reddit">reddit</a>.</p>                            
      
      <h2>Development</h2>
      <p>Full source code avilable at <a href="https://github.com/w84death/Piradice">github.com/w84death/Piradice</a></p>
      <div class="ad">
          <p><small>SPONSORED BY</small></p>
          <p><a href="https://www.etsy.com/shop/VintageVanillaShop" title="Vintage Vanilla Shop on Etsy"><img src="/media/vintage_vanilla_logo.png" alt="VintageVanillaShop" /></a></p>
      </div>
  </div>
  
  <?php article(); ?>
  <?php element('nav'); ?>

  <script src="app/jquery.min.js"></script>
  <script src="app/app.js"></script>
</body>
</html>
