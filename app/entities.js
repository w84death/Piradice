/* 
    ----------------------------------------------------------------------------
    
        KRZYSZTOF JANKOWSKI
        PIRADICE
    
        abstract: HTML5 Canvas 2D Turn-based Game Engine    
        created: 06-03-2013
        licence: do what you want and dont bother me
        
    ----------------------------------------------------------------------------
*/

var Unit = function Unit(){    
    this.alive = true;
    this.ai = false;
    this.selected = false;
    this.can_select = true;
    this.move_area = [];
    this.pirate = false;
    this.skeleton = false;
    this.squad = 1;
    this.max = 6;
    this.range = false;
    this.transport = false;
    this.on_board = [];
    this.team = 0;
    this.moves = 1;
    this.reloading = 0;    
    this.message = null;
    this.messages = [];
    this.important = false;
    this.land = true;
    this.water = false;
    this.flip = 0; 
    this.fow = 3;
};

Unit.prototype = {
    select: function(){
        if(this.can_select){
            this.selected = true;
            var map_type = 1;
            
            if(this.water){
                map_type = 0;
            }
            
            this.move_area = [];
            
            if(world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == map_type){           
                this.move_area.push({x:this.x-1,y:this.y, move:true});
            }
            
            if(world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == map_type){
                this.move_area.push({x:this.x,  y:this.y-1, move:true});
            }
            
            if(world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == map_type){
                this.move_area.push({x:this.x,  y:this.y+1, move:true});
            }
                        
            if(world.maps[world.map].moves[(this.x+1)+((this.y)*world.maps[world.map].width)] == map_type){
                this.move_area.push({x:this.x+1,  y:this.y, move:true});
            }
            
            
            if(world.maps[world.map].moves[(this.x-1)+((this.y-1)*world.maps[world.map].width)] == map_type){
                if(world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == map_type || world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x-1,y:this.y-1, move:true});
                }
                
            }
            if(world.maps[world.map].moves[(this.x-1)+((this.y+1)*world.maps[world.map].width)] == map_type){
                if(world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == map_type || world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x-1,y:this.y+1, move:true});
                }
            }
            if(world.maps[world.map].moves[(this.x+1)+((this.y-1)*world.maps[world.map].width)] == map_type){
                if(world.maps[world.map].moves[(this.x+1)+((this.y)*world.maps[world.map].width)] == map_type || world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x+1,y:this.y-1, move:true});
                }
            }
            if(world.maps[world.map].moves[(this.x+1)+((this.y+1)*world.maps[world.map].width)] == map_type){
                if(world.maps[world.map].moves[(this.x+1)+((this.y)*world.maps[world.map].width)] == map_type || world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x+1,y:this.y+1, move:true});
                }
            }
            
            if(!this.lumberjack){
                if(world.maps[world.map].moves[(this.x-2)+((this.y)*world.maps[world.map].width)] == map_type && world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x-2,y:this.y, move:true});            
                }
                if(world.maps[world.map].moves[(this.x)+((this.y-2)*world.maps[world.map].width)] == map_type && world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y-2, move:true});
                }            
                if(world.maps[world.map].moves[(this.x+2)+((this.y)*world.maps[world.map].width)] == map_type && world.maps[world.map].moves[(this.x+1)+((this.y)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x+2,  y:this.y, move:true});
                }
                if(world.maps[world.map].moves[(this.x)+((this.y+2)*world.maps[world.map].width)] == map_type && world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y+2, move:true});
                }            
            }
            
            if(this.range && !this.water){
                if(world.maps[world.map].moves[(this.x-3)+((this.y)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x-3,y:this.y, shoot:true});            
                }
                if(world.maps[world.map].moves[(this.x)+((this.y-3)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y-3, shoot:true});
                }            
                if(world.maps[world.map].moves[(this.x+3)+((this.y)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x+3,  y:this.y, shoot:true});
                }
                if(world.maps[world.map].moves[(this.x)+((this.y+3)*world.maps[world.map].width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y+3, shoot:true});
                }            

            }
              
            if(this.lumberjack){
                if(world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == 2){           
                    this.move_area.push({x:this.x-1,y:this.y, forest:true});
                }
                
                if(world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == 2){
                    this.move_area.push({x:this.x,  y:this.y-1, forest:true});
                }
                
                if(world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == 2){
                    this.move_area.push({x:this.x,  y:this.y+1, forest:true});
                }
                            
                if(world.maps[world.map].moves[(this.x+1)+((this.y)*world.maps[world.map].width)] == 2){
                    this.move_area.push({x:this.x+1,  y:this.y, forest:true});
                }
            }  
              
            for (var i = 0; i < this.move_area.length; i++) {
                for (var j = 0; j < world.maps[world.map].entities.length; j++) { 
                    if( world.maps[world.map].entities[j].x == this.move_area[i].x && world.maps[world.map].entities[j].y == this.move_area[i].y && world.maps[world.map].entities[j].team != this.team ){ 
                        this.move_area[i].attack = true;    
                    }
                    
                    if( world.maps[world.map].entities[j].x == this.move_area[i].x && world.maps[world.map].entities[j].y == this.move_area[i].y && world.maps[world.map].entities[j].team == this.team ){ 
                        if(this.name == world.maps[world.map].entities[j].name){
                            this.move_area[i].merge = true;
                        }else{
                            this.move_area[i].move = false;
                        }
                    }
                }
            }

        }
    },
    
    unselect: function(){
        this.selected = false;
    },
    
    move: function(x,y){

        if(this.x > x){
            this.flip = 1;
        }else{
            this.flip = 0;
        }
        this.x = x;
        this.y = y;
        this.moves = 0;
        this.message = false;
        return true;        
        
        return false;
    },
    
    merge: function(x,y){            
        var other = null;
        
            
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {
            if(world.maps[world.map].entities[i].x == x && world.maps[world.map].entities[i].y == y && world.maps[world.map].entities[i].alive){
                other = world.maps[world.map].entities[i];    
            }
        }
        
        if(other){
            if(this.water || other.water ){
                return false
            }else
            if( (this.range && other.range ) || (!this.range && !other.range) && !this.lumberjack && !other.lumberjack){
                while (this.squad < 6 && other.squad > 0) {
                    this.squad++;
                    this.sprite++;
                    other.squad--;
                }           
                this.shout();            
                other.die();
                this.moves = 0;
                return true;
            }else{
                return false;
            }
        }
        
        return true;
    },
    
    open: function(){
            if(this.moves > 0){
                for (var j = 0; j < world.maps[world.map].items.length; j++) {                    
                    if(world.maps[world.map].items[j].x == this.x && world.maps[world.map].items[j].y == this.y){                        
                        if(world.maps[world.map].items[j].open(this.pirate)){ 
                            this.message = 'Gold';
                            this.important = false;
                            render.render({map:true, gui:true});
                            this.moves--;                            
                            game.teams[game.turn.team].wallet += 20;
                            game.updateGold();
                            this.unselect();
                        }
                    }                    
                }
            }
    },
    
    attack: function(x,y){
        var other = null;
            
            
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {
            if(world.maps[world.map].entities[i].x == x && world.maps[world.map].entities[i].y == y && world.maps[world.map].entities[i].alive){
                other = world.maps[world.map].entities[i];   
                
            }
        }
                
        if(other && !this.dust){            
            var dice = null,
                dice2 = null,
                total = 0,
                total2 = 0;
            
            if(this.x > other.x){
                this.flip = 1;
            }else{
                this.flip = 0;
            }
                        
            for (var i = 1; i <= this.squad; i++) {
                dice = ((Math.random()*5)<<0)+1;
                dice2 = ((Math.random()*5)<<0)+1;
                       
                total += dice;
                total2 += dice2;
                                                            
                if(this.range){
                    if(dice > dice2){
                        other.hit();
                        other.message = '!';
                        other.important = false;
                    }else
                    if(dice < dice2){
                        if(( (Math.abs(this.x - other.x) < 2) && (Math.abs(this.y - other.y) < 2) ) || other.range){
                            this.hit();
                        }
                        this.message = 'miss';
                        this.important = false;
                    }
                }else{
                    if(dice > dice2){
                        other.hit();       
                    }else
                    if(dice < dice2){                   
                        this.hit();
                    }
                }                                                    
            }    
            
            if(this.range){
                this.reloading = 3;
            }            
        }        
            
        if(this.dust){
            
            other.die();
            this.die();
            return false;
        }else{
            this.moves = 0;
            
            if(this.squad < 1 ){
                other.message = total + '-' + total2;
                other.important = false;
                this.die();
                if(other.squad < 1){                                                 
                    other.die();    
                }
                return false;
            }
            
            
            
            if(other.squad < 1){                                 
                this.message = total + '-' + total2;
                this.important = false;
                other.die();    
                return true;
            }
            
            if(this.squad > 0 && other.squad > 0){
                this.message = total;
                other.message = total2;
                this.important = false;
                other.important = false;
                return false;
            }
        }                
    },
    
    hit: function(){        
        this.squad--;
        this.sprite--;
    },
    
    die: function(){       
        this.alive = false;
        this.moves = 0;
        game.killZombies();
        game.updateUnits();
    },
    
    shout: function(){
        var r = (Math.random()*this.messages.length)<<0;
        this.message = this.messages[r];
        this.important = true;
    },
    
    cut: function(x,y){
        for (var j = 0; j < world.maps[world.map].items.length; j++) {                    
            if(world.maps[world.map].items[j].x == x && world.maps[world.map].items[j].y == y){  
               if(world.maps[world.map].items[j].cut()){
                   this.moves = 0;
               }
            }
        }
        render.render({map:true});
    },
    
    levelUp: function(){
        
    },
};

