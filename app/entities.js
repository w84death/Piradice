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
    this.ai = false;
    this.selected = false;
    this.can_select = true;
    this.move_area = [];
    this.pirate = false;
    this.skeletor = false;
    this.squad = 1;
    this.range = false;
    this.team = 0;
    this.moves = 1;
    this.reloading = 0;
};

Unit.prototype = {
    select: function(){
        if(this.can_select){
            this.selected = true;
            
            this.move_area = [];
            if(world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == 1){           
                this.move_area.push({x:this.x-1,y:this.y});
            }
            if(world.maps[world.map].moves[(this.x-2)+((this.y)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x-2,y:this.y});            
            }
            if(world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y-1});
            }
            if(world.maps[world.map].moves[(this.x)+((this.y-2)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y-2});
            }            
            if(world.maps[world.map].moves[(this.x+2)+((this.y)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x+2,  y:this.y});
            }
            if(world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y+1});
            }
            if(world.maps[world.map].moves[(this.x)+((this.y+2)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y+2});
            }
            if(world.maps[world.map].moves[(this.x+1)+((this.y)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x+1,  y:this.y});
            }
            if(world.maps[world.map].moves[(this.x-1)+((this.y-1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x-1,y:this.y-1});
            }
            if(world.maps[world.map].moves[(this.x-1)+((this.y+1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x-1,y:this.y+1});
            }
            if(world.maps[world.map].moves[(this.x+1)+((this.y-1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x+1,y:this.y-1});
            }
            if(world.maps[world.map].moves[(this.x+1)+((this.y+1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x+1,y:this.y+1});
            }                
        }
    },
    
    unselect: function(){
        this.selected = false;
    },
    
    move: function(x,y){
        
        for (var i = 0; i < this.move_area.length; i++) {
            if(x == this.move_area[i].x && y == this.move_area[i].y && this.reloading < 1){
                if(this.pirate){
                    for (var j = 0; j < world.maps[world.map].items.length; j++) {                    
                        if(world.maps[world.map].items[j].x == x && world.maps[world.map].items[j].y == y){                        
                            world.maps[world.map].items[j].open();   
                            render.render({items:true});
                        }                    
                    }
                }
                
                this.x = x;
                this.y = y;
                this.moves = 0;
                return true;
            }
        }
        
        return false;
    },
    
    merge: function(other){
        if( (this.range && other.range ) || (!this.range && !other.range)){
            while (this.squad < 6 && other.squad > 0) {
                this.squad++;
                this.sprite++;
                other.squad--;
            }                
            other.die();
            return true;
        }else{
            return false;
        }
    },
    
    attack: function(other){
        var dice = null,
            dice2 = null;
        console.log('\n\n\n\n');
        console.log('-------------- SKIRMISH --------------');
        console.log(this.name + ' ' + this.squad + '  -vs-  ' + other.squad + ' ' +  other.name + ' ');
        
        while(this.squad > 0 && other.squad > 0){
            dice = ((Math.random()*5)<<0)+1;
            dice2 = ((Math.random()*5)<<0)+1;
                   
            console.log(this.name + '('+this.squad+')  roll  '+ game.toDice(dice) + ' ' + dice + '   -vs- ' + other.name + '('+other.squad+')  roll ' + game.toDice(dice2) + ' ' + dice2 );
            
            if(dice > dice2){
                other.hit();       
            }else
            if(dice < dice2){
                if(this.range){
                    if((Math.abs(this.x - other.x) < 2) && (Math.abs(this.y - other.y) < 2)){
                        this.hit();
                    }                                        
                }else{
                    this.hit();
                }
            }
            
            
            
        }
        
        
        if(this.squad < 1 ){
            console.log('-------------- DEFEAT --------------');
            console.log(this.name + ' ' + this.squad  + ' -vs- ' + other.squad + ' ' + other.name );
            this.die();
        }
        
        if(other.squad < 1){
            console.log('-------------- VICTORY --------------');
            console.log(this.name, this.squad, '-vs-', other.name, other.squad);            
            
            if(this.range){
                this.reloading = 3;    
            }
            other.die();            
        }
    },
    
    hit: function(){
        this.squad--;
        this.sprite--;    
    },
    
    die: function(){
        this.squad = 0;
        this.moves = 0;
        this.x = 0;
        this.y = 0;    
    },
};

var Pirate = function Pirate(args){
    this.name = 'Pirate';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.team = args.team;
    this.squad = args.squad;
    this.sprite = 17 + args.squad -1;  
};

Pirate.prototype = new Unit();

var RangePirate = function RangePirate(args){
    this.name = 'Range pirate';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 29 + args.squad -1;
    this.range = true;
    this.team = args.team;
    this.squad = args.squad;
};

RangePirate.prototype = new Unit();

var Skeleton = function Skeleton(args){
    this.name = 'Skeleton';
    this.ai = true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = args.team;
    this.squad = args.squad;
    this.sprite = 23 + args.squad -1;    
};

Skeleton.prototype = new Unit();
