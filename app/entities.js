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
    this.disable_moves = false;
    this.reloading = 0;    
    this.message = null;
    this.messages = [];
    this.important = false;
    this.land = true;
    this.water = false;
    this.flip = 0; 
    this.fow = 3;
    this.create_unit = false;
    this.hasCementary = false;
    this.merging = true;
};

Unit.prototype = {
    select: function(){
        if(this.can_select){
            this.selected = true;
            var map_type = 1;                                    
            
            this.move_area = [];

            if(this.create_unit){

                for (var x = this.x - 1; x <= this.x + 1; x++) {
                    for (var y = this.y - 1; y <= this.y + 1; y++) {
                        if(world.map.moves[(x)+((y)*world.map.width)] == map_type){           
                            var empty = true;
                            for (var j = 0; j < world.map.entities.length; j++) {
                                if(world.map.entities[j].x == x && world.map.entities[j].y == y ){
                                    empty = false;
                                    j = world.map.entities.length;
                                    // isthereabettersolution?
                                }
                            };
                            if(empty){
                                this.move_area.push({x:x,y:y, buy:true});        
                            }
                        }
                    }
                }

                

                if(this.move_area.length > 0){
                    shop.open({team:this.team, more:true});
                }
                
            }

            if(this.water){
                map_type = 0;
            }

            if(this.disable_moves){
                map_type = -1;
            }
            
            if(world.map.moves[(this.x-1)+((this.y)*world.map.width)] == map_type){           
                this.move_area.push({x:this.x-1,y:this.y, move:true});
            }
            
            if(world.map.moves[(this.x)+((this.y-1)*world.map.width)] == map_type){
                this.move_area.push({x:this.x,  y:this.y-1, move:true});
            }
            
            if(world.map.moves[(this.x)+((this.y+1)*world.map.width)] == map_type){
                this.move_area.push({x:this.x,  y:this.y+1, move:true});
            }
                        
            if(world.map.moves[(this.x+1)+((this.y)*world.map.width)] == map_type){
                this.move_area.push({x:this.x+1,  y:this.y, move:true});
            }
            
            
            if(world.map.moves[(this.x-1)+((this.y-1)*world.map.width)] == map_type){
                if(world.map.moves[(this.x-1)+((this.y)*world.map.width)] == map_type || world.map.moves[(this.x)+((this.y-1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x-1,y:this.y-1, move:true});
                }
                
            }
            if(world.map.moves[(this.x-1)+((this.y+1)*world.map.width)] == map_type){
                if(world.map.moves[(this.x-1)+((this.y)*world.map.width)] == map_type || world.map.moves[(this.x)+((this.y+1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x-1,y:this.y+1, move:true});
                }
            }
            if(world.map.moves[(this.x+1)+((this.y-1)*world.map.width)] == map_type){
                if(world.map.moves[(this.x+1)+((this.y)*world.map.width)] == map_type || world.map.moves[(this.x)+((this.y-1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x+1,y:this.y-1, move:true});
                }
            }
            if(world.map.moves[(this.x+1)+((this.y+1)*world.map.width)] == map_type){
                if(world.map.moves[(this.x+1)+((this.y)*world.map.width)] == map_type || world.map.moves[(this.x)+((this.y+1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x+1,y:this.y+1, move:true});
                }
            }
            
            if(!this.lumberjack){
                if(world.map.moves[(this.x-2)+((this.y)*world.map.width)] == map_type && world.map.moves[(this.x-1)+((this.y)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x-2,y:this.y, move:true});            
                }
                if(world.map.moves[(this.x)+((this.y-2)*world.map.width)] == map_type && world.map.moves[(this.x)+((this.y-1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y-2, move:true});
                }            
                if(world.map.moves[(this.x+2)+((this.y)*world.map.width)] == map_type && world.map.moves[(this.x+1)+((this.y)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x+2,  y:this.y, move:true});
                }
                if(world.map.moves[(this.x)+((this.y+2)*world.map.width)] == map_type && world.map.moves[(this.x)+((this.y+1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y+2, move:true});
                }            
            }
            
            if(this.range || this.ship){
                if(world.map.moves[(this.x-3)+((this.y)*world.map.width)] == map_type){
                    if(this.water && world.map.moves[(this.x-2)+((this.y)*world.map.width)] == map_type){
                        this.move_area.push({x:this.x-3,y:this.y, move:true});            
                    }else{
                        this.move_area.push({x:this.x-3,y:this.y, shoot:true});            
                    }                    
                }
                if(world.map.moves[(this.x)+((this.y-3)*world.map.width)] == map_type){
                    if(this.water && world.map.moves[(this.x)+((this.y-2)*world.map.width)] == map_type){
                        this.move_area.push({x:this.x,  y:this.y-3, move:true});
                    }else{
                        this.move_area.push({x:this.x,  y:this.y-3, shoot:true});
                    }
                }            
                if(world.map.moves[(this.x+3)+((this.y)*world.map.width)] == map_type){
                    if(this.water && world.map.moves[(this.x+2)+((this.y)*world.map.width)] == map_type){
                        this.move_area.push({x:this.x+3,  y:this.y, move:true});
                    }else{
                        this.move_area.push({x:this.x+3,  y:this.y, shoot:true});
                    }
                }
                if(world.map.moves[(this.x)+((this.y+3)*world.map.width)] == map_type){
                    if(this.water && world.map.moves[(this.x)+((this.y+2)*world.map.width)] == map_type){
                        this.move_area.push({x:this.x,  y:this.y+3, move:true});
                    }else{
                        this.move_area.push({x:this.x,  y:this.y+3, shoot:true});
                    }
                }            

            }
              
            if(this.lumberjack){
                if(world.map.moves[(this.x-1)+((this.y)*world.map.width)] == 2){           
                    this.move_area.push({x:this.x-1,y:this.y, forest:true});
                }
                
                if(world.map.moves[(this.x)+((this.y-1)*world.map.width)] == 2){
                    this.move_area.push({x:this.x,  y:this.y-1, forest:true});
                }
                
                if(world.map.moves[(this.x)+((this.y+1)*world.map.width)] == 2){
                    this.move_area.push({x:this.x,  y:this.y+1, forest:true});
                }
                            
                if(world.map.moves[(this.x+1)+((this.y)*world.map.width)] == 2){
                    this.move_area.push({x:this.x+1,  y:this.y, forest:true});
                }
            }  
              
            if(this.dust || this.octopus){
                this.move_area = [];
                for (var x = this.x - 2; x <= this.x + 2; x++) {
                    for (var y = this.y - 2; y <= this.y + 2; y++) {
                         if(world.map.moves[(x)+((y)*world.map.width)] == map_type){           
                            if(x == this.x && y == this.y ){
                               
                            }else{
                                this.move_area.push({x:x,y:y, move:true});
                            }
                        }
                    }   
                }
            }

            if(!this.disable_moves){
                for (var i = 0; i < this.move_area.length; i++) {
                    for (var j = 0; j < world.map.entities.length; j++) { 
                        if( world.map.entities[j].x == this.move_area[i].x && world.map.entities[j].y == this.move_area[i].y && world.map.entities[j].team != this.team ){ 
                            this.move_area[i].attack = true;    
                        }
                        
                        if( world.map.entities[j].x == this.move_area[i].x && world.map.entities[j].y == this.move_area[i].y && world.map.entities[j].team == this.team ){ 
                            if(this.name == world.map.entities[j].name && this.merging){
                                this.move_area[i].merge = true;
                            }else{
                                this.move_area[i].move = false;
                            }
                        }
                    }
                }
            }

        }
    },
    
    unselect: function(){
        this.selected = false;
        shop.close({all:false});
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
        
            
        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].x == x && world.map.entities[i].y == y && world.map.entities[i].alive){
                other = world.map.entities[i];    
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
            for (var j = 0; j < world.map.items.length; j++) {                    
                if(world.map.items[j].x == this.x && world.map.items[j].y == this.y){                        
                    if(world.map.items[j].open(this.pirate)){ 
                        this.message = 'Gold';
                        this.important = false;
                        render.render({map:true, gui:true});
                        this.moves--;                            
                        if(this.pirate){
                            game.teams[game.turn.team].wallet += 20;
                        }else{
                            game.teams[game.turn.team].wallet += 50;
                        }
                        game.updateWallet();
                        this.unselect();
                    }
                }                    
            }
        }
    },
    
    attack: function(x,y){
        var other = null;
            
            
        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].x == x && world.map.entities[i].y == y && world.map.entities[i].alive){
                other = world.map.entities[i];                   
            }
        }
                
        if(other && !this.dust && !other.cementary){            
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
        }else
        if(other.cementary){
            if(this.lumberjack){
                other.die();
                return true;
            }
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
        if(this.pirate){
            game.teams[1].wallet += 30;
            game.updateWallet();
        }     
        this.alive = false;
        this.moves = 0;
        game.killZombies();
        game.updateUnits();
        if(this.cementary){
            world.map.items[hasCementary].hasCementary = false;
        }
    },
    
    shout: function(){
        var r = (Math.random()*this.messages.length)<<0;
        this.message = this.messages[r];
        this.important = true;
    },
    
    cut: function(x,y){
        for (var j = 0; j < world.map.items.length; j++) {                    
            if(world.map.items[j].x == x && world.map.items[j].y == y){  
               if(world.map.items[j].cut()){
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
    this.x = args.x;
    this.y = args.y;
    this.team = 0;
    this.squad = 1;
    this.sprite = 17;
    this.messages = ['Arr..', 'Yes?', '..y', 'Go!', 'ye!'];
};

Pirate.prototype = new Unit();

var RangePirate = function RangePirate(args){
    this.name = 'range_pirate';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 29;
    this.range = true;
    this.team = 0;
    this.squad = 1;
    this.messages = ['Fire!', 'Aim', 'Yarr!', 'Bum!'];
    this.fow = 4;
};

RangePirate.prototype = new Unit();


var Lumberjack = function Lumberjack(args){
    this.name = 'lumberjack';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 0;
    this.lumberjack = true;
    this.squad = 1;
    this.max = 1;
    this.sprite = 53;
    this.messages = ['Cut!', 'Hmm', 'Tree'];
    this.fow = 2;
    this.merging = false;
};

Lumberjack.prototype = new Unit();

var Skeleton = function Skeleton(args){
    this.name = 'skeleton';
    this.ai = args.ai || false;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.squad = 1;
    this.sprite = 23;
    this.messages = ['...', '..', '.'];    
};

Skeleton.prototype = new Unit();

var Dust = function Dust(args){
    this.name = 'dust';
    this.ai = args.ai || false;
    this.dust = true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.squad = 1;
    this.max = 1;
    this.sprite = 49;
    this.messages = ['tsss', 'puf', '!@%'];
    this.fow = 4;
    this.merging = false;
};

Dust.prototype = new Unit();

var Ship = function Ship(args){
    this.name = 'ship';
    this.pirate = true;
    this.team = 0;
    this.x = args.x;    
    this.y = args.y;
    this.sprite = 35;
    this.water = true;
    this.range = true;    
    this.create_unit = true;
    this.squad = 1;
    this.messages = ['Sail', 'Ahoy'];
    this.fow = 5;
    this.merging = false;
};

Ship.prototype = new Unit();

var Cementary = function Cementary(args){
    this.name = 'Cementary';
    this.ai = args.ai || false;
    this.cementary = true;
    this.skeleton = true;
    this.create_unit = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.disable_moves = true;
    this.squad = 1;
    this.max = 1;
    this.sprite = 39;
    this.messages = ['uuu', 'ooo'];
    this.fow = 5;
    this.hasCementary = args.hasCementary || false;
    this.merging = false;
};

Cementary.prototype = new Unit();

var Octopus = function Octopus(args){
    this.name = 'octopus';
    this.octopus = true;
    this.skeleton = true;
    this.ai = args.ai || true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 36;
    this.water = true;
    this.team = 1;
    this.squad = 1;
    this.max = 1;
    this.messages = ['Ooo.', 'oo..', 'o?', ':)', ':o', ':['];
    this.merging = false;
};

Octopus.prototype = new Unit();
