/* 
    ----------------------------------------------------------------------------
    
        KRZYSZTOF JANKOWSKI
        PIRADICE
    
        abstract: HTML5 Canvas 2D Turn-based Game Engine    
        created: 06-03-2013
        licence: do what you want and dont bother me
        
    ----------------------------------------------------------------------------
*/

var shop = {
    price_list: [],   
    buy_spot: {
        x:(render.viewport.width*0.5)<<0,
        y:(render.viewport.height*0.5)<<0
    },

    init: function(){
        this.price_list['pirate'] = {gold:20, trees:0, title:'Pirate', desc:['Merge up to 6 units', 'Basic unit']};
        this.price_list['gunner'] = {gold:30, trees:0, title:'Gunner', desc:['Merge up to 6 units', 'Shoot at distance']};
        this.price_list['lumberjack'] = {gold:10, trees:0, title:'Lumberjack', desc:['Don\'t merge', 'Cut palms for resources', 'Build a fort']};
        this.price_list['ship'] = {gold:200, trees:30, title:'Ship', desc:['Sell units', 'Shoot at distance', 'Generates gold', 'You loose without one']};
        this.price_list['cannon'] = {gold:50, trees:10, title:'Cannon', desc:['Destroys skeleton\'s cementery', 'Shoot at distance', 'Very slow']};
        this.price_list['fort'] = {gold:150, trees:20, title:'Fort', desc:['Sell units', 'Generates resources']};
        this.price_list['chieftain'] = {gold:90, trees:1, title:'Chieftain', desc:['Gives bonus to nerby units', 'Req. wood for wooden leg']};
        
        this.price_list['skeleton'] = {gold:20, trees:0, title:'Skeleton', desc:['You can merge up to 6 units', 'Basic unit.']};
        this.price_list['dust'] = {gold:20, trees:0, title:'Dust', desc:['Dies at first attack', 'Build bonfire', 'Cut palms for resources']};        
        this.price_list['cementary'] = {gold:200, trees:20, title:'Cementery', desc:['Sell units', 'Generate gold', 'You loose without one']};
        this.price_list['octopus'] = {gold:110, trees:0, title:'Octopus', desc:['Destorys pirate\'s ship']};
        this.price_list['daemon'] = {gold:15, trees:0, title:'Daemon', desc:['Shoot at distance']};
        this.price_list['bonfire'] = {gold:30, trees:5, title:'Bonfire', desc:['Sell units', 'Generate gold', 'Shoot at distance']};
    },

    buy: function(args){        

        var newX = 0,
            newY = 0;
            team = game.turn.team,
            hasCementary = 0;            
        
        if(args.unit == 'bonfire' || args.unit == 'fort'){
            newX = world.map.entities[game.unit_selected].x;
            newY = world.map.entities[game.unit_selected].y;
        }else
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
            if(game.unit_selected === false){
                return false;
            } 
            if(game.teams[game.turn.team].ai){      
            
                var buy_spot = [];

                for (var i = 0; i < world.map.entities[game.unit_selected].move_area.length; i++) {
                    if(world.map.entities[game.unit_selected].move_area[i].buy){
                        buy_spot.push(i);
                    }
                };
                if(buy_spot.length > 0){
                    var r = (Math.random()*buy_spot.length)<<0;
                    newX = world.map.entities[game.unit_selected].move_area[buy_spot[r]].x
                    newY = world.map.entities[game.unit_selected].move_area[buy_spot[r]].y;
                }
            }else{
                newX = this.buy_spot.x;
                newY = this.buy_spot.y;
            }
        }


        if(this.makeTransaction({team:team, unit:args.unit})){
            
            var use_moves = true;                        

            for (var i = 0; i < world.map.entities.length; i++) {
                if(world.map.entities[i].x == newX && world.map.entities[i].y == newY){
                    world.map.entities[i].die(false);
                }
            };
            
            if(args.unit == 'pirate'){            
                world.map.entities.push(new Pirate({x:newX,y:newY,team:team}));                                             
            }
            
            if(args.unit == 'gunner'){            
                world.map.entities.push(new Gunner({x:newX,y:newY,team:team}));
            }
            
            if(args.unit == 'lumberjack'){
                world.map.entities.push(new Lumberjack({x:newX,y:newY,team:team}));
            }
            
            if(args.unit == 'cannon'){
                world.map.entities.push(new Cannon({x:newX,y:newY,team:team}));
            }

            if(args.unit == 'chieftain'){
                world.map.entities.push(new Chieftain({x:newX,y:newY,team:team}));
            }
            
            if(args.unit == 'ship'){
                world.map.entities.push(new Ship({x:newX,y:newY,team:team}));
                use_moves = false;
                game.teams[game.turn.team].bought = true;
            }

            if(args.unit == 'skeleton'){
                world.map.entities.push(new Skeleton({x:newX,y:newY,team:team}));
            }
            
            if(args.unit == 'dust'){
                world.map.entities.push(new Dust({x:newX,y:newY,team:team}));
            }
            
            if(args.unit == 'daemon'){
                world.map.entities.push(new Daemon({x:newX,y:newY,team:team}));
            }            

            if(args.unit == 'bonfire'){
                world.map.entities.push(new Bonfire({x:newX,y:newY,team:team}));
                world.map.entities[game.unit_selected].die(false);
                world.map.entities[game.unit_selected].unselect();
            }

            if(args.unit == 'fort'){
                world.map.entities.push(new Fort({x:newX,y:newY,team:team}));
                world.map.entities[game.unit_selected].die(false);
                world.map.entities[game.unit_selected].unselect();
            }
            
            if(args.unit == 'octopus'){
                world.map.entities.push(new Octopus({x:newX,y:newY,team:team}));                
                use_moves = false;
                game.teams[game.turn.team].bought = true;
            }
            
            if(args.unit == 'cementary'){
                world.clearTerrain({x:newX, y:newY, size:1});
                world.map.entities.push(new Cementary({x:newX,y:newY,team:team}));
                use_moves = false;
                game.teams[game.turn.team].bought = true;
            }

            world.map.entities[world.map.entities.length-1].shout();

            if(game.unit_selected !== false){
                if(use_moves){
                    world.map.entities[game.unit_selected].moves = 0;                
                    world.map.entities[game.unit_selected].important = false;
                    world.map.entities[game.unit_selected].message = '+1';
                }                
                world.map.entities[game.unit_selected].unselect();
                game.unit_selected = false;  
            }                
            this.show();
            if(!game.teams[game.turn.team].ai){
                fogOfWar.update();            
                game.centerMap({
                    x:newX,
                    y:newY
                });
            }
            render.render({entities:true, gui:true});
        }else{
            console.log('need more gold!');
        }
        
    },

    makeTransaction: function(args){
        if(game.teams[args.team].wallet.gold >= this.price_list[args.unit].gold && game.teams[args.team].wallet.trees >= this.price_list[args.unit].trees){
            game.teams[args.team].wallet.gold -= this.price_list[args.unit].gold;
            game.teams[args.team].wallet.trees -= this.price_list[args.unit].trees;
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
        GUI.show = ['map','inventory','gold','trees','end','surrender'];
        if(!args){
            args = {first:false};
        }

        if(args.second){
            
            for (var i = 0; i < world.map.entities[game.unit_selected].shop2.length; i++) {
                GUI.show.push(world.map.entities[game.unit_selected].shop2[i]);
            };                

        }

        if(args.first){
            this.buy_spot = {
                x: args.x,
                y: args.y
            }
            GUI.shop = {
                x: args.x + render.viewport.offset.x,
                y: args.y + render.viewport.offset.y
            }
            GUI.init();
            for (var i = 0; i < world.map.entities[game.unit_selected].shop.length; i++) {
                GUI.show.push(world.map.entities[game.unit_selected].shop[i]);
            };
        }
        
        render.render({menu:true});
    },

    close: function(args){
        this.show({first:false});
        GUI.basket = false;
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