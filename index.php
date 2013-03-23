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
            <p id="loading"><strong>LOADING..</strong></p>
            <section id="game" <?php if($_GET['mode'] == 'editor'){ echo('class=editor'); }?>>                        
                <canvas id="map"></canvas>
                <canvas id="entities"></canvas>                
                <canvas id="sky"></canvas>
                <canvas id="gui"></canvas>                
            </section>
            <section id="multi">
                <h2>PLAYER<span id="playerID">1</span></h2>
                <p>TURN <span id="turn">1</span></p>
                <p><button id="playButton" onclick="multi.play()" class="hot">PLAY</button></p>
            </section>
            <nav>
                <ul>
                    <li>PIRADICE
                        <ul>
                            <li>PLAY WITH FRIEND
                            <li>PLAY SOLO VS AI
                            <li>STORY
                            <li>HELP
                            <li>CREDITS
                        </ul>
                    <li id="world">WORLD
                        <ul>
                            <li>SEED:  <input id="seed" value="piradice"/>
                            <li>ISLAND: <input id="islands" value="5"/>
                            <li>SIZE: <input id="islands_size" value="20"/>
                            <li>GRASS: <input id="grass" value="16"/>
                            <li>PALMS: <input id="palms" value="40"/>
                            <li>CHESTS: <input id="chests" value="5"/>
                            <li><button onclick="editor.generateMap(true)" class="hot">GENERATE</button>
                            <li><button id="save" onclick="editor.saveSettings()">SAVE</button><button id="load" class="disabled">LOAD</button>                            
                        </ul>
                    <li id="wallets">WALLETS
                        <ul>
                            <li>SET CAP: <select id="wallet" onchange="game.setWallet();">
                                            <option value="30">$30</option>
                                            <option value="50">$50</option>
                                            <option value="100">$100</option>
                                            <option value="200" selected>$200</option>
                                            <option value="999">$999</option>
                                        </select>
                            <li>PLAYER1: <strong>$<span id="player1_dolars">200</span></strong>
                            <li>PLAYER2: <strong>$<span id="player2_dolars">200</span></strong>
                        </ul>
                    <li id="shop">SHOP
                        <ul>
                            <li><select id="team" onchange="game.switchPlayer();">
                                            <option value="0">PLAYER1</option>
                                            <option value="1">PLAYER2</option>
                                        </select>
                            <select id="ai" onchange="game.updatePlayer();">
                                            <option value="0" selected>HUMAN</option>
                                            <option value="1">AI</option>
                                        </select>
                            <li><select id="unit">
                                            <option value="pirate">[$10] PIRATE</option>
                                            <option value="range_pirate">[$15] PIRATE WITH GUN</option>
                                            <option value="lumberjack">[$20] LUMBERJACK</option>
                                            <option value="ship">[$50] CARGO SHIP</option>
                                            <option value="black_pearl">[$65] BLACK PEARL</option>
                                            <option value="skeleton">[$10] SKELETON</option>
                                            <option value="dust">[$20] DUST</option>                                    
                                            <option value="octopus">[$15] OCTOPUS</option>
                                        </select>
                            <li>UNITS <select id="squad">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select> IN SQUAD
                        </ul>
                    <li id="stats"><strong class="progress"><em id="player1_units">0</em></strong> vs <strong class="progress"><em id="player2_units">0</em></strong>
                    <li class="right"><button id="nextTurn" onclick="game.nextTurn()" class="hot">NEXT TURN</button>
                    <li class="right"><button id="play" onclick="editor.playMap()" class="hot">PLAY</button>
                </ul>
            </nav>
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
                <p>In a nutshell its a simple turn-based strategy game.</p>
                <p><button onclick="document.getElementById('manual').style.display='block';this.style.display = 'none';">Click here to read the game manual.</button></p>
                
                <ul id="manual" style="display:none;">
                    <li><img src="/manual/piradice_manual_1.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_2.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_3.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_4.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_5.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_6.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_7.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_8.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_9.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_10.png" alt="Piradice manual" />
                    <li>Scenario 3: You die :D
                    <li><img src="/manual/piradice_manual_11.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_12.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_13.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_14.png" alt="Piradice manual" />
                    <li><img src="/manual/piradice_manual_15.png" alt="Piradice manual" />
                    <li>Now play!
                </ul>
                
                
                <h2>Custom play!</h2>
                <p>In this map editor You can make any map and put any units to play with. It has bugs but it works :) And its a lot of fun to use.</p>
                <p>Go and create some awsom map at <button onclick="document.location = '/editor/';" title="Piradice Map Editor">/editor/</button></p>

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
        <script src="/app/ai.js"></script>
        <script src="/app/game.js"></script>
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