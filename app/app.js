/* 
    ----------------------------------------------------------------------------
    
        KRZYSZTOF JANKOWSKI
        PIRADICE
    
        abstract: HTML5 Canvas 2D Turn-based Game Engine    
        created: 06-03-2013
        licence: do what you want and dont bother me
        
    ----------------------------------------------------------------------------
*/


/* 
    ----------------------------------------------------------------------------
    CONTROL GAME STUFF
    ----------------------------------------------------------------------------
*/

var game = {
    paused: true,
    turn: {
        id: 0,
        start: true,
        startTime: null,
        team: 0,
        endTime: null            
    },
    unit_selected: -1,
    select_area: [],
    
    init: function(){
        world.init();
        render.init(); 
        
        console.log('\n\n\nWELCOME TO PIRADICE\n\n\n');
        
        render.gui.canvas.addEventListener('mousedown', game.click, false);
        
        this.paused = false;
    },
    
    click: function(e){
        
        if(!game.paused){
            var cX = (e.pageX - render.entities.canvas.offsetLeft)/render.box<<0,
                cY = (e.pageY - render.entities.canvas.offsetTop)/render.box<<0;
            
            if(game.unit_selected > -1){            
                if(game.attackOrMove(cX, cY)){
                    render.render({entities:true, gui:true});
                    game.unit_selected = -1;
                    game.nextTurn();            
                }
            }else{
                game.select(cX, cY);
                render.render({gui:true});
            }           
            
            game.nextTurn();
        }
    },
    
    select: function(cX,cY){
                
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {            
            if(world.maps[world.map].entities[i].x == cX && world.maps[world.map].entities[i].y == cY && world.maps[world.map].entities[i].team == this.turn.team && world.maps[world.map].entities[i].moves > 0 && world.maps[world.map].entities[i].reloading < 1) {                                                
                world.maps[world.map].entities[i].select();
                world.maps[world.map].entities[i].open();
                this.unit_selected = i;                
            }
        }
        
    },
    
    attackOrMove: function(cX,cY){                
        
        var temp = {
            x:world.maps[world.map].entities[game.unit_selected].x,
            y:world.maps[world.map].entities[game.unit_selected].y
        };
        
        if(world.maps[world.map].entities[game.unit_selected].move(cX, cY)){
            for (var i = 0; i < world.maps[world.map].entities.length; i++) {
                if(world.maps[world.map].entities[i].x == world.maps[world.map].entities[game.unit_selected].x && world.maps[world.map].entities[i].y == world.maps[world.map].entities[game.unit_selected].y){
                    if(this.unit_selected != i){                    
                        if((world.maps[world.map].entities[this.unit_selected].pirate && world.maps[world.map].entities[i].skeleton) || (world.maps[world.map].entities[game.unit_selected].skeleton && world.maps[world.map].entities[i].pirate)){
                            //attack                                       
                            if(world.maps[world.map].entities[game.unit_selected].range){
                                world.maps[world.map].entities[game.unit_selected].x = temp.x;
                                world.maps[world.map].entities[game.unit_selected].y = temp.y;
                            }
                            world.maps[world.map].entities[game.unit_selected].unselect();                                                          
                            if(world.maps[world.map].entities[game.unit_selected].reloading < 1){
                                if(!world.maps[world.map].entities[game.unit_selected].attack(world.maps[world.map].entities[i])){
                                    world.maps[world.map].entities[game.unit_selected].x = temp.x;
                                    world.maps[world.map].entities[game.unit_selected].y = temp.y;
                                };
                            }
                            i = world.maps[world.map].entities.length;
                        }else{
                            //merge
                            if(world.maps[world.map].entities[game.unit_selected].reloading < 1){
                                if(world.maps[world.map].entities[i].merge(world.maps[world.map].entities[game.unit_selected])){                             
                                    world.maps[world.map].entities[game.unit_selected].unselect();                            
                                    i = world.maps[world.map].entities.length;
                                }else{
                                    world.maps[world.map].entities[game.unit_selected].moves = 1;
                                    world.maps[world.map].entities[game.unit_selected].x = temp.x;
                                    world.maps[world.map].entities[game.unit_selected].y = temp.y;
                                    
                                }                            
                            }
                            
                        }
                    }
                }    
            }
        }
                
        world.maps[world.map].entities[game.unit_selected].unselect();
        this.unit_selected = -1;        
        
    },
    
    toDice: function(value){
        var dice = [];        
    	dice[1] = "⚀";
		dice[2] = "⚁";
		dice[3] = "⚂";
		dice[4] = "⚃";
		dice[5] = "⚄";
		dice[6] = "⚅";		
		
		return dice[value];
	},
    
    nextTurn: function(){                    
        var next_turn = true;                
        
        if(this.turn.start){
            for (var i = 0; i < world.maps[world.map].entities.length; i++) {
                world.maps[world.map].entities[i].message = null;
                if(world.maps[world.map].entities[i].team === this.turn.team && world.maps[world.map].entities[i].reloading < 1){
                    world.maps[world.map].entities[i].shout();
                }
            }
            this.turn.start = false;
            next_turn = false; 
        }else{        
            for (var i = 0; i < world.maps[world.map].entities.length; i++) {            
                if(world.maps[world.map].entities[i].team == this.turn.team && world.maps[world.map].entities[i].moves > 0 && world.maps[world.map].entities[i].squad > 0) {                                
                    
                    if(world.maps[world.map].entities[i].ai){
                        this.unit_selected = i;
                        ai.think(world.maps[world.map].entities[i]);
                    }
                    
                    if(world.maps[world.map].entities[i].reloading < 1){
                        next_turn = false;                
                    }
                }
            }         
        }
        if(next_turn){
            if(this.turn.team == 1){
                // AI                
                this.turn.team = 0;                
                this.turn.id++;

            }else{
                this.turn.team = 1;
                this.turn.id++;
            }     
            
            var loose = true;
                
            for (i = 0; i < world.maps[world.map].entities.length; i++) {
                if(world.maps[world.map].entities[i].team === 0 && world.maps[world.map].entities[i].squad > 0){
                    loose = false;                    
                }   
                                
                if(world.maps[world.map].entities[i].range){
                    world.maps[world.map].entities[i].reloading--;
                }
                world.maps[world.map].entities[i].moves = 1;                                
            }                        
                
            if(loose){
                this.lose();
            }
            
            this.turn.start = true;            
                        
        }         
        
        render.render({gui:true, entities:true});
    },
    
    win: function(){
        if(world.map < world.maps.length-1){
            world.map++;
            localStorage.setItem("map", world.map);
            render.render({gui:true, entities:true, map:true});
        }else{
            window.alert('\n\nCongratulations.\nYou win!\n\n\nIf You like this game share it!\n\n#piradice');
            localStorage.setItem("map", 0);
            window.location.reload(false);
        }
    },
    
    lose: function(){
        window.alert('You lose.\nClick ok to restart game');
        window.location.reload(false);
    },
};

