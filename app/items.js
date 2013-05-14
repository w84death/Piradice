/* 
    ----------------------------------------------------------------------------
    
        KRZYSZTOF JANKOWSKI && PRZEMYSLAW SIKORSKI
        PIRADICE
    
        abstract: HTML5 Canvas 2D Turn-based Game Engine    
        created: 06-03-2013
        licence: do what you want and dont bother me
        
        webpage: http://piradice.krzysztofjankowski.com
        twitter: @w84death, @rezoner
        
    ----------------------------------------------------------------------------
*/


var Item = function Item(){        
    this.can_open = false;
    this.forest = false;
    this.chest = false;
    this.give_bonus = {
        attack: false,
        fear: false
    }
};

Item.prototype = {        
    open: function(pirate){    
        if(pirate && this.can_open && this.close){            
            this.sprite = this.sprite_open;
            this.close = false;                            
            return true;
        }else
        if(!pirate && this.can_open && !this.close){
            this.sprite = this.sprite_open-1;
            this.close = true;
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
                    world.map.moves[(this.x)+((this.y)*world.map.width)] = 1;
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
    this.name = 'Chest';
    this.chest = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 13;
    this.sprite_open = 14;
    this.can_open = true;
    this.close = true;
};

Chest.prototype = new Item();

var Rip = function Rip(args){
    this.name = 'Rip';
    this.rip = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 72;
    this.give_bonus.attack = true; 
    this.team = 1;
};

Rip.prototype = new Item();

