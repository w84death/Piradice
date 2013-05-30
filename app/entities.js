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

var Unit = function Unit(){    
    this.alive = true;
    this.selected = false;
    this.can_select = true;
    this.move_area = [];
    this.pirate = false;
    this.skeleton = false;
    this.unit = true;
    this.structure = false;
    this.squad = 1;
    this.dice_bonus = false;
    this.max = 6;
    this.range = false;
    this.attack_range = false;  
    this.move_range = 1; 
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
    this.can_create_unit = false;
    this.can_build_structure = false
    this.can_destroy_structure = false;
    this.can_cut_tree = false;
    this.merging = true;
    this.die_after_attack = false;
    this.shop = [];
    this.bonus = {
        attack: false,
        fear: false
    };
    this.give_bonus = {
        attack: false,
        fear: false
    };
    this.income = {
        gold:0,
        trees:0
    };
    this.audio = {
        'move': false,
        'attack': false,
        'die': false,
    };
};

Unit.prototype = {
    select: function(){
        // unit can be selected
        if(this.can_select){
            this.selected = true;
            audio.play({sound:'select_unit'});

            // 1 = land
            var map_type = 1;                                    
            
            this.move_area = [];

            // unit can create other units
            if(this.can_create_unit){

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
                                this.move_area.push({x:x,y:y, buy:true, distance:1, analize:true});        
                            }
                        }
                    }
                }
                
                // if there is a place to create            
                if(this.move_area.length > 0){
                    shop.show({more:true});
                }                
            }

            if(this.can_build_structure){
                shop.show({more:true});
            }

            if(this.water){
                // water
                map_type = 0;
            }

            if(this.disable_moves){
                // unit cant move
                return false;
            }

            // MOVE FINGIND ALGORITHM

            
            // some vars
            var newX = 0,
                newY = 0,
                can_move = false,
                distance = 0,
                analize = true,
                check_area = this.move_range,
                entities_mask = [world.map.width+20];
                
                if (this.attack_range > this.move_range) {
                    check_area = this.attack_range;
                }            

            function searchEntitie(x,y){
                for (var i = 0; i < world.map.entities.length; i++) {
                    if(world.map.entities[i].x === x && world.map.entities[i].y === y){
                        return true;
                    }
                }
                return false;
            }

            // useful function
            function check_move_area(area,x,y){
                for (var z = 0; z < area.length; z++) {
                    if(area[z].x === x && area[z].y === y){
                        return true;                        
                    }
                }
                return false;
            }

            // generate first point 0
            this.move_area.push({x:this.x,  y:this.y, move:true, distance:0, analize:true});
            				
            // calculate other moves
            for (var i = 0; i < check_area; i++) {
                for (var j = 0; j < this.move_area.length; j++) {
                    if(this.move_area[j].distance === i && this.move_area[j].analize){
                        // check moves and add distance
                        newX = this.move_area[j].x-1;
                        newY = this.move_area[j].y;
                        
                        analize = true;
                        if(world.map.moves[(newX)+((newY)*world.map.width)] === map_type && !check_move_area(this.move_area,newX,newY)){
                    		if(this.move_range >= i+1){
                        		if(searchEntitie(newX,newY)){
                                    can_move = false;                                    
                                    analize = false;
                                    if(this.range){                                    
                                        analize = true;
                                    }
                                }else{
                                    can_move = true;
                                    analize = true;
                                    if(!this.move_area[j].move && this.range){                                    
                                        can_move = false;
                                    }
                                }
                    		}else{
                    			can_move = false;                                
                    		}

                            this.move_area.push({x:newX,y:newY, move:can_move, distance:i+1, analize:analize});
                        }
                        
                        newX = this.move_area[j].x;
                        newY = this.move_area[j].y-1;
                        if(world.map.moves[(newX)+((newY)*world.map.width)] === map_type && !check_move_area(this.move_area,newX,newY)){
                            if(this.move_range >= i+1){
                                if(searchEntitie(newX,newY)){
                                    can_move = false;
                                    analize = false;
                                    if(this.range){                                    
                                        analize = true;
                                    }
                                }else{
                                    can_move = true;
                                    analize = true;
                                    if(!this.move_area[j].move && this.range){                                    
                                        can_move = false;
                                    }
                                }
                            }else{
                                can_move = false;
                            }

                            this.move_area.push({x:newX,y:newY, move:can_move, distance:i+1, analize:analize});
                        }
                        
                        newX = this.move_area[j].x;
                        newY = this.move_area[j].y+1;
                        if(world.map.moves[(newX)+((newY)*world.map.width)] === map_type && !check_move_area(this.move_area,newX,newY)){
                            if(this.move_range >= i+1){
                                if(searchEntitie(newX,newY)){
                                    can_move = false;
                                    analize = false;
                                    if(this.range){                                    
                                        analize = true;
                                    }
                                }else{
                                    analize = true;
                                    can_move = true;
                                    if(!this.move_area[j].move && this.range){                                    
                                        can_move = false;
                                    }
                                }
                            }else{
                                can_move = false;
                            }
                            this.move_area.push({x:newX,y:newY, move:can_move, distance:i+1, analize:analize});
                        }
                         
                        newX = this.move_area[j].x+1;
                        newY = this.move_area[j].y;            
                        if(world.map.moves[(newX)+((newY)*world.map.width)] === map_type && !check_move_area(this.move_area,newX,newY)){
                            if(this.move_range >= i+1){
                                if(searchEntitie(newX,newY)){
                                    can_move = false;
                                    analize = false;
                                    if(this.range){                                    
                                        analize = true;
                                    }
                                }else{
                                    can_move = true;
                                    analize = true;
                                    if(!this.move_area[j].move && this.range){                                    
                                        can_move = false;
                                    }
                                }
                            }else{
                                can_move = false;
                            }
                            this.move_area.push({x:newX,y:newY, move:can_move, distance:i+1, analize:analize});	
                        }
                    }
                };
            };

            // clear 0,0
            for (var r = 0; r < this.move_area.length; r++) {
                if(this.move_area[r].x === this.x && this.move_area[r].y === this.y){
                    this.move_area.splice(r,1);
                }
            }

            // trees for cutters
            if(this.can_cut_tree){
                
                // tree/palm
                map_type = 2;

                if(world.map.moves[(this.x-1)+((this.y)*world.map.width)] == map_type){           
                    this.move_area.push({x:this.x-1,y:this.y, forest:true});
                }
                
                if(world.map.moves[(this.x)+((this.y-1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y-1, forest:true});
                }
                
                if(world.map.moves[(this.x)+((this.y+1)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x,  y:this.y+1, forest:true});
                }
                            
                if(world.map.moves[(this.x+1)+((this.y)*world.map.width)] == map_type){
                    this.move_area.push({x:this.x+1,  y:this.y, forest:true});
                }
            }

            // check if enemy/ally/structure
            // ..
            for (var i = 0; i < this.move_area.length; i++) {
                for (var j = 0; j < world.map.entities.length; j++) { 

                    // unit in movable area
                    if(this.move_area[i].x === world.map.entities[j].x && this.move_area[i].y === world.map.entities[j].y ){
                                          // enemy
                        if(world.map.entities[j].team != this.team && world.map.entities[j].unit){
                            this.move_area[i].attack = true;
                        }

                        // ally

	                    if(world.map.entities[j].team === this.team && world.map.entities[j].name == this.name && this.merging && this.move_area[i].distance <= 2){             
                            this.move_area[i].merge = true;
                        }

                        // structure
                        if(world.map.entities[j].structure && world.map.entities[j].team !== this.team){                            
                            if(this.can_destroy_structure){
                                this.move_area[i].attack = true;
                            }
                        }
                        
                        // cant move there
                        this.move_area[i].move = false;
                    }
                }
            }
        }        
    },
  
    unselect: function(){
        this.selected = false;
        game.unit_selected = false;
        if(game.play){
            shop.close();
        }
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
            if( (this.attack_range && other.attack_range ) || (!this.attack_range && !other.attack_range) && !this.lumberjack && !other.lumberjack){
                while (this.squad < 6 && other.squad > 0) {
                    this.squad++;
                    this.sprite++;
                    other.squad--;
                }           
                this.shout();            
                other.die(false);
                this.moves = 0;
                return true;
            }else{
                return false;
            }
        }
        
        return true;
    },
    
    open: function(){
        var gold = 20 + (Math.random()*50)<<0;
        if(this.moves > 0){
            for (var j = 0; j < world.map.items.length; j++) {                    
                if(world.map.items[j].x == this.x && world.map.items[j].y == this.y){                        
                    if(world.map.items[j].open(this.pirate)){ 
                        if(this.pirate){
                            game.teams[game.turn.team].wallet.gold += gold;
                            this.message = '+'+gold;
                        }else{
                            gold = (gold * 0.5)<<0
                            game.teams[game.turn.team].wallet.gold += gold;
                            this.message = '+'+gold;
                        }

                        audio.play({sound:'gold'});

                        this.important = false;
                        render.render({items:true, gui:true});
                        this.moves--;                            
                        
                        game.updateWallet();
                        this.unselect();
                    }
                }                    
            }
        }
    },
    

    attack: function(x,y){
        var turn = 1,
            other = null,
            this_army = {
                squad: 0,
                dice: 0,
                total: 0,
                bonus: 0,
                utf8_dices: '',                
            },
            other_army = {
                squad: 0,
                dice: 0,
                total: 0,
                bonus: 0,
                utf8_dices: '',                
            },
            war_log = {
                title: '',
                message: ''
            },
            fight_result = false;

        // search opponent
        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].x == x && world.map.entities[i].y == y && world.map.entities[i].alive){
                other = world.map.entities[i];                   
            }
        }

        // if found lets fight!        
        if(other){
            if(this.audio.attack){
               audio.play({sound:this.audio.attack});
            }
            // save army stats
            this_army.squad = this.squad;
            other_army.squad = other.squad;            

            // flip sprite to the oponenet
            if(this.x > other.x){
                this.flip = 1;
            }else{
                this.flip = 0;
            }

            // start fight
            while(turn <= this_army.squad && this.squad > 0 && other.squad > 0){

                // bonuses    
                if(this.dice_bonus){
                    this_army.bonus += this.dice_bonus;
                }else{
                    // squad bonus (50%)            
                    this_army.bonus += 1+(this.squad*0.5)<<0;
                }

                if(this.bonus.attack){
                    this_army.bonus += 1;
                }

                if(this.bonus.fear){
                    this_army.bonus -= 1;
                }
                
                //throwing the dice + saveing warlog
                this_army.dice = ((Math.random()*5)<<0)+this_army.bonus;                
                if(this_army.dice>6){this_army.dice=6;}
                if(this_army.dice<1){this_army.dice=1;}
                this_army.utf8_dices += '['+this_army.dice+']';//utilities.toDice(this_army.dice);
                this_army.total += this_army.dice;

                // bonuses
                if(this.dice_bonus){
                    this_army.bonus = this.dice_bonus;
                }else{ 
                    // squad bonus (50%)
                    other_army.bonus = 1+(other.squad*0.5)<<0;
                }
                
                // throwing the dice + saveing warlog
                if(other.reloading){
                    // while reloading unit has very low attack
                    other_army.dice = 1
                }else{
                    other_army.dice = ((Math.random()*5)<<0)+other_army.bonus;
                }

                if(other_army.dice>6){other_army.dice=6;}
                other_army.utf8_dices += '['+this_army.dice+']';//utilities.toDice(other_army.dice);
                other_army.total += other_army.dice;

                // attack_range unit
                if(this.attack_range){
                    
                    if(this_army.dice > other_army.dice){
                        other.hit();
                    }
                    if(this_army.dice < other_army.dice){
                        // if enemy is near
                        if(( (Math.abs(this.x - other.x) < 2) && (Math.abs(this.y - other.y) < 2) ) || ( other.attack_range && !other.reloading )){
                            this.hit();
                        }
                        // else = nothing happend
                    }
                    if(this_army.dice == other_army.dice){
                        // nothing happend
                    }  

                }else{
                // normal units

                    if(this_army.dice > other_army.dice){
                        other.hit();
                    }
                    if(this_army.dice < other_army.dice){
                        this.hit();
                    }
                    if(this_army.dice == other_army.dice){
                        // nothing happend
                    } 

                }

                turn++;
            }

            // attack_range units must reload their weapons
            if(this.range){
                this.reloading = 2;
            }
            if(other.range){
                other.reloading = 2;
            }            

            // units that die after attack must die
            if(this.die_after_attack){
                this.die(true);
            }

            // fight end

            if(this.squad < 1 ){
                this.die(true);
                fight_result = false;
                war_log.header = this.name + ' lose the fight..';
            }
            if(other.squad < 1 ){
                other.die(true);
                if(this.range){
                    fight_result = false;
                }else{
                    fight_result = true;
                }
                if(this.squad > 0){
                    war_log.header = this.name + ' win the fight!';
                }
                if(this.octopus && other.ship){
                    war_log.message = other.name + ' sank in deep!';
                }
            }
            if(this.squad > 0 && other.squad > 0){
                fight_result = false;
                war_log.header = 'Fight ended in a draw.';

                // calculate loses
                var diff = 0;

                if(this_army.squad > this.squad && other_army.squad > other.squad){
                    war_log.message = this.name + ' lost '+ (this_army.squad-this.squad)+ ', '+ other.name + ' ' + (other_army.squad-other.squad)+ ' units.';
                }else
                if(this_army.squad > this.squad){
                    diff = (this_army.squad-this.squad);
                    if(diff == 1){
                        war_log.message = this.name + ' lost one unit.';
                    }else{
                        war_log.message = this.name + ' lost '+ diff + ' units.';
                    }
                }else
                if(other_army.squad > other.squad){
                    diff = (other_army.squad-other.squad);
                    if(diff == 1){
                        war_log.message = other.name + ' lost one unit.';
                    }else{
                        war_log.message = other.name + ' lost '+ diff + ' units.';
                    }
                }

            }

            // war log
            if(!game.teams[game.turn.team].ai){
                GUI.warReport({
                    left: {
                        sprite: this.sprite,
                        hit: this_army.utf8_dices
                    },                
                    right: {
                        sprite: other.sprite,
                        hit: other_army.utf8_dices
                    },
                    title: war_log.header,
                    message: war_log.message
                });
                render.render({menu:true});
            }
            
            // unit has no more moves
            this.moves = 0;

            // clear messages
            this.message = false;

            return fight_result;
        }

    },
    
    hit: function(){        
        this.squad--;
        if(this.squad<1){
            this.sprite = 48;
        }else{
            this.sprite--;
        }
    },
    
    die: function(rip){
        if(rip){ 
            this.rip();
        }
        this.sprite = 48;
        this.alive = false;
        this.moves = 0;
        this.squad = 0;
        game.killZombies();        
    },
    
    rip: function(){
        var clear = true;
        if(this.pirate){
            for (var i = 0; i < world.map.items.length; i++) {
                if(world.map.items[i].rip && world.map.items[i].x == this.x && world.map.items[i].y == this.y ){
                    clear = false;
                }
            };
            if(clear){
                world.map.items.push(new Rip({x:this.x,y:this.y}));
                render.render({items:true});
            }
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
                   this.message = '+1';
                   this.important = false;
                   game.teams[this.team].wallet.trees += 1;
               }
            }
        }
        render.render({items:true, gui:true});
    },
    
    levelUp: function(){
        
    },

};

