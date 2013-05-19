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
    this.environment = false;
    this.chest = false;
    this.flora = false;
    this.flip = 0;
    this.render_front = false;
    this.give_bonus = {
        attack: false,
        fear: false
    }
};

Item.prototype = {        
    open: function(pirate){    
        if(pirate && this.can_open && this.close){            
            this.flip = 1;
            this.close = false;                            
            return true;
        }else
        if(!pirate && this.can_open && !this.close){
            this.flip = 0;
            this.close = true;
            return true;
        }else{
            return false;
        }
        
    },

    grow: function(){
        this.flip = (Math.random()*2)<<0;
        if(this.forest){
            if( this.palms == 0){
                this.palms++;
                this.sprite = this.sprites.palm[(Math.random()*this.sprites.palm.length)<<0];
            }else
            if( this.palms == 1){
                this.palms++;
                this.sprite = this.sprites.forest[(Math.random()*this.sprites.forest.length)<<0];
            }
        }
        if(this.environment){            
            this.sprite = this.sprites[this.biome][(Math.random()*this.sprites[this.biome].length)<<0];
        	for (var i = 0; i < this.push_back.length; i++) {
        		if (this.push_back[i] === this.sprite) {        		
        		    this.render_front = false;        		   			
        		}
        	}
        }
        if(this.rock){
            this.sprite = this.sprites[this.biome][(Math.random()*this.sprites[this.biome].length)<<0];
        }
    },
    
    cut: function(){
        if(this.forest){                        
            if(this.palms > 0){                
                this.palms--;
                this.flip = (Math.random()*2)<<0;
                this.sprite = this.sprites.palm[(Math.random()*this.sprites.palm.length)<<0];                                      
                if(this.palms === 0){
                    this.flip = (Math.random()*2)<<0;
                    this.sprite = this.sprites.cutted[(Math.random()*this.sprites.cutted.length)<<0];
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
    this.flora = true;
    this.biome = 'grass';
    this.sprite = 55;
    this.sprites = {
        'cutted':[54],
        'palm':[55,75],
        'forest':[56,76],
    }
};

Palm.prototype = new Item();

var Rock = function Rock(args){
    this.name = 'Rock';
    this.rock = true;
    this.x = args.x;
    this.y = args.y;
    this.biome = 'water';
    this.sprite = 93;
    this.sprites = {
        'water':[93,94,95,96]
    }
};

Rock.prototype = new Item();

var Environment = function Environment(args){
    this.name = 'Environment';
    this.environment = true;
    this.x = args.x;
    this.y = args.y;
    this.flora = true;
    this.biome = args.biome;
    this.render_front = true;
    this.sprite = 79;
    this.sprites = {
        'normal':[77,78,79,80,81,82,83,84],
        'grass':[77,78,79,80,81,82,83,84],
        'sand':[85,86,87,92],
        'water':[88,89,90,91],
    };
    this.push_back = [80,81,82,83,84,88];
};

Environment.prototype = new Item();

var Chest = function Chest(args){
    this.name = 'Chest';
    this.chest = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 13;
    this.flip = 0;
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

