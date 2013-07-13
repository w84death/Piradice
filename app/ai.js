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
    ai_units: [],
    targets: [],
    build: [],
    units: {
        'Dust':         0,
        'Lumberjack':   0,
        'Pirate':       0,
        'Gunner':       0,
        'Skeleton':     0,
        'Octopus':      0,
        'Ship':         0,
        'Cementary':    0,
        'Bonfire':      0,
        'Daemon':       0,
        'Fort':         0,
    },
    
    init: function(){
        computer.ai_units = [];
        computer.loop_id = 0;        
        game.play = false;
        computer.calculateForces({init:true});        
        computer.loop();
    },    

    calculateForces: function(args){        
        for (key in computer.units) {                
            computer.units[key] = 0;
        }

        for (var i = 0; i < world.map.entities.length; i++) {
            if(args.init){
                if (world.map.entities[i].team === game.turn.team && world.map.entities[i].alive) {
                    computer.ai_units.push(i);
                };            
            }
            for (key in computer.units) {                
                if(world.map.entities[i].name == key && world.map.entities[i].alive){
                    computer.units[key] += world.map.entities[i].squad;
                }                
            }            
        }
    },

    executeOrders: function(){
        
        var mma = true;

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

        // analize ALL THE THINGS!        

        if(computer.loop_id < computer.ai_units.length){

            // reset attack factor to normal
            
            attack =    [];
            move =      [];
            merge =     [];
            cut =       [];
            target =    false;
            mma = true; // merge - move - attack                    

            // select unit            
            game.unit_selected = computer.ai_units[computer.loop_id];            
            world.map.entities[computer.ai_units[computer.loop_id]].select();
            render.render({gui:true});
            // build if can            

            if(world.map.entities[computer.ai_units[computer.loop_id]].can_create_unit){
                //console.log(computer.ai_units[computer.loop_id],world.map.entities[computer.ai_units[computer.loop_id]]);
                if(computer.units['Pirate'] > computer.units['Skeleton']){
                    if(shop.buy({unit:'skeleton'})){
                        mma = false;
                        render.render({entities:true});
                        return true;
                    }
                }else
                if(computer.units['Lumberjack']+2 >= computer.units['Dust']){
                    if(shop.buy({unit:'dust'})){
                        mma = false;
                        render.render({entities:true});
                        return true;                        
                    }
                }
            }

            if(computer.units['Ship']*0.8 > computer.units['Cementary'] && game.teams[game.turn.team].wallet.gold >= shop.price_list['cementary'].gold && game.teams[game.turn.team].wallet.trees >= shop.price_list['cementary'].trees){                    
                if(shop.buy({unit:'cementary'})){
                    mma = false;
                    render.render({entities:true});
                    return true;
                }
            }    

            if(computer.units['Ship'] > computer.units['Octopus'] && game.teams[game.turn.team].wallet.gold >= shop.price_list['octopus'].gold){                    
                if(shop.buy({unit:'octopus'})){
                    mma = false;                    
                    render.render({entities:true});
                    return true;
                }
            }

            
            if(world.map.entities[computer.ai_units[computer.loop_id]].name == 'Bonfire'){
                if(computer.units['Gunner']*0.6 > computer.units['Daemon'] && game.teams[game.turn.team].wallet.gold >= shop.price_list['daemon'].gold && game.teams[game.turn.team].wallet.trees >= shop.price_list['daemon'].trees){
                    if(shop.buy({unit:'daemon'})){
                        mma = false;
                        render.render({entities:true});
                        return true;
                    }else{
                        computer.units['Fort'] += computer.units['Bonfire'] + 2;
                    }
               }
            }

            if(world.map.entities[computer.ai_units[computer.loop_id]].name == 'Dust'){
                if((computer.units['Pirate']*0.6 > computer.units['Bonfire'] || computer.units['Fort'] > computer.units['Bonfire']) && game.teams[game.turn.team].wallet.gold >= shop.price_list['bonfire'].gold && game.teams[game.turn.team].wallet.trees >= shop.price_list['bonfire'].trees){
                    if(shop.buy({unit:'bonfire'})){
                        mma = false;
                        render.render({entities:true});
                        return true;
                    }else{
                        computer.units['Lumberjack'] += computer.units['Dust'] + 4;
                    }
               }
            }            

            if(mma){
                if(world.map.entities[computer.ai_units[computer.loop_id]].move_area.length > 0){
                    for (var j = 0; j < world.map.entities[computer.ai_units[computer.loop_id]].move_area.length; j++) {
                        if(world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].merge){
                            merge.push(j);
                        }
                        if(world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].attack){
                            attack.push(j);
                        }
                        if(world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].move){
                            if(world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].x > -1 &&
                                world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].x < world.map.width &&
                                world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].y > -1 &&
                                world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].y < world.map.height){
                                move.push(j);
                            }
                        }
                        if(world.map.entities[computer.ai_units[computer.loop_id]].move_area[j].forest){
                            cut.push(j);
                        }                        
                    };

                    if(merge.length>0 && world.map.entities[computer.ai_units[computer.loop_id]].squad < 4){                        
                        target = merge[(Math.random()*merge.length)<<0];                        
                    }else
                    if(attack.length>0 && ( attack.length < move.length || move.length < 1 )){                            
                        target = attack[(Math.random()*attack.length)<<0];
                    }else
                    if(cut.length > 0){                            
                        target = cut[(Math.random()*cut.length)<<0];                        
                    }else
                    if(move.length>0){
                        target = move[(Math.random()*move.length)<<0];                        
                    }
                    if(target !== false){
                        game.MMA(world.map.entities[computer.ai_units[computer.loop_id]].move_area[target].x, world.map.entities[computer.ai_units[computer.loop_id]].move_area[target].y);
                        render.render({items:true,entities:true});
                    }                                    
                }
            }
            world.map.entities[computer.ai_units[computer.loop_id]].unselect();
            render.render({gui:true}); 

            computer.calculateForces({re:true});

        }else{
            game.play = true;
            game.ready = false;
            game.nextTurn();
        }
    },        

    loop: function() {           
        computer.executeOrders();        
        setTimeout(function () {            
            if (game.teams[game.turn.team].ai) {
                computer.loop_id++;
                computer.loop();
            }
        }, game.ai_speed);
    },
};