var Pirate = function Pirate(args){
    this.name = 'Pirate';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 0;
    this.squad = 1;
    this.sprite = 17;
    this.messages = ['Arr..', 'Yes?', '..y', 'Go!', 'ye!'];
    this.move_range = 4;
    this.fow = 5;
    this.bonus = {
        attack: false,
        fear: false
    };
};

Pirate.prototype = new Unit();

var Gunner = function Gunner(args){
    this.name = 'Gunner';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 29; 
    this.range = true;   
    this.team = 0;
    this.squad = 1;
    this.messages = ['Fire!', 'Aim', 'Yarr!', 'Bum!'];
    this.attack_range = 4;
    this.move_range = 3;
    this.fow = 5;
    this.bonus = {
        attack: false,
        fear: false
    };
    this.audio = {
        'attack': 'gun',
    };
};

Gunner.prototype = new Unit();

var Cannon = function Cannon(args){
    this.name = 'Cannon';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 59; 
    this.range = true;   
    this.team = 0;
    this.squad = 1;
    this.merging = false;
    this.messages = ['Fire!', 'Yarr!', 'Bum!'];
    this.attack_range = 6;
    this.move_range = 2;
    this.can_destroy_structure = true;
    this.fow = 7;
    this.bonus = {
        attack: false,
        fear: false
    };
    this.audio = {
        'attack': 'cannon',
    };
};

