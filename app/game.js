/*
    ----------------------------------------------------------------------------

        KRZYSZTOF JANKOWSKI
        PIRADICE

        abstract: HTML5 Canvas 2D Turn-based Game Engine
        created: 06-03-2013
        licence: do what you want and dont bother me

    ----------------------------------------------------------------------------
*/


/*
    ----------------------------------------------------------------------------
    CONTROL GAME STUFF
    ----------------------------------------------------------------------------
*/

var game = {
    version: 'BETA3.1 30-03-2013',
    mobile: false || navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)/i),
    tablet: false || navigator.userAgent.match(/(iPad)/i),
    teams: [{
            pirates: true,
            ai: false,
            wallet: 200,
        },{
            skeletons: true,
            ai: false,
            wallet: 200, 
        }],
    turn: {
        id: 1,
        start: true,
        team: 0
    },
    ai_speed: 100,
    play: false,
    unit_selected: -1,

    init: function(args){                    
        console.log(this.version);  
        
        if(this.mobile){
            args.w = 15;
            args.h = 8;
        }

        world.init({
            width: 24 || args.w,
            height: 14 || args.h
        });        
        render.init();
        fogOfWar.init();
        render.render({all:true});                
    },

    start: function(){
        game.play = true;
        document.getElementById('playGame').style.display = 'none';
        document.getElementById('settings').style.display = 'none';
        document.getElementById('random').style.display = 'none';
        shop.open({team:game.turn.team, more:false});
        shop.buyStarter();
        multi.show();
    },    

    restart: function(){
        game.play = false;
        document.getElementById('nextTurn').style.display = 'none';
        document.getElementById('playGame').style.display = 'inline-block';
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('random').style.display = 'inline-block';
        shop.close({all:false});
        this.turn.start = true;
        this.turn.id = 0;
        world.restartMap();
    },

    randomMap: function(){
        world.randomMap();
        render.render({all:true});
    },

    saveMap: function(){
        world.saveMap();
    },

    loadMap: function(){
        world.loadMap();
        render.render({all:true});
    },

    mapSize: function(args){
        world.mapSize(args);
        render.init();
        fogOfWar.init();
        io.init();
        render.render({all:true}); 
    },

    select: function(cX,cY){
        
        // user clicked on canvas

        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].x == cX && world.map.entities[i].y == cY && world.map.entities[i].team == this.turn.team && world.map.entities[i].moves > 0 && world.map.entities[i].reloading < 1) {                
                world.map.entities[i].select();                
                world.map.entities[i].open();
                this.unit_selected = i;
            }
        }
    },

    attackOrMove: function(cX,cY){
        
        var randomizer = new Date();
        Math.seedrandom(randomizer);

        for (var i = 0; i < world.map.entities[game.unit_selected].move_area.length; i++) {
            if(world.map.entities[game.unit_selected].move_area[i].x == cX && world.map.entities[game.unit_selected].move_area[i].y == cY){
                if(world.map.entities[game.unit_selected].move_area[i].attack){
                    if(world.map.entities[game.unit_selected].attack(cX, cY)){
                        if(!world.map.entities[game.unit_selected].range){
                            world.map.entities[game.unit_selected].move(cX, cY);
                        }
                    };
                }else
                if(world.map.entities[game.unit_selected].move_area[i].merge){
                    if(world.map.entities[game.unit_selected].merge(cX, cY)){
                        world.map.entities[game.unit_selected].move(cX, cY);
                    }
                }else
                if(world.map.entities[game.unit_selected].move_area[i].forest){                    
                    world.map.entities[game.unit_selected].cut(cX, cY);
                }else
                if(world.map.entities[game.unit_selected].move_area[i].move){
                    world.map.entities[game.unit_selected].move(cX, cY);
                }
                
            }    
        }
      
        world.map.entities[game.unit_selected].unselect();
        this.unit_selected = -1;
        
        fogOfWar.update();

    },

    toDice: function(value){
        var dice = [];
        dice[1] = "⚀";
        dice[2] = "⚁";
        dice[3] = "⚂";
        dice[4] = "⚃";
        dice[5] = "⚄";
        dice[6] = "⚅";

        return dice[value];
    },

    nextTurn: function(){
            
            shop.close({all:true});

            var loose = true;
            // change to true!

            for (i = 0; i < world.map.entities.length; i++) {
                if(world.map.entities[i].team === this.turn.team && world.map.entities[i].alive){                    
                    loose = false;                    
                }

                if(world.map.entities[i].range){
                    world.map.entities[i].reloading--;
                }
                
                world.map.entities[i].moves = 1;                
                world.map.entities[i].selected = false;
            }

            game.unit_selected = -1;

            if(loose){
                game.lose();
            }else{

                if(game.turn.team == 1){
                    game.turn.team = 0;
                    game.turn.id++;
                }else{
                    game.turn.team = 1;
                }
                
                this.killZombies();        
                this.shoutTeam();                                        

                if(this.teams[this.turn.team].ai){
                     ai.loop();
                }        
            
                fogOfWar.update();
                render.render({gui:true, entities:true, sky:true});
                multi.show();
                this.payDay();
                shop.open({team:game.turn.team, more:false});                 
            }

            if(this.turn.id == 1){
                shop.buyStarter();
                game.shoutTeam();   
                render.render({all:true});
            }
            
    },

    payDay: function(){
        var salary = 5;
            
        if(game.teams[game.turn.team].skeletons){
            for (var i = 0; i < world.map.entities.length; i++) {
                if(world.map.entities[i].cementary){
                    salary += 10;
                }
            };
        }
        if(game.teams[game.turn.team].pirates){
            for (var i = 0; i < world.map.entities.length; i++) {
                if(world.map.entities[i].ship){
                    salary += 10;
                }
            };
        }
        game.teams[game.turn.team].wallet += salary;
        game.updateWallet();        
    },

    killZombies: function(){
    
        for (var i = 0; i < world.map.entities.length; i++) {
            if(!world.map.entities[i].alive){                
                world.map.entities[i].x = 0;
                world.map.entities[i].y = 0;
                //delete world.map.entities[i]
                world.map.entities.slice(i,1);
            }                        
        }
        
        render.render({entities:true});        
    },
            
    win: function(){
        window.alert('You win!'); 
        //this.restart();          
        window.location.reload();
    },

    lose: function(){        
        window.alert('You lose');
        //this.restart();
        window.location.reload();
    },


        
    setWallet: function(gold){
        for (var i = 0; i < game.teams.length; i++) {
            game.teams[i].wallet = gold;    
        }
        game.updateWallet();
    },
    
    updateWallet: function(){
        var player1_gold = document.getElementById('player1_gold'),
            player2_gold = document.getElementById('player2_gold');                
        
        player1_gold.innerHTML = game.teams[0].wallet;
        player2_gold.innerHTML = game.teams[1].wallet;            
    },
    
    updateUnits: function(){
        var player1_units = 0,
            player2_units = 0;
        
        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].alive){
                if(world.map.entities[i].team === 0){
                    player1_units += world.map.entities[i].squad;
                }else{
                    player2_units += world.map.entities[i].squad; 
                }
            }
        }
        
        function percent(val, total){
            var per = ((val*100)/total)<<0;                    
            return per;
        }
        
        document.getElementById('player1_units').innerHTML = player1_units;
        document.getElementById('player1_units').setAttribute('style','width: ' + percent(player1_units, player1_units+player2_units) + '%');
        document.getElementById('player2_units').innerHTML = player2_units;
        document.getElementById('player2_units').setAttribute('style','width: ' + percent(player2_units, player1_units+player2_units) + '%');
    },

    
    shoutTeam: function(){
        for (var i = 0; i < world.map.entities.length; i++) {
            world.map.entities[i].message = null;
            if(world.map.entities[i].team === game.turn.team && world.map.entities[i].reloading < 1){
                world.map.entities[i].shout();
            }
        }
    },
};

