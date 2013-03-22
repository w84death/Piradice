var ai = {
    loop_id: 0,
    
    init: function(){
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {

            if(world.maps[world.map].entities[i].team == game.turn.team && world.maps[world.map].entities[i].ai && world.maps[world.map].entities[i].alive && world.maps[world.map].entities[i].moves > 0){                
                game.unit_selected = i;
                ai.think(world.maps[world.map].entities[i]);                 
                if(this.loop_id++ < world.maps[world.map].entities.length){
                    return true;    
                }                
            }

        }
        
        this.loop_id = 0;
        game.nextTurn();
        return false;
    },
    
    think: function(other){
        other.select();

            // if can move
            if(other.move_area.length > 0){

                // check all entities
                for (var i = 0; i < world.maps[world.map].entities.length; i++) {

                    // chech if enemy and live
                    if(world.maps[world.map].entities[i].team === 0 && world.maps[world.map].entities[i].alive){

                        // check if in sight
                        for (var j = 0; j < other.move_area.length; j++) {
                            if(world.maps[world.map].entities[i].x == other.move_area[j].x && world.maps[world.map].entities[i].y == other.move_area[j].y){

                                // check if reloading
                                if( world.maps[world.map].entities[i].reloading > 0 ){
                                    game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                    other.unselect();
                                    return true;
                                }else

                                // check if range
                                if( world.maps[world.map].entities[i].range ){
                                    game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                    other.unselect();
                                    return true;
                                }else

                                // check if weak
                                if( world.maps[world.map].entities[i].squad <= other.squad ){
                                    game.attackOrMove(other.move_area[j].x, other.move_area[j].y);
                                    other.unselect();
                                    return true;
                                }

                            }
                        }

                    }
                }

                // check items
                for (i = 0; i < world.maps[world.map].items.length; i++) {

                    // search for chest (not opened)
                    if(world.maps[world.map].items[i].can_open && world.maps[world.map].items[i].close){

                        // if in sight
                        for (j = 0; j < other.move_area.length; j++) {

                            if(world.maps[world.map].items[i].x == other.move_area[j].x && world.maps[world.map].items[i].y == other.move_area[j].y){
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

    loop: function() {
        
        ai.init();
        render.render({entities:true, gui:true});
        setTimeout(function () {            
            if (game.teams[game.turn.team].ai) {
                ai.loop();
            }
    }, game.ai_speed);
},
};