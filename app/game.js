/*
    ----------------------------------------------------------------------------

        KRZYSZTOF JANKOWSKI && PRZEMYSŁAW SIKORSKI
        PIRADICE

        abstract: HTML5 Canvas 2D Turn-based Game Engine
        created: 06-03-2013
        licence: do what you want and dont bother us

    ----------------------------------------------------------------------------
*/


/*
    ----------------------------------------------------------------------------
    CONTROL GAME STUFF
    ----------------------------------------------------------------------------
*/

var game = {
    version: 'Pre-final Update 8',
    runs: 0,
    mobile: false || navigator.userAgent.match(/(iPhone)|(iPod)|(iPad)|(android)|(webOS)/i),
    tablet: false || navigator.userAgent.match(/(iPad)/i),
    teams: [{
            pirates: true,
            ai: false,
            wallet: {
                gold:400, //400,
                trees:40, //22
            },
            income: {
                gold: 5,            
                trees: 1
            },
            bought: false,
            offset: {x:0,y:0}            
        },{
            skeletons: true,
            ai: false,
            wallet: {
                gold:400, //400,
                trees:30,// 12
            },
            income: {
                gold: 5,            
                trees: 1
            },
            bought: false,
            offset: {x:0,y:0}
        }],
    turn: {
        id: 1,
        start: true,
        team: 0
    },    
    ai_speed: 150,
    game_speed: 500,
    play: false,
   	ready: false,
    map: true, 
    audio: true,
    unit_selected: false,
    fow: false,
    fps: 7,

    init: function(args){
        if(isNaN(localStorage.runs) || !localStorage.runs){
            this.runs = 0;
        }else{
            this.runs = localStorage.runs;
        }
        localStorage.runs = ++this.runs;
        //alert('Version ' + this.version + '. Opened ' + this.runs + ' times.');  

        if(this.mobile){
            //this.audio = false;
            args.w = 18;
            args.h = 16;
            audio.enableMP3();
        }

        audio.init();
        world.init({
            width: 24 || args.w,
            height: 18 || args.h
        });        
        //fogOfWar.init();
        shop.init();    
        render.init();        
        audio.play({sound:'music1'});
        //this.saveMap();
    },

    menu: function(){
        GUI.show = ['logo', 'copyright', 'map','play','play_ai','random', 'map_size1', 'map_size2', 'map_size3', 'audio'];
        GUI.hud['map'].position = {
            x:((render.viewport.width*0.5)<<0)-4,
            y:render.viewport.height-5
        };            
    },

    start: function(args){
        if(args.ai){
            game.teams[1].ai = true;
            game.teams[1].income.gold = 10; // bo głupi ma szczęście
            game.teams[1].income.trees = 2;
        }else{
            game.teams[1].ai = false;
            game.teams[1].income.gold = 5;
            game.teams[1].income.trees = 1;
        }
        audio.changeVolume({sound:'music1', volume:0.4});
    	this.map = false;             
        GUI.show = ['map','inventory','gold','trees','end'];
        GUI.hud['map'].position = {x:1,y:1};
        shop.show();
        shop.buyStarter();        
        render.render({menu:true});
        multi.show();
    },    

    restart: function(){
        audio.changeVolume({sound:'music1', volume:0.9});
    	this.teams = [{
            pirates: true,
            ai: false,
            wallet: {
                gold:400,
                trees:40
            },
            income: {
                gold: 10,            
                trees: 1
            },
            bought: false,
            offset: {x:0,y:0}            
        },{
            skeletons: true,
            ai: false,
            income: {
                gold: 10,            
                trees: 1
            },
            wallet: {
                gold:400,
                trees:30
            },
            bought: false,
            offset: {x:0,y:0}
        }];
        this.menu();
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
        render.map_rendered = true;
        render.frame = 0;
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
        render.map_rendered = true;
        render.frame = 0;
        render.render({all:true});
    },

    centerMap: function(args){
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
        render.post_render();
    },

    select: function(cX,cY){
        
        // user clicked on canvas

        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].x == cX && world.map.entities[i].y == cY && world.map.entities[i].team == this.turn.team && world.map.entities[i].moves > 0 && world.map.entities[i].reloading < 1) {                
                this.unit_selected = i;
                world.map.entities[i].select();                
                world.map.entities[i].open();                
                return true;
            }
        }

        return false;
    },

    MMA: function(cX,cY){

        if(game.unit_selected === false){
            return false;
        }        

        var randomizer = new Date();
        Math.seedrandom(randomizer);
        
        for (var i = 0; i < world.map.entities[game.unit_selected].move_area.length; i++) {
            if(world.map.entities[game.unit_selected].move_area[i].x == cX && world.map.entities[game.unit_selected].move_area[i].y == cY){
            	audio.play({sound:'click'});
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
        this.unit_selected = false;
    
        fogOfWar.update();
        return true;        
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
                    world.map.entities[i].bonus.attack = false;
                    world.map.entities[i].bonus.fear = false;                    
                    world.map.entities[i].moves = 1;                
                    world.map.entities[i].selected = false;
                }

                game.unit_selected = false;

                               
                if(game.turn.team == 1){
                    game.turn.team = 0;
                    game.turn.id++;
                }else{
                    game.turn.team = 1;
                }
                
                this.killZombies();                        
                this.shoutTeam();          
                this.makeNewLife({
                    trees: 2,
                    grow: 1
                });
                this.teams[this.turn.team].bought = false;
                fogOfWar.update();                                                
                this.payDay();
                this.bonuses();
                shop.show();
                GUI.show = ['map','inventory','gold','trees','end','surrender'];
                render.render({items:true, gui:true, menu:true, entities:true, sky:true});                                   
            }else{
            	return true;
            }

            if(this.turn.id == 1){
                shop.buyStarter();
                game.shoutTeam();   
                render.render({gui:true, menu:true, entities:true, sky:true});
            }

            
            if(!game.ready && !this.teams[0].ai && !this.teams[1].ai){
                multi.show();
                render.viewport.offset = {
                    x:this.teams[this.turn.team].offset.x, 
                    y:this.teams[this.turn.team].offset.y};
            }else{
                game.play = true;
            }
            
            if(this.teams[this.turn.team].ai){
                 computer.init();
            }
            bank.save();
    },

    payDay: function(){
        var salary = {
                gold: game.teams[game.turn.team].income.gold,
                trees: game.teams[game.turn.team].income.trees
            };

        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].income.gold>0 || world.map.entities[i].income.trees>0){
                salary.gold += world.map.entities[i].income.gold;
                salary.trees += world.map.entities[i].income.trees;
            }
        };
        
        game.teams[game.turn.team].wallet.gold += salary.gold;
        game.teams[game.turn.team].wallet.trees += salary.trees;
        game.updateWallet();        
    },

    bonuses: function(){
        var bonus = [];

        // generate database of bonuse surces

        for (var i = 0; i < world.map.items.length; i++) {
            if(world.map.items[i].give_bonus.attack || world.map.items[i].give_bonus.fear){
                bonus.push({
                    attack: world.map.items[i].give_bonus.attack,
                    fear: world.map.items[i].give_bonus.fear,
                    x:world.map.items[i].x,
                    y:world.map.items[i].y,
                    team: world.map.items[i].team
                });
            }
        };

        for (i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].give_bonus.attack || world.map.entities[i].give_bonus.fear){
                bonus.push({
                    attack: world.map.entities[i].give_bonus.attack,
                    fear: world.map.entities[i].give_bonus.fear,
                    x:world.map.entities[i].x,
                    y:world.map.entities[i].y,
                    team: world.map.entities[i].team
                });
            }
        };

        function distance(x1,y1,x2,y2,max){
            var dx = x2 - x1,
                dy = y2 - y1;

            var distance = Math.sqrt(dx*dx + dy*dy);
            if(distance<max){
                return true;
            }else{
                return false;
            }
        }        

        // give bonuses
        for (i = 0; i < world.map.entities.length; i++) {
            for (var j = 0; j < bonus.length; j++) {                        
                if(distance(world.map.entities[i].x, world.map.entities[i].y, bonus[j].x,bonus[j].y,2) && bonus[j].team === world.map.entities[i].team){
                    if(bonus[j].attack){                            
                        world.map.entities[i].bonus.attack = true;
                    }
                    if(bonus[j].fear){
                        world.map.entities[i].bonus.fear = true;
                    }
                }   
            }
        }
    },

    makeNewLife: function(args){
        var seeds = [],
            grow = [];

        for (var y = 0; y < world.map.height; y++) {
            for (var x = 0; x < world.map.width; x++) {
                if(world.map.moves[x+(world.map.width*y)] == 1){
                    if(world.map.moves[(x+1)+(world.map.width*y)] == 2 || 
                        world.map.moves[(x+1)+(world.map.width*(y-1))] == 2 || 
                        world.map.moves[(x+1)+(world.map.width*(y+1))] == 2 || 
                        world.map.moves[x+(world.map.width*(y+1))] == 2 || 
                        world.map.moves[x+(world.map.width*(y-1))] == 2 || 
                        world.map.moves[(x-1)+(world.map.width*(y+1))] == 2 || 
                        world.map.moves[(x-1)+(world.map.width*(y-1))] == 2){
                            seeds.push({x:x,y:y});
                    }
                }                
            }            
        }

        for (var i = 0; i < world.map.items.length; i++) {
            if(world.map.items[i].forest && world.map.items[i].palms == 1){
                grow.push(world.map.items[i]);
            }
        };

        for (var i = 0; i < world.map.entities.length; i++) {
            for (var j = 0; j < seeds.length; j++) {
                if(world.map.entities[i].x === seeds[j].x && world.map.entities[i].y === seeds[j].y){
                    seeds.splice(j,1);
                }
            }      
        };        
        
        var randomizer = new Date();
        Math.seedrandom(randomizer);

        if(seeds.length>0){
            for (var i = 0; i < args.trees; i++) {
                var rnd = (Math.random()*seeds.length)<<0; 
                if(world.map.moves[seeds[rnd].x+(world.map.width*seeds[rnd].y)] == 1){
                    world.map.items.push(new Palm({x:seeds[rnd].x, y:seeds[rnd].y, palms:1}));
                    world.map.moves[seeds[rnd].x+(world.map.width*seeds[rnd].y)] = 2;
                }
                seeds.splice(rnd,1);
            }
        }
        if(grow.length>0){
            for (var i = 0; i < args.grow; i++) {
                var rnd = (Math.random()*grow.length)<<0;
                grow[rnd].grow();
            }        
        }

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
        game.teams[game.turn.team].ai = false;       
        GUI.render({end:true,message:'You win!'})        
    },

    lose: function(){        
        game.teams[game.turn.team].ai = false;       
        GUI.render({end:true,message:'You lose :('})        
    },


        
    setWallet: function(gold){
        for (var i = 0; i < game.teams.length; i++) {
            game.teams[i].wallet.gold = gold;    
        }
        game.updateWallet();
    },
    
    updateWallet: function(){
        render.render({menu:true});
    },
    
    
    shoutTeam: function(){
        for (var i = 0; i < world.map.entities.length; i++) {
            world.map.entities[i].message = null;
            if(world.map.entities[i].team === game.turn.team && world.map.entities[i].reloading < 1){
                world.map.entities[i].shout();
            }
        }
    },

    shareMap: function(){

        if(!this.sharing){
            alert('This could take a moment.. image will be open in new window when ready.');
            this.sharing = true;

            var m_canvas = document.createElement('canvas');
                m_canvas.width = render.map.canvas.width;
                m_canvas.height = render.map.canvas.height;
            var m_context = m_canvas.getContext('2d');
            
            // map
            m_context.drawImage(render.map.canvas, 0, 0);
            m_context.drawImage(render.items.canvas, 0, 0);
            m_context.drawImage(render.front.canvas, 0, 0);

            // logo
            m_context.drawImage(GUI.hud['logo'].sprite, ((m_canvas.width*0.5)-(GUI.hud['logo'].sprite.width*0.5))<<0, 16);
            
            // hash
            m_context.fillStyle = GUI.conf.color2;
            m_context.font = '18px VT323, cursive';
            m_context.textBaseline = 'bottom';
            m_context.textAlign = 'center';

            m_context.fillText('TO PLAY THIS MAP USE THIS URL: HTTP://PIRADICE.KRZYSZTOFJANKOWSKI.COM/PLAY/' + window.location.hash, (m_canvas.width*0.5)<<0, m_canvas.height-8);       

            var canvasData = m_canvas.toDataURL("image/png");
            var uuid = utilities.createUUID();
            
            var ajax = new XMLHttpRequest();
            ajax.open("POST",'share/save.php?filename='+uuid,true);
            ajax.setRequestHeader('Content-Type', 'application/upload');
            ajax.send(canvasData); 
            
            ajax.onreadystatechange=function(){
                if (ajax.readyState==4 && ajax.status==200){                
                    window.open('http://piradice.krzysztofjankowski.com/share/'+uuid+'.png', '_blank');
                    game.sharing = false;
                }
            };
        }
    },

    pirate: function(){
        this.teams[0].wallet.gold = 999;
        this.teams[0].wallet.trees = 999;
        this.teams[1].wallet.gold = 999;
        this.teams[1].wallet.trees = 999;
        alert('Arr!');
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

    createUUID: function() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        
        var uuid = s.join("");
        return uuid;
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
        if(game.fow){
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
        }
    },    
};