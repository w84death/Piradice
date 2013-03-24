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
    <body>
        <div id="container">            
            <section id="game"></section>
            <section id="multi">
                <h2>PLAYER<span id="playerID">1</span></h2>
                <p>TURN <span id="turn">1</span></p>
                <p><button id="playButton" onclick="multi.play()" class="hot">PLAY</button></p>
            </section>
            <nav>
                <ul>
                    <li><a href="javascript:void(0);">PIRADICE</a>
                        <ul>
                            <li><a href="javascript:void(0);">TUTORIAL <span>></span></a>
                                <ul>
                                    <li  onclick="game.init({campain:true, continue:true})">LOAD GAME
                                    <li  onclick="game.init({campain:true, newgame:true})">NEW GAME
                                </ul>
                            <li><a href="javascript:void(0);">CUSTOM MAP <span>></span></a>
                                <ul>
                                    <li onclick="editor.init({random:true})">NEW RANDOM MAP
                                    <li onclick="editor.init({load:true})">LOAD MAP                                   
                                </ul>                            
                            <li><a href="javascript:void(0);">CREDITS</a>
                                <ul>
                                    <li>SUNO
                                    <li>DESIGN & CODE:
                                    <li>KRZYSZTOF JANKOWSK
                                </ul>
                        </ul>
                    <li id="world"><a href="javascript:void(0);">WORLD</a>
                        <ul>
                            <li>SEED:  <input id="seed" value="piradice"/>
                            <li>ISLAND: <input id="islands" value="5"/>
                            <li>SIZE: <input id="islands_size" value="20"/>
                            <li>GRASS: <input id="grass" value="16"/>
                            <li>PALMS: <input id="palms" value="40"/>
                            <li>CHESTS: <input id="chests" value="5"/>
                            <li><button onclick="editor.generateMap(true)" class="hot">GENERATE</button>
                            <li>LOCAL STORAGE <span>></span>
                                <ul>
                                    <li id="save" onclick="editor.saveSettings()">SAVE
                                    <li id="load" class="disabled">LOAD
                                </ul>                                    
                        </ul>                    
                    <li id="wallets"><a href="javascript:void(0);">SETTINGS</a>
                        <ul>
                            <li><select id="team" onchange="game.switchPlayer();">
                                            <option value="0">PLAYER1</option>
                                            <option value="1">PLAYER2</option>
                                        </select>                                        
                            <select id="ai" onchange="game.updatePlayer();">
                                            <option value="0" selected>HUMAN</option>
                                            <option value="1">AI</option>
                                        </select>
                            <li>SET WALLET CAP: <select id="wallet" onchange="game.setWallet();">
                                            <option value="30">$30</option>
                                            <option value="50">$50</option>
                                            <option value="100">$100</option>
                                            <option value="200" selected>$200</option>
                                            <option value="999">$999</option>
                                        </select>
                            <li><a href="javascript:void(0);">BUY PIRATES UNITS: <span>></span></a>
                                <ul>
                                    <li onclick="editor.addToBasket('pirate');">PIRATE <span>$10</span>
                                    <li onclick="editor.addToBasket('range_pirate');">PIRATE WITH GUN <span>$15</span>
                                    <li onclick="editor.addToBasket('lumberjack');">LUMBERJACK <span>$20</span>
                                    <li onclick="editor.addToBasket('ship');">MOTHERSHIP <span>$50</span>
                                </ul>
                            <li><a href="javascript:void(0);">BUY SKELETON UNITS: <span>></span></a>
                            <ul>
                                <li onclick="editor.addToBasket('skeleton');">SKELETON <span>$10</span>
                                <li onclick="editor.addToBasket('dust');">DUST <span>$20</span>
                                <li onclick="editor.addToBasket('octopus');">OCTOPUS <span>$15</span>
                                <li onclick="editor.addToBasket('cementary');">CEMENTARY <span>$50</span>
                            </ul>
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
                    <li>PLAYER1: $<strong id="player1_dolars">200</strong>
                    <li>PLAYER2: $<strong id="player2_dolars">200</strong>
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
        <script src="/app/app.js"></script>
        <script>    
            app.init({ads:true});
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