var ai = {   
    
    think: function(other){
        other.select();
            
            // if can move
            if(other.move_area.length > 0){  
                
                // check all entities
                for (var i = 0; i < world.maps[world.map].entities.length; i++) {         
                    
                    // chech if enemy and live
                    if(world.maps[world.map].entities[i].team === 0 && world.maps[world.map].entities[i].squad > 0){
                        
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
};

var world = {
    _W: 0,
    _H: 0,
    map: localStorage.getItem("map") || 0,
    maps: [],
    entities: [],
    
    init: function(){        
        this.loadMap();        
    },
    
    loadMap: function(){         
        this.maps = load.map();            
        
        this._W = this.maps[this.map].width;
        this._H = this.maps[this.map].height;
    },
};


var render = {
    map: {
        canvas: null,
        ctx: null,
    },
    entities: {
        canvas: null,
        ctx: null,
    },
    gui: {
        canvas: null,
        ctx: null,
    },
    box: 32,
    sprites_img: new Image(),
    next_turn: new Image(),
    sprites: [],
    
    init: function(){
        
        document.getElementById('game').style.width = (world._W*this.box)+'px';
        document.getElementById('game').style.height = (world._H*this.box)+'px';
        
        this.map.canvas = document.getElementById('map');
        this.map.canvas.width = world._W*this.box;
        this.map.canvas.height = world._H*this.box;
		this.map.ctx = this.map.canvas.getContext('2d');
        
        this.entities.canvas = document.getElementById('entities');
        this.entities.canvas.width = world._W*this.box;
        this.entities.canvas.height = world._H*this.box;
        this.entities.ctx = this.entities.canvas.getContext('2d');
        
        this.gui.canvas = document.getElementById('gui');
        this.gui.canvas.width = world._W*this.box;
        this.gui.canvas.height = world._H*this.box;
        this.gui.ctx = this.gui.canvas.getContext('2d');
                
        
        this.sprites_img.src = "media/sprites.png";
        this.sprites_img.onload = function(){
            render.sprites[0] = render.makeSprite(0,0); // sea
            render.sprites[1] = render.makeSprite(1,0); // water
            render.sprites[2] = render.makeSprite(2,0); // beach
            render.sprites[3] = render.makeSprite(3,0); // beach rif
            render.sprites[4] = render.makeSprite(0,1); // grass
            render.sprites[5] = render.makeSprite(1,1); // grass rif
            render.sprites[6] = render.makeSprite(3,1); // bridge east west
            render.sprites[7] = render.makeSprite(4,1); // bridge north south
            render.sprites[8] = render.makeSprite(2,1); // palm
            render.sprites[9] = render.makeSprite(4,0); // move
            render.sprites[10] = render.makeSprite(5,0); // select
            render.sprites[11] = render.makeSprite(5,1); // done
            render.sprites[12] = render.makeSprite(2,2); // ship
            render.sprites[13] = render.makeSprite(0,2); // treasure
            render.sprites[14] = render.makeSprite(1,2); // treasure open
            render.sprites[15] = render.makeSprite(5,2); // reloading
            render.sprites[17]= render.makeSprite(0,3); // pirate 1
            render.sprites[18] = render.makeSprite(1,3); // pirate 2
            render.sprites[19] = render.makeSprite(2,3); // pirate 3
            render.sprites[20] = render.makeSprite(3,3); // pirate 4
            render.sprites[21] = render.makeSprite(4,3); // pirate 5
            render.sprites[22] = render.makeSprite(5,3); // pirate 6
            render.sprites[23] = render.makeSprite(0,5); // skeletor 1
            render.sprites[24] = render.makeSprite(1,5); // skeletor 2
            render.sprites[25] = render.makeSprite(2,5); // skeletor 3
            render.sprites[26] = render.makeSprite(3,5); // skeletor 4
            render.sprites[27] = render.makeSprite(4,5); // skeletor 5
            render.sprites[28] = render.makeSprite(5,5); // skeletor 6
            render.sprites[29] = render.makeSprite(0,4); // range pirate 1
            render.sprites[30] = render.makeSprite(1,4); // range pirate 2
            render.sprites[31] = render.makeSprite(2,4); // range pirate 3
            render.sprites[32] = render.makeSprite(3,4); // range pirate 4
            render.sprites[33] = render.makeSprite(4,4); // range pirate 5
            render.sprites[34] = render.makeSprite(5,4); // range pirate 6
            render.sprites[35] = render.makeSprite(5,4); // range pirate 6
            render.sprites[36] = render.makeSprite(2,2); // pirates ture
            render.sprites[37] = render.makeSprite(3,2); // skeleton ture
            render.sprites[38] = render.makeSprite(4,2); // message                    
            render.render({map:true, entities:true,});
        }         
        
        this.next_turn.src = "media/next_turn.png";
        this.next_turn.onload = function(){
            render.render({gui:true});
        }
        
    },
    
    makeSprite: function(x,y){        
        var m_canvas = document.createElement('canvas');
        m_canvas.width = this.box;
        m_canvas.height = this.box;                                
        var m_context = m_canvas.getContext('2d');        
        m_context.drawImage(this.sprites_img, -x*this.box, -y*this.box);
        return m_canvas;
    },  
    
    drawMessage: function(msg, x, y){ 
        
        this.gui.ctx.drawImage(this.sprites[38], (x*this.box)-12, (y*this.box)-18);        
        this.gui.ctx.fillStyle = '#000';
        this.gui.ctx.font = 'bold 0.6em VT323 sans-serif';
        this.gui.ctx.textBaseline = 'top';
        this.gui.ctx.textAlign = 'center';
        this.gui.ctx.fillText(msg , (x*this.box)+4, (y*this.box)-4);    
    },
    
    render: function(args){
        var i = 0;
        
        if(args.map){            
            this.map.ctx.clearRect(0, 0, world._W*this.box, world._H*this.box);
            for(var y=0; y<world._H; y++){
                for(var x=0; x<world._W; x++){          
                    this.map.ctx.drawImage(this.sprites[world.maps[world.map].data[i++]], x*this.box, y*this.box);                                   
                }
            }
            args.items = true;
        }
        
        if(args.items){
            for(i=0; i<world.maps[world.map].items.length; i++){                
                this.map.ctx.drawImage(this.sprites[ world.maps[world.map].items[i].sprite ], world.maps[world.map].items[i].x*this.box, world.maps[world.map].items[i].y*this.box);
            }
        }
        
        if(args.entities){ 
            this.entities.ctx.clearRect(0, 0, world._W*this.box, world._H*this.box);
            for(i=0; i<world.maps[world.map].entities.length; i++){
                //console.log(world.maps[world.map].entities[i]);
                if(world.maps[world.map].entities[i].squad > 0){
                    this.entities.ctx.drawImage(this.sprites[world.maps[world.map].entities[i].sprite], world.maps[world.map].entities[i].x*this.box, world.maps[world.map].entities[i].y*this.box);                                                       
                }
            }
        }
        
        if(args.gui){
            this.gui.ctx.clearRect(0, 0, world._W*this.box, world._H*this.box);
            for(i=0; i<world.maps[world.map].entities.length; i++){
                if(world.maps[world.map].entities[i].selected){
                    this.gui.ctx.drawImage(this.sprites[10], world.maps[world.map].entities[i].x*this.box, world.maps[world.map].entities[i].y*this.box);
                    for (var j = 0; j < world.maps[world.map].entities[i].move_area.length; j++) {
                        render.gui.ctx.drawImage(render.sprites[9], world.maps[world.map].entities[i].move_area[j].x*render.box, world.maps[world.map].entities[i].move_area[j].y*render.box);
                    }                    
                }else{
                    if(world.maps[world.map].entities[i].message && world.maps[world.map].entities[i].squad > 0){
                        this.drawMessage(world.maps[world.map].entities[i].message,world.maps[world.map].entities[i].x, world.maps[world.map].entities[i].y)
                    }
                }
                if(world.maps[world.map].entities[i].reloading > 0 && world.maps[world.map].entities[i].squad > 0 ){
                    render.gui.ctx.drawImage(render.sprites[15], world.maps[world.map].entities[i].x*render.box, world.maps[world.map].entities[i].y*render.box);    
                }
                if(world.maps[world.map].entities[i].moves < 1 && world.maps[world.map].entities[i].squad > 0){
                    render.gui.ctx.drawImage(render.sprites[11], world.maps[world.map].entities[i].x*render.box, world.maps[world.map].entities[i].y*render.box);    
                }
            }
            
            if(game.turn.start){
                this.gui.ctx.fillStyle = 'rgba(0,0,0,0.4)';
                this.gui.ctx.fillRect(0, 0, world._W*this.box, world._H*this.box); 
                render.gui.ctx.drawImage(this.next_turn, ((world.maps[world.map].width*0.5)<<0)*render.box - ((this.next_turn.width*0.5)<<0), ((world.maps[world.map].height*0.5)<<0)*render.box - ((this.next_turn.height*0.5)<<0));    
            }else{
                if(game.turn.team == 1){
                    render.gui.ctx.drawImage(render.sprites[37], ((world.maps[world.map].width*0.5)<<0)*render.box, ((world.maps[world.map].height*0.5)<<0)*render.box);    
                }
            }
            
            
        }
        
    },
    
};


game.init();