var Pirate = function Pirate(args){
    this.name = 'pirate';
    this.pirate = true;
    this.ai = args.ai || false;
    this.x = args.x;
    this.y = args.y;
    this.team = args.team;
    this.squad = args.squad;
    this.sprite = 17 + args.squad -1;
    this.messages = ['Arr..', 'Yes?', '..y', 'Go!', 'ye!'];
};

Pirate.prototype = new Unit();

var RangePirate = function RangePirate(args){
    this.name = 'range_pirate';
    this.pirate = true;
    this.ai = args.ai || false;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 29 + args.squad -1;
    this.range = true;
    this.team = args.team;
    this.squad = args.squad;
    this.messages = ['Fire!', 'Aim', 'Yarr!', 'Bum!'];
    this.fow = 4;
};

RangePirate.prototype = new Unit();


var Lumberjack = function Lumberjack(args){
    this.name = 'lumberjack';
    this.pirate = true;
    this.ai = args.ai || false;
    this.x = args.x;
    this.y = args.y;
    this.team = args.team;
    this.lumberjack = true;
    this.squad = 1;
    this.max = 1;
    this.sprite = 53;
    this.messages = ['Cut!', 'Hmm', 'Tree'];
    this.fow = 2;
};

Lumberjack.prototype = new Unit();