Cannon.prototype = new Unit();

var Lumberjack = function Lumberjack(args){
    this.name = 'Lumberjack';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 0;
    this.lumberjack = true;
    this.can_cut_tree = true;
    this.squad = 1;
    this.max = 1;
    this.sprite = 53;
    this.messages = ['Cut!', 'Hmm', 'Tree'];
    this.move_range = 3;
    this.fow = 4;
    this.merging = false;
    this.can_build_structure = true;
    this.shop = ['fort'];
    this.bonus = {
        attack: false,
        fear: false
    };
};

Lumberjack.prototype = new Unit();

var Skeleton = function Skeleton(args){
    this.name = 'Skeleton';
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.squad = 1;
    this.sprite = 23;
    this.messages = ['...', '..', '.'];
    this.move_range = 3;
    this.fow = 4;  
    this.bonus = {
        attack: false,
        fear: false
    };  
};

Skeleton.prototype = new Unit();

var Dust = function Dust(args){
    this.name = 'Dust';    
    this.dust = true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.squad = 1;
    this.max = 1;
    this.sprite = 49;
    this.messages = ['tsss', 'puf', '!@%'];
    this.move_range = 3;
    this.fow = 4;
    this.merging = false;
    this.dice_bonus = 6;
    this.die_after_attack = true;
    this.can_cut_tree = true;
    this.can_build_structure = true;
    this.shop = ['bonfire'];
    this.bonus = {
        attack: false,
        fear: false
    };
};

