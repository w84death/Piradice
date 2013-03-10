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
    this.message = null;
    this.messages = [];
};

Unit.prototype = {
    select: function(){
        if(this.can_select){
            this.selected = true;
            
            this.move_area = [];
            if(world.maps[world.map].moves[(this.x-1)+((this.y)*world.maps[world.map].width)] == 1){           
                this.move_area.push({x:this.x-1,y:this.y});
            }
            
            if(world.maps[world.map].moves[(this.x)+((this.y-1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y-1});
            }
            
            if(world.maps[world.map].moves[(this.x)+((this.y+1)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y+1});
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
            
            
            if(world.maps[world.map].moves[(this.x-2)+((this.y)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x-2,y:this.y});            
            }
            if(world.maps[world.map].moves[(this.x)+((this.y-2)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y-2});
            }            
            if(world.maps[world.map].moves[(this.x+2)+((this.y)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x+2,  y:this.y});
            }
            if(world.maps[world.map].moves[(this.x)+((this.y+2)*world.maps[world.map].width)] == 1){
                this.move_area.push({x:this.x,  y:this.y+2});
            }            

            if(this.range){
                if(world.maps[world.map].moves[(this.x-3)+((this.y)*world.maps[world.map].width)] == 1 && world.maps[world.map].moves[(this.x-2)+((this.y)*world.maps[world.map].width)] == 1){
                    this.move_area.push({x:this.x-3,y:this.y, shoot:true});            
                }
                if(world.maps[world.map].moves[(this.x)+((this.y-3)*world.maps[world.map].width)] == 1 && world.maps[world.map].moves[(this.x)+((this.y-2)*world.maps[world.map].width)] == 1){
                    this.move_area.push({x:this.x,  y:this.y-3, shoot:true});
                }            
                if(world.maps[world.map].moves[(this.x+3)+((this.y)*world.maps[world.map].width)] == 1 && world.maps[world.map].moves[(this.x+2)+((this.y)*world.maps[world.map].width)] == 1){
                    this.move_area.push({x:this.x+3,  y:this.y, shoot:true});
                }
                if(world.maps[world.map].moves[(this.x)+((this.y+3)*world.maps[world.map].width)] == 1 && world.maps[world.map].moves[(this.x)+((this.y+2)*world.maps[world.map].width)] == 1){
                    this.move_area.push({x:this.x,  y:this.y+3, shoot:true});
                }            

            }

        }
    },
    
    unselect: function(){
        this.selected = false;
    },
    
    move: function(x,y){
        
        for (var i = 0; i < this.move_area.length; i++) {
            if(x == this.move_area[i].x && y == this.move_area[i].y && this.reloading < 1){                
                this.x = x;
                this.y = y;
                this.moves = 0;
                this.message = false;
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
            this.message = this.squad;            
            other.die();
            return true;
        }else{
            return false;
        }
    },
    
    open: function(){
        if(this.pirate){
            for (var j = 0; j < world.maps[world.map].items.length; j++) {                    
                if(world.maps[world.map].items[j].x == this.x && world.maps[world.map].items[j].y == this.y){                        
                    if(world.maps[world.map].items[j].open()){ 
                        this.message = 'Gold';
                        render.render({items:true, gui:true});
                        this.moves--;
                    }
                }                    
            }
        }
    },
    
    attack: function(other){
        var dice = null,
            dice2 = null,
            total = 0,
            total2 = 0;
        
        if(this.range){
             for (var i = 0; i <= this.squad; i++) {
                dice = ((Math.random()*5)<<0)+1;
                dice2 = ((Math.random()*5)<<0)+1;
                       
                total += dice;
                total2 += dice2;
                
                if(dice > dice2){
                    other.hit();
                    other.message = '!';
                }else
                if(dice < dice2){
                    if((Math.abs(this.x - other.x) < 2) && (Math.abs(this.y - other.y) < 2)){
                        this.hit();
                    }
                    this.message = 'miss';
                }
            }            
                        
            this.reloading = 3;            
            
        }else{        
            for (var i = 0; i <= this.squad; i++) {
                dice = ((Math.random()*5)<<0)+1;
                dice2 = ((Math.random()*5)<<0)+1;
                       
                total += dice;
                total2 += dice2;
                            
                if(dice > dice2){
                    other.hit();       
                }else
                if(dice < dice2){                   
                    this.hit();
                }                            
            }            
        }
        
        if(this.squad < 1 ){
            other.message = total + '-' + total2;
            this.die();
            return false;
        }
        
        if(other.squad < 1){                                 
            this.message = total + '-' + total2;
            other.die();    
            return true;
        }
        
        if(this.squad > 0 && other.squad > 0){
            this.message = total;
            other.message = total2;
            return false;
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
    
    shout: function(){
        var r = (Math.random()*this.messages.length)<<0;
        this.message = this.messages[r];        
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
    this.messages = ['Arr..', 'Yes?', '..y', 'Go!', 'ye!'];
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
    this.messages = ['Fire!', 'Aim', 'Yarr!', 'Bum!'];
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
    this.messages = ['...', '..', '.'];
};

Skeleton.prototype = new Unit();