var Skeleton = function Skeleton(args){
    this.name = 'skeleton';
    this.ai = args.ai || true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = args.team;
    this.squad = args.squad;
    this.sprite = 23 + args.squad -1;
    this.messages = ['...', '..', '.'];    
};

Skeleton.prototype = new Unit();

var Dust = function Dust(args){
    this.name = 'dust';
    this.ai = args.ai || true;
    this.dust = true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = args.team;
    this.squad = 1;
    this.max = 1;
    this.sprite = 49;
    this.messages = ['tsss', 'puf', '!@%'];
    this.fow = 4;
};

Dust.prototype = new Unit();

var Ship = function Ship(args){
    this.name = 'ship';
    this.pirate = true;
    this.ai = args.ai || false;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 39;
    this.water = true;
    this.range = true;    
    this.transport = true;
    this.squad = 1;
    this.moves = 0;
    this.messages = ['Sail', 'Ahoy'];
    this.fow = 5;
};

Ship.prototype = new Unit();

var BlackPearl = function BlackPearl(args){
    this.name = 'black_pearl';    
    this.pirate = true;
    this.ai = args.ai || false;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 46;
    this.water = true;
    this.range = true;    
    this.transport = true;
    this.team = args.team;
    this.squad = 1;
    this.max = 3;
    this.moves = 0;
    this.messages = ['Sail', 'Ahoy'];
    this.fow = 5;
};

BlackPearl.prototype = new Unit();

var Octopus = function Octopus(args){
    this.name = 'octopus';
    this.octopus = true;
    this.skeleton = true;
    this.ai = args.ai || true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 36;
    this.water = true;
    this.team = args.team;
    this.squad = 1;
    this.max = 1;
    this.messages = ['Ooo.', 'oo..', 'o?', ':)', ':o', ':['];
};

Octopus.prototype = new Unit();