Dust.prototype = new Unit();

var Ship = function Ship(args){
    this.name = 'Ship';
    this.pirate = true;
    this.ship = true;
    this.team = 0;
    this.x = args.x;    
    this.y = args.y;
    this.sprite = 35;
    this.water = true;
    this.attack_range = true;    
    this.can_create_unit = true;
    this.squad = 1;
    this.messages = ['Sail', 'Ahoy'];
    this.range = true;
    this.move_range = 5;
    this.fow = 6;
    this.merging = false;
    this.shop = ['pirate','lumberjack'];
    this.bonus = {
        attack: false,
        fear: false
    };
    this.income.gold = 4;
    this.income.trees = 0;
    this.audio = {
        'attack': 'cannon',
    };
};

Ship.prototype = new Unit();

var Cementary = function Cementary(args){
    this.name = 'Cementary';
    this.cementary = true;
    this.structure = true;
    this.unit = false;
    this.skeleton = true;
    this.can_create_unit = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.disable_moves = true;
    this.squad = 1;
    this.max = 1;
    this.sprite = 39;
    this.messages = ['uuu', 'ooo'];
    this.fow = 7;
    this.hasCementary = args.hasCementary || false;
    this.merging = false;
    this.shop = ['skeleton','dust'];
    this.bonus = {
        attack: false,
        fear: false
    };
    this.income.gold = 4;
    this.income.trees = 0;   
};

