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
    
    VERSION LOG
    
    0.01     start project
        
    ----------------------------------------------------------------------------
*/

/* 
    ----------------------------------------------------------------------------
    CONTROL GAME STUFF
    ----------------------------------------------------------------------------
*/

var game = {
    unit_selected: -1,
    select_area: [],
    
    init: function(){
        world.init();
        render.init(); 
        
        render.gui.canvas.addEventListener('mousedown', game.click, false);
    },
    
    click: function(e){
        
        var cX = (e.pageX - render.entities.canvas.offsetLeft)/render.box<<0,
            cY = (e.pageY - render.entities.canvas.offsetTop)/render.box<<0;
        
        if(game.unit_selected > -1){
            game.select(cX, cY);
            if(game.unit_selected > -1){
                world.maps[world.map].entities[game.unit_selected].move(cX, cY);
                    world.maps[world.map].entities[game.unit_selected].unselect();
                    game.unit_selected = -1;
                    render.render({entities:true, gui:true});
                
            }
        }else{
            game.select(cX, cY);
            render.render({gui:true});
        }           
        
    },
    
    select: function(cX,cY){
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {
            world.maps[world.map].entities[i].unselect();
            if(world.maps[world.map].entities[i].x == cX && world.maps[world.map].entities[i].y == cY){
                world.maps[world.map].entities[i].select();
                this.unit_selected = i;                
            }            
        }
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
            name:   'First island',
            width:  8,
            height: 8,
            data: [
                0,0,1,1,1,1,1,0,
                0,1,1,2,2,2,1,1,
                1,1,2,2,4,2,2,1,
                1,2,4,4,4,4,2,1,
                1,2,5,5,5,5,2,1,
                1,3,2,2,3,3,3,1,
                1,1,3,3,1,1,1,1,
                0,1,1,1,1,0,0,0
            ],
            moves: [
                0,0,0,0,0,0,0,0,
                0,0,0,1,1,1,0,0,
                0,0,1,1,1,1,1,0,
                0,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,0,
                0,0,1,1,0,0,0,0,
                0,0,0,0,0,0,0,0
            ],
            entities: [
                new Pirate({x:1,y:3}),
                new Pirate({x:1,y:4}),
                new Skeleton({x:5,y:5})],                
            items: [
                new Chest({x:5, y:4}),
                new Palm({x:4,y:3}),
                new Palm({x:3, y:3}),
                new Ship({x:0, y:3})]
        };         
        
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
            render.sprites[6] = render.makeSprite(0,3); // pirate
            render.sprites[7] = render.makeSprite(0,5); // skeletor
            render.sprites[8] = render.makeSprite(2,1); // palm
            render.sprites[9] = render.makeSprite(4,0); // move
            render.sprites[10] = render.makeSprite(5,0); // select
            render.sprites[11] = render.makeSprite(5,1); // done
            render.sprites[12] = render.makeSprite(2,2); // ship
            render.sprites[13] = render.makeSprite(0,2); // treasure
            render.sprites[14] = render.makeSprite(1,2); // treasure open
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
                this.entities.ctx.drawImage(this.sprites[world.maps[world.map].entities[i].sprite], world.maps[world.map].entities[i].x*this.box, world.maps[world.map].entities[i].y*this.box);                                   
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
            }
            
            
        }
        
    },
    
};


game.init();




