var shop = {
    price_list: [],

    init: function(){
        this.price_list['pirate'] = 10;
        this.price_list['range_pirate'] = 15;
        this.price_list['lumberjack'] = 40;
        this.price_list['skeleton'] = 15;
        this.price_list['dust'] = 60;
        this.price_list['ship'] = 80;
        this.price_list['cementary'] = 80;
        this.price_list['octopus'] = 40;
    },

    buy: function(args){
        var newX = 0,
            newY = 0;
            ai = game.teams[game.turn.team].ai,
            team = game.turn.team,
            hasCementary = 0;            
        
        if(args.unit == 'cementary'){
           
            var newLocation = this.freeChests();
            if(newLocation){
                newX = newLocation.x;
                newY = newLocation.y;
            }else{
                return false
            };                                                        
            
        }else
        if(args.unit == 'ship' || args.unit == 'octopus'){
            var side = (Math.random()*4)<<00;            

            if(side == 1){
                newX = 1;
                newY = 1 + (Math.random()*(world.map.height-1))<<0;
            }else
            if(side == 2){
                newX = world.conf.width-1;
                newY = 1 + (Math.random()*(world.map.height-1))<<0;
            }else
            if(side == 3){
                newX = 1 + (Math.random()*(world.map.width-1))<<0;
                newY = 1;                
            }else{
                newX = 1 + (Math.random()*(world.map.width-1))<<0;
                newY = world.conf.height-1;
            }

        }else{       
            var buy_spot = [];

            for (var i = 0; i < world.map.entities[game.unit_selected].move_area.length; i++) {
                if(world.map.entities[game.unit_selected].move_area[i].buy){
                    buy_spot.push(i);
                }
            };
            var r = (Math.random()*buy_spot.length)<<0;
            newX = world.map.entities[game.unit_selected].move_area[buy_spot[r]].x
            newY = world.map.entities[game.unit_selected].move_area[buy_spot[r]].y;
        }


        if(this.makeTransaction({team:team, unit:args.unit})){
            
            var use_moves = true;                        

            for (var i = 0; i < world.map.entities.length; i++) {
                if(world.map.entities[i].x == newX && world.map.entities[i].y == newY){
                    world.map.entities[i].die();
                }
            };
            
            if(args.unit == 'pirate'){            
                world.map.entities.push(new Pirate({x:newX,y:newY,team:team, ai:ai}));                                             
            }
            
            if(args.unit == 'range_pirate'){            
                world.map.entities.push(new RangePirate({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'lumberjack'){
                world.map.entities.push(new Lumberjack({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'ship'){
                world.map.entities.push(new Ship({x:newX,y:newY,team:team, ai:ai}));
                use_moves = false;
                game.teams[game.turn.team].bought = true;
            }

            if(args.unit == 'skeleton'){
                world.map.entities.push(new Skeleton({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'dust'){
                world.map.entities.push(new Dust({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'octopus'){
                world.map.entities.push(new Octopus({x:newX,y:newY,team:team, ai:ai}));                
                use_moves = false;
                game.teams[game.turn.team].bought = true;
            }
            
            if(args.unit == 'cementary'){
                world.clearTerrain({x:newX, y:newY, size:1});
                world.map.entities.push(new Cementary({x:newX,y:newY,team:team, ai:ai}));
                use_moves = false;
                game.teams[game.turn.team].bought = true;
            }

            world.map.entities[world.map.entities.length-1].shout();

            if(game.unit_selected > -1 ){
                if(use_moves){
                    world.map.entities[game.unit_selected].moves = 0;                
                    world.map.entities[game.unit_selected].important = false;
                    world.map.entities[game.unit_selected].message = '+1';
                }                
                world.map.entities[game.unit_selected].unselect();
                game.unit_selected = -1;  
            }                
            this.show();
            game.updateUnits();
            fogOfWar.update();
            render.render({entities:true, gui:true});
        }else{
            console.log('need more gold!');
        }
        
    },

    makeTransaction: function(args){
        if((args.unit == 'octopus' || args.unit == 'cementary' || args.unit == 'ship') && game.teams[game.turn.team].bought){
            return false;
        }

        if(game.teams[args.team].wallet >= this.price_list[args.unit]){
            game.teams[args.team].wallet -= this.price_list[args.unit];
            game.updateWallet();
            return true;  
        }
        
        return false;
    },

    freeChests: function(){
        var locations = [],
            newLocation = null;

        for (var i = 0; i < world.map.items.length; i++) {
            if(world.map.items[i].chest){
                for (var x = world.map.items[i].x-1; x <= world.map.items[i].x+1; x++) {
                    for (var y = world.map.items[i].y-1; y <= world.map.items[i].y+1; y++) {
                        if(world.map.moves[x+(y*world.map.width)] !== 0){
                            locations.push({x:x,y:y});
                        }
                    }
                }
            }
        }

        
            for (var i = 0; i < world.map.entities.length; i++){                 
                for (var j = 0; j < locations.length; j++) {
                    if(world.map.entities[i].x == locations[j].x && world.map.entities[i].y == locations[j].y){
                        locations.splice(j,1);                                                
                    }
                }
            }                 
        
        
        for (var k = 0; k < world.map.items.length; k++) {
            if(world.map.items[k].chest){
                for (var j = 0; j < locations.length; j++) {
                    if(world.map.items[k].x == locations[j].x && world.map.items[k].y == locations[j].y){
                        locations.splice(j,1);
                    }
                }
            }
        }
        
        
        if(locations.length > 0){
            return locations[(Math.random()*locations.length)<<0];
        }else{
            return false;
        }
    },

    show: function(args){    
        GUI.show = [];  
        GUI.show.push('wallet');
        GUI.show.push('end');

        if(!args){
            args = {more:false};
        }

        if(game.teams[game.turn.team].pirates){
            if(!game.teams[game.turn.team].bought){
                if(game.teams[game.turn.team].wallet >= this.price_list['ship']){ 
                    GUI.show.push('ship');            
                }
            }
            if(args.more){
                if(game.teams[game.turn.team].wallet >= this.price_list['pirate']){ 
                    GUI.show.push('pirate');
                }
                if(game.teams[game.turn.team].wallet >= this.price_list['range_pirate']){ 
                    GUI.show.push('range_pirate');
                }
                if(game.teams[game.turn.team].wallet >= this.price_list['lumberjack']){ 
                    GUI.show.push('lumberjack');
                }
            }
        }

        if(game.teams[game.turn.team].skeletons){
            if(!game.teams[game.turn.team].bought){
                if(game.teams[game.turn.team].wallet >= this.price_list['cementary']){
                    if(this.freeChests()){
                        GUI.show.push('cementary');            
                    }
                }
                if(game.teams[game.turn.team].wallet >= this.price_list['octopus']){ 
                    GUI.show.push('octopus');
                }
            }
            if(args.more){
                if(game.teams[game.turn.team].wallet >= this.price_list['skeleton']){ 
                    GUI.show.push('skeleton');
                }
                if(game.teams[game.turn.team].wallet >= this.price_list['dust']){ 
                    GUI.show.push('dust');                
                }
            }
        }
        
        render.render({menu:true});
    },

    close: function(args){
        this.show({more:false});
    },

    buyStarter: function(){
        if(game.teams[game.turn.team].pirates){
            this.buy({unit:'ship'});
        }else
        if(game.teams[game.turn.team].skeletons){
            this.buy({unit:'cementary'});
        }
    },
};