var multi = {
    
    show: function(msg){ 
        document.getElementById('nextTurn').style.display = 'none';
        if(!game.teams[0].ai && !game.teams[1].ai && !game.editor){
            fogOfWar.update();            
            document.getElementById('multi').style.display = 'block';  
            document.getElementById('turn').innerHTML = game.turn.id;
            if(game.teams[game.turn.team].pirates){
                document.getElementById('playerID').innerHTML = 'PIRATES';
            }else
            if(game.teams[game.turn.team].skeletons){
                document.getElementById('playerID').innerHTML = 'SKELETONS';
            }
            document.getElementById('playButton').innerHTML = msg || 'PLAY';                                 
        }
    },
    
    play: function(){
        document.getElementById('multi').style.display = 'none';
        document.getElementById('nextTurn').style.display = 'inline-block';
    },
};



var utilities = {
    clone: function(from, to){
        // http://stackoverflow.com/a/1042676
        if (from == null || typeof from != "object") return from;
        if (from.constructor != Object && from.constructor != Array) return from;
        if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

        to = to || new from.constructor();
    
        for (var name in from)
        {
            to[name] = typeof to[name] == "undefined" ? this.clone(from[name], null) : to[name];
        }
    
        return to;
    }
};

var fogOfWar = {
    data: [],
    
    init: function(){
        for (var t = 0; t < game.teams.length; t++) {
            this.data[t] = [];
            for (var i = 0; i < world.map.data.length; i++) {
                this.data[t].push(50);
            }        
        }
    },
    
    update: function(){
        
        for (var i = 0; i < world.map.data.length; i++) {
            for (var t = 0; t < game.teams.length; t++) {
                this.data[t][i] = 50;
            }
        }                
        
        for (var i = 0; i < world.map.entities.length; i++) {                                
            
            if(world.map.entities[i].alive){
                var size = world.map.entities[i].fow;
                for (var y = world.map.entities[i].y+1 - size; y <= world.map.entities[i].y + size; y++) {
                    for (var x = world.map.entities[i].x - size; x <= world.map.entities[i].x + size; x++) {
                        if(x>=0 && x<world.map.width && y>=0 && y < world.map.height){
                            this.data[world.map.entities[i].team][x + (y*world.map.width)] = false;                
                        }
                    }
                }
                
            }                    
        } 
        
        
    
        for (var y = 0; y < world.map.height; y++) {
            for (var x = 0; x < world.map.width; x++) {
                for (var t = 0; t < game.teams.length; t++) {
                    if(this.data[t][x + (y*world.map.width)] == 50 && this.data[t][x + ((y+1)*world.map.width)] == false && this.data[t][x + ((y-1)*world.map.width)] == false ){
                        this.data[t][x + (y*world.map.width)] = false; // clear artefacts
                    }else
                    if(this.data[t][x + (y*world.map.width)] == 50 && this.data[t][x + ((y+1)*world.map.width)] == false ){
                        this.data[t][x + (y*world.map.width)] = 51; // bottom shadow
                    }    
                }
            }
        }

        render.render({sky:true});
    },
    
};