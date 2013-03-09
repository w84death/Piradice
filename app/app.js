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
    turn: {
        id: 0,
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
    },
    
    click: function(e){
        
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
                                world.maps[world.map].entities[game.unit_selected].attack(world.maps[world.map].entities[i]);
                            }
                            i = world.maps[world.map].entities.length;
                        }else{
                            //merge
                            if(world.maps[world.map].entities[game.unit_selected].reloading < 1){
                                if(!world.maps[world.map].entities[i].merge(world.maps[world.map].entities[game.unit_selected])){                             
                                    world.maps[world.map].entities[game.unit_selected].x = temp.x;
                                    world.maps[world.map].entities[game.unit_selected].y = temp.y;
                                }                            
                            }
                            world.maps[world.map].entities[game.unit_selected].unselect();                            
                            i = world.maps[world.map].entities.length;
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
            
            console.log('\n\n\n\nNEXT TURN\n\n\n');            
                        
        }         
        
        render.render({gui:true, entities:true});
    },
    
    win: function(){
        window.alert('You win!\nClick ok to restart game');
        window.location.reload(false);
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
    map: 0,
    maps: [],
    entities: [],
    
    init: function(){        
        this.loadMap();        
    },
    
    loadMap: function(){
        this.maps[0] = {
            name:   'First islands',
            width:  16,
            height: 12,
            data: [
                0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
                0,1,1,2,2,2,1,1,1,1,1,1,1,1,0,0,
                1,1,2,2,4,2,2,2,2,1,1,2,2,1,1,1,
                1,2,4,4,4,4,2,2,3,6,2,5,4,5,2,1,
                1,2,5,5,5,5,2,3,1,1,3,2,5,2,3,1,
                1,3,2,2,3,3,3,1,1,1,1,3,3,3,1,1,
                1,1,3,3,1,1,1,1,1,1,1,1,7,1,1,1,
                0,1,1,7,1,1,0,1,1,2,2,4,4,4,2,1,
                1,1,1,4,4,1,0,1,2,5,4,4,4,5,2,1,
                1,4,4,4,4,1,0,1,3,2,5,5,5,2,3,1,
                1,5,5,5,5,1,0,1,1,3,3,3,3,3,1,1,
                1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,
            ],
            moves: [],
            entities: [
                new Pirate({x:1,y:3,squad:1,team:0}),
                new Pirate({x:1,y:5,squad:1,team:0}),
                new Pirate({x:2,y:3,squad:2,team:0}),                
                new RangePirate({x:1,y:4,squad:1,team:0}),
                new RangePirate({x:14,y:9,squad:1,team:0}),
                new RangePirate({x:13,y:10,squad:1,team:0}),
                new Skeleton({x:5,y:2,squad:2,team:1}),
                new Skeleton({x:5,y:5,squad:1,team:1}),
                new Skeleton({x:11,y:4,squad:3,team:1}),
                new Skeleton({x:12,y:4,squad:2,team:1}),
                new Skeleton({x:9,y:8,squad:3,team:1}),
                new Skeleton({x:13,y:8,squad:1,team:1}),
                new Skeleton({x:10,y:9,squad:4,team:1}),
                new Skeleton({x:4,y:9,squad:1,team:1}),
            ],
            items: [
                new Chest({x:5, y:4}),
                new Chest({x:11, y:2}),
                new Chest({x:9, y:8}),
                new Chest({x:1, y:10}),
                new Palm({x:4,y:3}),
                new Palm({x:11,y:7}),
                new Palm({x:11,y:8}),
                new Palm({x:10,y:8}),
                new Palm({x:3, y:3}),
                new Palm({x:2, y:9}),
                new Palm({x:4, y:8}),
                new Palm({x:4, y:10}),
                new Palm({x:1, y:9}), 
                new Palm({x:12, y:3}),
                new Ship({x:0, y:3}),
                new Ship({x:15, y:9})
            ]
        };
        
        for (var i = 0; i < this.maps[this.map].data.length; i++) {
            if(this.maps[this.map].data[i] === 0 || this.maps[this.map].data[i] == 1){
                this.maps[this.map].moves.push(0);
            }else{
                this.maps[this.map].moves.push(1);
            }
        }
        
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
    sprites: [],
    
    init: function(){
        
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
            render.sprites[12] = render.makeSprite(2,2); // ship;
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
            
            render.render({map:true, entities:true});
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
                }
                if(world.maps[world.map].entities[i].reloading > 0){
                    render.gui.ctx.drawImage(render.sprites[15], world.maps[world.map].entities[i].x*render.box, world.maps[world.map].entities[i].y*render.box);    
                }
                if(world.maps[world.map].entities[i].moves < 1){
                    render.gui.ctx.drawImage(render.sprites[11], world.maps[world.map].entities[i].x*render.box, world.maps[world.map].entities[i].y*render.box);    
                }
            }
            
            if(game.turn.team == 1){
                render.gui.ctx.drawImage(render.sprites[37], ((world.maps[world.map].width*0.5)<<0)*render.box, ((world.maps[world.map].height*0.5)<<0)*render.box);    
            }
            
            
        }
        
    },
    
};


game.init();