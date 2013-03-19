<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Piradice <?php if($_GET['mode'] == 'editor'){ echo('EDITOR'); }?> - Turn-based strategy game in HTML5</title>
        <meta name="description" content="Pirates and dices in paradise! Free turn-based strategy game in Your browser.">        
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="/media/apple-touch-icon-precomposed.png"/>
        <link rel="apple-touch-startup-image" href="/media/startup.png">
        <link rel="shortcut icon" href="/media/favicon.ico">
        <link href='http://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="/app/app.css">        
    </head>
    <body>
        <div id="container">
            <p id="loading"><strong>Loading game..</strong></p>
            <section id="game" <?php if($_GET['mode'] == 'editor'){ echo('class=editor'); }?>>                        
                <canvas id="map"></canvas>
                <canvas id="entities"></canvas>
                <canvas id="gui"></canvas>
            </section>
            <?php if($_GET['mode'] == 'editor'){ ?>
            <aside id="editor">
                <h2>Map Editor</h2>
                <p>For pirates use only</p>                                
                <ul id="generator">
                    <li>Seed:  <input id="seed" value="piradice"/>
                    <li>Islands: <input id="islands" value="5"/>
                    <li>Islands size: <input id="islands_size" value="20"/>
                    <li>Grass: <input id="grass" value="16"/>
                    <li>Palms: <input id="palms" value="40"/>
                    <li>Chests: <input id="chests" value="5"/>
                    <li>Units: <select id="unit">
                                    <option value="pirate">Pirate</option>
                                    <option value="range_pirate">Range Pirate</option>                                    
                                    <option value="ship">Ship</option>
                                    <option value="black_pearl">Black Pearl</option>
                                    <option value="skeleton">Skieleton</option>
                                    <option value="octopus">Octopus</option>
                                </select>
                    <li>Squad: <select id="squad">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>s
                                </select>
                    <li><button onclick="editor.generateMap(true)" class="hot">Generate new map</button>
                    <li><button id="save" onclick="editor.saveSettings()">Save</button><button id="load" class="disabled">Load</button>
                </ul>                
                <ul class="play">
                    <li><button id="play" onclick="editor.playMap()">Play this map</button>
                </ul>
            </aside>
            <?php } ?>
        </div>
        <section class="desktop">
            <article>
                <header>
                    <h1><img src="/media/logo.png" alt="Piradice"/></h1>
                    <p>beta version <a href="https://twitter.com/search?q=%23piradice" alt="#piradice on twitter">#piradice</a> by <strong>suno</strong></p>
                </header>
                
                <h2>Story</h2>
                <p>Arrr! You are a pirate. Open all chests to sail to another island!</p>
                
                <h2>How to play?</h2>
                <p>Every single unit = K6 dice. Double unit = 2x K6 dices and so on..</p>
                <p>All units must be used before end turn. Same units can be grouped up (except water units).</p>
                
                <h3>Land units</h3>
                <p><span class="sprite" style="background-position: 0px -288px;"></span> <strong>Pirate</strong> Moves 1-2 klocks. Attacks only nearby units.</p>
                <p><span class="sprite" style="background-position: 0px -134px;"></span> <strong>Range Pirate</strong> Shoots at a distance of 3 blocks. After each shot, unit must reload weapon. Waits one turn.</p>
                <p><span class="sprite" style="background-position: 0px -160px;"></span> <strong>Skeleton</strong> They don't like You..</p>            
                
                <h3>Water units</h3>
                <p><span class="sprite" style="background-position: 0px -288px;"></span> <strong>Pirate Ship</strong> Moves 1-2 klocks. Attacks only nearby units.</p>
                <p><span class="sprite" style="background-position: 0px -288px;"></span> <strong>Black Pearl Ship</strong> Moves 1-2 klocks. Attacks only nearby units.</p>
                <p><span class="sprite" style="background-position: 0px -288px;"></span> <strong>Octopus/Kraken</strong> Moves 1-2 klocks. Attacks only nearby units.</p>
                
                <h3>Items</h3>
                <p class="animate"><span class="sprite" style="background-position: 0px -68px;"></span> <strong>Chest</strong> Your quest! One turn for opening.</p>
                
                <h2>Map Editor!</h2>
                <p>First public test. It has bugs but it works :) And its a lot of fun to use.</p>
                <p>Go and play at <a href="/editor/" title="Piradice Map Editor">/editor/</a></p>

                <h2>News &amp; Discussion</h2>                

                <p>Explore <a href="https://twitter.com/search?q=%23piradice&src=typd" alt="twitter">#piradice</a>, follow <a href="https://twitter.com/w84death" alt="Krzysztof Jankowski on twitter">@w84death</a> and join the discussion on <a href="http://www.reddit.com/r/WebGames/comments/19zlc5/piradice_pirates_pixelart_turnbased_strategy_game/" alt="reddit">reddit</a>.</p>                            
                
                <h2>Development</h2>
                <p>Full source code avilable at <a href="https://github.com/w84death/Piradice">github.com/w84death/Piradice</a></p>
                
                <h2>Sponsored by</h2>
                <p><a href="https://www.etsy.com/shop/VintageVanillaShop" title="Vintage Vanilla Shop on Etsy"><img src="/media/vintage_vanilla_logo.png" alt="VintageVanillaShop" /></a></p>
                
                <footer>
                    <p><a href="http://krzysztofjankowski.com" alt="suno"><strong>suno</strong></a></p>
                </footer>
            </article>
        </section>
        <script src="/app/seed.js"></script>
        <script src="/app/entities.js"></script>
        <script src="/app/items.js"></script>
        <script src="/app/maps.js"></script>
        <script src="/app/app.js"></script>
        <script src="/app/editor.js"></script>
        <script>
        <?php if($_GET['mode'] == 'editor'){ ?>
            editor.init();        
        <?php }else{ ?>
            game.init({campain:true});
        <?php } ?>
        </script>
        
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