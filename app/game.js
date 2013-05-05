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
    version: 'VERSION 6',
    mobile: false || navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)|(android)|(webOS)/i),
    tablet: false || navigator.userAgent.match(/(iPad)/i),
    teams: [{
            pirates: true,
            ai: false,
            wallet: 400,
            income: 10,
            trees: 10,
            bought: false,
            offset: {x:0,y:0}            
        },{
            skeletons: true,
            ai: false,
            wallet: 400,
            income: 10,
            trees: 10,
            bought: false,
            offset: {x:0,y:0}
        }],
    turn: {
        id: 1,
        start: true,
        team: 0
    },    
    ai_speed: 100,
    game_speed: 500,
    play: false,
   	ready: false,
    map: true, 
    unit_selected: -1,

    init: function(args){                    
        console.log(this.version);  
      
        world.init({
            width: 48 || args.w,
            height: 32 || args.h
        });        
        shop.init();
        render.init();        
    },

    start: function(){
    	this.map = false;             
        GUI.show = ['map','copyright','inventory','gold','trees','end'];
        GUI.hud['map'].position = {x:1,y:1};
        shop.show();
        shop.buyStarter();        
        render.render({menu:true});
        multi.show();
    },    

    restart: function(){
    	this.teams = [{
            pirates: true,
            ai: false,
            wallet: 400,
            trees: 10,
            bought: false,
            offset: {x:0,y:0}            
        },{
            skeletons: true,
            ai: false,
            wallet: 400,
            trees: 10,
            bought: false,
            offset: {x:0,y:0}
        }];
		GUI.show = ['logo', 'copyright', 'map','play','random', 'map_size1', 'map_size2', 'map_size3'];
        GUI.hud['map'].position = {x:((render.viewport.width*0.5)<<0)-4,y:8};
        this.turn.start = true;
        this.turn.id = 1;
        this.turn.team = 0;
        world.restartMap();
        this.play = false;
        this.ready = false;
    	this.map = true;
        this.centerMap();
        render.render({all:true});
    },

    randomMap: function(){
        world.randomMap();
        GUI.refreshMap();
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
        render.destroyDOM();
        render.createDOM();
        fogOfWar.init();
        GUI.ctx = render.menu.ctx;
        GUI.refreshMap();
        this.centerMap();
        //render.render({all:true}); 
    },

    centerMap: function(args){
        console.log(args);
        if(!args){
            args = {};
            args.x = (world.map.width*0.5)<<0;
            args.y = (world.map.height*0.5)<<0;
        }
        render.viewport.offset.x = ((render.viewport.width*0.5)<<0) - args.x;
        render.viewport.offset.y = ((render.viewport.height*0.5)<<0) - args.y;
        game.teams[game.turn.team].offset = {
            x:render.viewport.offset.x,
            y:render.viewport.offset.y
        };
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
            	// attack
                if(world.map.entities[game.unit_selected].move_area[i].attack){
                    if(world.map.entities[game.unit_selected].attack(cX, cY)){
                        if(!world.map.entities[game.unit_selected].range){
                            world.map.entities[game.unit_selected].move(cX, cY);
                        }
                    };
                }else
                // merge
                if(world.map.entities[game.unit_selected].move_area[i].merge){
                    if(world.map.entities[game.unit_selected].merge(cX, cY)){
                        world.map.entities[game.unit_selected].move(cX, cY);
                    }
                }else
                // cut
                if(world.map.entities[game.unit_selected].move_area[i].forest){                    
                    world.map.entities[game.unit_selected].cut(cX, cY);
                }else
                // move
                if(world.map.entities[game.unit_selected].move_area[i].move){
                    world.map.entities[game.unit_selected].move(cX, cY);
                }
                
            }    
        }
      
        world.map.entities[game.unit_selected].unselect();
        this.unit_selected = -1;
        
        fogOfWar.update();

    },    

    checkMate: function(){
        var loose = false,
            win = false;

        if(this.turn.id > 1){
            loose = true,
            win = true;
        }

        for (i = 0; i < world.map.entities.length; i++) {
            
            if(this.turn.id > 1){
                
                if(game.teams[this.turn.team].pirates){
                    if(world.map.entities[i].ship && world.map.entities[i].alive){
                        loose = false;                       
                    }
                    if(world.map.entities[i].cementary && world.map.entities[i].alive){
                        win = false;
                    }
                }

                if(game.teams[this.turn.team].skeletons){
                    if(world.map.entities[i].cementary && world.map.entities[i].alive){
                        loose = false;                       
                    }
                    if(world.map.entities[i].ship && world.map.entities[i].alive){
                        win = false;
                    }
                }
           }
        }

        if(loose){
            game.lose();
            return false;
        }else
        if(win){            
            game.win();
            return false;
        }
        
        return true;
    },

    nextTurn: function(){
            game.play = false;

            if(this.checkMate()){
     
                for (i = 0; i < world.map.entities.length; i++) {
                    if(world.map.entities[i].range){
                        world.map.entities[i].reloading--;
                    }
                    
                    world.map.entities[i].moves = 1;                
                    world.map.entities[i].selected = false;
                }

                game.unit_selected = -1;

                               
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
            
                this.teams[this.turn.team].bought = false;
                fogOfWar.update();                                
                this.payDay();
                shop.show();
                GUI.show.push('map');
                GUI.show.push('inventory');
                GUI.show.push('gold');
                GUI.show.push('trees');
                GUI.show.push('end');
                render.render({gui:true, menu:true, entities:true, sky:true});                                   
            }else{
            	return true;
            }

            if(this.turn.id == 1){
                shop.buyStarter();
                game.shoutTeam();   
                render.render({all:true});
            }

            if(!game.ready){
                multi.show();
                render.viewport.offset = {
                    x:this.teams[this.turn.team].offset.x, 
                    y:this.teams[this.turn.team].offset.y};
            }
            
            bank.save();
    },

    payDay: function(){
        var salary = 5;            
    
        for (var i = 0; i < world.map.entities.length; i++) {
            if(game.teams[game.turn.team].skeletons){
                if(world.map.entities[i].cementary){
                    salary += game.teams[game.turn.team].income;
                }
            }
            if(game.teams[game.turn.team].pirates){
                if(world.map.entities[i].ship){
                    salary += game.teams[game.turn.team].income;
                }
            }
        };
        
        game.teams[game.turn.team].wallet += salary;
        game.updateWallet();        
    },

    income: function(){
        var income = 5;
        for (var i = 0; i < world.map.entities.length; i++) {
            if(game.teams[game.turn.team].pirates){
                if(world.map.entities[i].ship){
                    income += game.teams[game.turn.team].income;
                }
            }
            if(game.teams[game.turn.team].skeletons){
                if(world.map.entities[i].ship){
                    income += game.teams[game.turn.team].income;
                }
            }
        };
        return income;
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
        GUI.render({end:true,message:'You win!'})
        /*this.ready = false;
        this.play = false;
        this.map = true;
        this.restart();*/
    },

    lose: function(){        
        GUI.render({end:true,message:'You lose :('})
        /*this.ready = false;
        this.play = false;
        this.map = true;
        this.restart();*/
    },


        
    setWallet: function(gold){
        for (var i = 0; i < game.teams.length; i++) {
            game.teams[i].wallet = gold;    
        }
        game.updateWallet();
    },
    
    updateWallet: function(){
        render.render({menu:true});
    },
    
    updateUnits: function(){
       /*
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
        */
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


var bank = {
	save: function() {
		// save game state
		localStorage.setItem("save",true);
	},
	
	load: function() {
		if(this.hasSave()){
			//load map
		}
	},
	
	hasSave: function(){
		if(localStorage.getItem('save')){
			return true;
		}
		
		return false;
	},
};

var multi = {
    
    show: function(msg){
        GUI.render({ready:true});
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