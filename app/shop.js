var shop = {
    prices: [
        {unit: 'pirate',price: 10},
        {unit: 'range_pirate',price: 15},
        {unit: 'lumberjack',price: 10},
        {unit: 'skeleton',price: 15},
        {unit: 'dust',price: 80},
        {unit: 'ship',price: 40},
        {unit: 'cementary',price: 80},
        {unit: 'octopus',price: 15}],

    buy: function(args){
        var newX = 0,
            newY = 0;
            ai = game.teams[game.turn.team].ai,
            team = game.turn.team,
            hasCementary = 0;            
        
        if(args.unit == 'cementary'){


            var chests = [],
                cementars = 0;

            for (var i = 0; i < world.map.items.length; i++) {
                if(world.map.items[i].chest && !world.map.items[i].hasCementary){
                    chests.push(i);
                }
            };

            for (var i = 0; i < world.map.entities.length; i++) {
                if(world.map.entities[i].cementary){
                    cementars++;
                }
            };

            if(chests.length > 0){
                var r = (Math.random()*chests.length)<<0;
                world.map.items[chests[r]].hasCementary = true;
                var dx = 0,
                    dy = 0;
                if( Math.random()*2 > 1){
                    dx = -1;
                    if( Math.random()*2 > 1){
                        dy = -1;
                    }else{
                        dy = 1;
                    }
                }else{
                    dx = 1;
                    if( Math.random()*2 > 1){
                        dy = -1;
                    }else{
                        dy = 1;
                    }
                }

                newX = world.map.items[chests[r]].x + dx;
                newY = world.map.items[chests[r]].y + dy; 

                hasCementary = chests[r];
            }else{
                return false;
            }
            
            
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
            }

            if(args.unit == 'skeleton'){
                world.map.entities.push(new Skeleton({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'dust'){
                world.map.entities.push(new Dust({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'octopus'){
                world.map.entities.push(new Octopus({x:newX,y:newY,team:team, ai:ai}));
            }
            
            if(args.unit == 'cementary'){
                world.clearTerrain({x:newX, y:newY, size:1});
                world.map.entities.push(new Cementary({x:newX,y:newY,team:team, ai:ai, hasCementary:hasCementary}));
            }

            world.map.entities[world.map.entities.length-1].shout();

            if(game.unit_selected > -1 ){
                world.map.entities[game.unit_selected].moves = 0;
                world.map.entities[game.unit_selected].unselect();
                world.map.entities[game.unit_selected].important = false;
                world.map.entities[game.unit_selected].message = '+1';
                game.unit_selected = -1;  

            }
            game.updateUnits();
            fogOfWar.update();
            render.render({entities:true, gui:true});
        }else{
            console.log('need more gold!');
        }
        
    },

    makeTransaction: function(args){
        for (var i = 0; i < this.prices.length; i++) {
            if(this.prices[i].unit == args.unit){
                if(game.teams[args.team].wallet >= this.prices[i].price){
                    game.teams[args.team].wallet -= this.prices[i].price;
                    game.updateWallet();
                    return true;  
                }
            }
        };
        
        return false;
    },

    open: function(args){        
        if(args.team === 0){

            document.getElementById('player1_shop').style.display = 'inline-block';            
            document.getElementById('player2_shop').style.display = 'none';            
            document.getElementById('player2_shop').removeAttribute('class');

            if(args.more){
                document.getElementById('player1_shop').setAttribute('class','buy');            
            }
              
        }else{
            document.getElementById('player2_shop').style.display = 'inline-block';            
            document.getElementById('player1_shop').style.display = 'none';            
            document.getElementById('player1_shop').removeAttribute('class');
            if(args.more){
                document.getElementById('player2_shop').setAttribute('class','buy');
            }            
            
        }
    },

    close: function(args){
        document.getElementById('player1_shop').removeAttribute('class');        
        document.getElementById('player2_shop').removeAttribute('class');
        
        if(args.all){
            document.getElementById('player1_shop').style.display = 'none';         
            document.getElementById('player2_shop').style.display = 'none'; 
        }
    },

    buyStarter: function(){
        if(game.turn.team === 0){
            this.buy({unit:'ship'});
        }else
        if(game.turn.team == 1){
            this.buy({unit:'cementary'});
        }
    },
};