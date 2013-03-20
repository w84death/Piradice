/* 
    ----------------------------------------------------------------------------
    
        KRZYSZTOF JANKOWSKI
        PIRADICE
    
        abstract: HTML5 Canvas 2D Turn-based Game Engine    
        created: 06-03-2013
        licence: do what you want and dont bother me
        
    ----------------------------------------------------------------------------
*/


var Item = function Item(){        
    this.can_open = false;
    this.forest = false;
};

Item.prototype = {        
    open: function(){        
        if(this.can_open && this.close){            
            this.sprite = this.sprite_open;
            this.close = false; 
        
            var win = true;
            for (i = 0; i < world.maps[world.map].items.length; i++) {
                if(world.maps[world.map].items[i].can_open && world.maps[world.map].items[i].close){
                    win = false;
                }
            }
            if(win){
                game.win();            
            }
            
            return true;
        }else{
            return false;
        }
        
    },
    
    grow: function(){
        if(this.forest && this.palms == 1){
            this.palms = 2;
            this.sprite++;
        }
    },
    
    cut: function(){
        if(this.forest){                        
            if(this.palms > 0){                
                this.palms--;
                this.sprite--;                                      
                if(this.palms === 0){
                    world.maps[world.map].moves[(this.x)+((this.y)*world.maps[world.map].width)] = 1;
                }
                return true;
            }
        }
        
        return false;
    },
};

var Palm = function Palm(args){
    this.name = 'Palm';
    this.forest = true;
    this.x = args.x;
    this.y = args.y;
    this.palms = args.palms;
    this.sprite = 54 + args.palms;  
};

Palm.prototype = new Item();

var Chest = function Chest(args){
    this.name = 'Ship';
    this.x = args.x;
    this.y = args.y;
    this.sprite = 13;
    this.sprite_open = 14;
    this.can_open = true;
    this.close = true;
};

Chest.prototype = new Item();