Cementary.prototype = new Unit();

var Octopus = function Octopus(args){
    this.name = 'Octopus';
    this.octopus = true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 36;
    this.water = true;
    this.team = 1;
    this.squad = 1;
    this.max = 1;
    this.messages = ['Ooo.', 'oo..', 'o?', ':)', ':o', ':['];
    this.merging = false;
    this.range = false;
    this.move_range = 4;
    this.fow = 5;
    this.dice_bonus = 6;
    this.bonus = {
        attack: false,
        fear: false
    };
};

Octopus.prototype = new Unit();

var Daemon = function Daemon(args){
    this.name = 'Daemon';
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.sprite = 68; 
    this.range = true;   
    this.team = 1;
    this.squad = 1;
    this.merging = false;
    this.messages = ['Sss', 'Phh', 'Fuff', 'Grrr'];
    this.attack_range = 4;
    this.move_range = 3;
    this.fow = 6;
    this.give_bonus.fear = true;
    this.bonus = {
        attack: false,
        fear: false
    };
    this.audio = {
        'attack': 'gun',
    };
};

Daemon.prototype = new Unit();

var Bonfire = function Bonfire(args){
    this.name = 'Bonfire';
    this.bonfire = true;
    this.unit = true;
    this.skeleton = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 1;
    this.squad = 1;
    this.max = 1;
    this.sprite = 70;
    this.messages = ['Hoo', 'Boosh', 'Poof'];
    this.fow = 7;
    this.can_create_unit = true;
    this.merging = false;
    this.range = true;
    this.move_range = 0;
    this.attack_range = 6;
    this.shop = ['daemon'];
    this.bonus = {
        attack: false,
        fear: false
    };
    this.income.gold = 5;
    this.income.trees = 0;
    this.audio = {
        'attack': 'cannon',
    };
};

Bonfire.prototype = new Unit();


var Fort = function Fort(args){
    this.name = 'Fort';
    this.fort = true;
    this.structure = true;
    this.unit = false;
    this.pirate = true;    
    this.x = args.x;
    this.y = args.y;
    this.team = 0;
    this.disable_moves = true;
    this.squad = 1;
    this.max = 1;
    this.sprite = 71;
    this.messages = ['Ready', 'Start'];
    this.fow = 6;
    this.merging = false;
    this.can_create_unit = true;
    this.shop = ['cannon', 'gunner', 'chieftain'];
    this.bonus = {
        attack: false,
        fear: false
    };
    this.income.gold = 2,
    this.income.trees = 1
};

Fort.prototype = new Unit();

var Chieftain = function Chieftain(args){
    this.name = 'Chieftain';
    this.pirate = true;
    this.x = args.x;
    this.y = args.y;
    this.team = 0;
    this.squad = 1;
    this.sprite = 74;
    this.messages = ['Arr..', 'Do it', 'Go!', 'ye!'];
    this.move_range = 4;
    this.fow = 5;
    this.bonus = {
        attack: false,
        fear: false
    };    
    this.give_bonus.attack = true; 
};

Chieftain.prototype = new Unit();


