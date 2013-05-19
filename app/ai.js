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

var computer = {
    loop_id: 0,
    orders: [],
    units: [],
    resources: [],
    targets: [],
    
    init: function(){
        this.units = [];

        for (var i = 0; i < world.map.entities.length; i++) {
            if(world.map.entities[i].team === game.turn.team && world.map.entities[i].alive && world.map.entities[i].moves > 0){                
                //game.unit_selected = i;                 
                this.units.push(i);                                
            }
            if(world.map.entities[i].team !== game.turn.team && world.map.entities[i].alive){
                this.targets.push(i);
            }
        }
        for (var i = 0; i < world.map.items.length; i++) {
            if(world.map.items[i].forest){
                this.resources.push(i);
            }
            if(world.map.items[i].chest){
                if(game.teams[game.turn.team].skeletons && !world.map.items[i].close){
                    this.resources.push(i);
                }
                if(game.teams[game.turn.team].pirates && world.map.items[i].close){
                    this.resources.push(i);
                }
            }
        };
        this.giveOrders();
        this.loop();
    },
    
    giveOrders: function(){
        function other(a){
            if(a === 0){
                return 1;
            }else{
                return 0;
            }
        }        
        function distance(x1,y1,x2,y2,max){
            var dx = x2 - x1,
                dy = y2 - y1;

            var distance = Math.sqrt(dx*dx + dy*dy);
            if(distance<max){
                return true;
            }else{
                return false;
            }
        }
        
        if(game.teams[game.turn.team].wallet.trees <= game.teams[other(game.turn.team)].wallet.trees){
            this.orders.push({
                resources:true,
                trees: true
            });
        }
        if(game.teams[game.turn.team].wallet.gold <= game.teams[other(game.turn.team)].wallet.gold){
            this.orders.push({
                resources:true,
                gold: true
            });
        }

        if(this.targets.length >= this.units.length){
            var unit = null;
            if(game.teams[game.turn.team].skeletons){
                unit = 'dust';
            }
            if(game.teams[game.turn.team].pirates){
                unit = 'lumberjack';
            }
            this.orders.push({
                buy:true,
                unit:unit
            });
        }

        for (var i = 0; i < this.targets.length; i++) {
            for (var j = 0; j < this.units.length; j++) {
                if(distance(world.map.entities[this.targets[i]].x,world.map.entities[this.targets[i]].y,world.map.entities[this.units[j]].x,world.map.entities[this.units[j]].y,5)){
                    this.orders.push({
                    attack:true,
                    target: i
                });
                }
            };
            
        };

        
    },

    executeOrders: function(){
        console.log(computer.orders);
        var order = computer.orders.pop();
        console.log(order);
        if(computer.units.length>0){                        
            if(order.resources){
                console.log('resources');
                computer.units.pop();
            }

            if(order.buy){
                console.log('buy');
                for (var i = 0; i < computer.units.length; i++) {                    
                    if(world.map.entities[computer.units[i]].can_create_unit){
                        for (var j = 0; j < world.map.entities[computer.units[i]].shop.length; j++) {
                            if(world.map.entities[computer.units[i]].shop[j] == order.unit){
                                game.select(world.map.entities[computer.units[i]].x,world.map.entities[computer.units[i]].y);
                                if(!shop.buy({unit:order.unit})){
                                    world.map.entities[computer.units[i]].unselect();
                                }else{                                    
                                    computer.units.push(world.map.entities.length-1);
                                    render.render({entities:true});
                                }
                                computer.units.splice(i,1);
                                return true;
                            }
                        };
                    }
                };                
            }

            if(order.attack){
                console.log('attack');
                var next_unit = computer.units.pop();
                var attack = [];
                if(next_unit){
                    game.select(world.map.entities[next_unit].x,world.map.entities[next_unit].y);
                    for (var i = 0; i < world.map.entities[next_unit].move_area.length; i++) {
                    
                    if(world.map.entities[next_unit].move_area[i].attack){
                            attack.push(i);
                        }
                    };

                    if( attack.length > 0 ){
                        var rand = (Math.random()*attack.length)<<0; 
                        game.attackOrMove(world.map.entities[next_unit].move_area[rand].x, world.map.entities[next_unit].move_area[rand].y);
                    }
                    render.render({entities:true});
                    return true;
                }
            }
            
            console.log('move');
            var next_unit = computer.units.pop();
            var moves = [];
            if(next_unit){
                game.select(world.map.entities[next_unit].x,world.map.entities[next_unit].y);
                for (var i = 0; i < world.map.entities[next_unit].move_area.length; i++) {
                    if(world.map.entities[next_unit].move_area[i].move){
                        moves.push(i);
                    }
                };
                if( moves.length > 0 ){
                    var rand = (Math.random()*moves.length)<<0;                
                    world.map.entities[next_unit].move(world.map.entities[next_unit].move_area[rand].x, world.map.entities[next_unit].move_area[rand].y);
                }
                render.render({entities:true});
            }

            return true;
        }else{
            game.nextTurn();
            return false;
        }
    },

    /*
    think: function(other){
        other.select();

            // if can move
            if(other.move_area.length > 0){

                // check all entities
                for (var i = 0; i < world.map.entities.length; i++) {

                    // chech if enemy and live
                    if(world.map.entities[i].team === 0 && world.map.entities[i].alive){

                        // check if in sight
                        for (var j = 0; j < other.move_area.length; j++) {
                            if(world.map.entities[i].x == other.move_area[j].x && world.map.entities[i].y == other.move_area[j].y){

                                // check if reloading
                                if( world.map.entities[i].reloading > 0 ){
                                    game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                    other.unselect();
                                    return true;
                                }else

                                // check if range
                                if( world.map.entities[i].range ){
                                    game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                    other.unselect();
                                    return true;
                                }else

                                // check if weak
                                if( world.map.entities[i].squad <= other.squad ){
                                    game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                    other.unselect();
                                    return true;
                                }

                            }
                        }

                    }
                }

                // check items
                for (i = 0; i < world.map.items.length; i++) {

                    // search for chest (not opened)
                    if(world.map.items[i].can_open && world.map.items[i].close){

                        // if in sight
                        for (j = 0; j < other.move_area.length; j++) {

                            if(world.map.items[i].x == other.move_area[j].x && world.map.items[i].y == other.move_area[j].y){
                                game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                other.unselect();
                                return true;
                            }

                        }
                    }
                }

                // nothing to attack.. move somewhere
                var r = (Math.random()*other.move_area.length)<<0;
                game.attackOrMove(other.move_area[r].x, other.move_area[r].y);                
            }else{
                other.moves = 0;
            }

        other.unselect();
        return true;
    },
    */

    loop: function() {            
        computer.executeOrders();
        //render.render({items:true, entities:true, gui:true});
        setTimeout(function () {            
            if (game.teams[game.turn.team].ai) {
                computer.loop();
            }
        }, game.ai_speed);
    },
};