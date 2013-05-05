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
    sky: {
        canvas: null,
        ctx: null,
    },
    hints: {
        canvas: null,
        ctx: null,
        draw: [],
    },
    menu: {
        canvas: null,
        ctx: null,
        draw: [],
    },
    viewport: {
        canvas: null,
        ctx: null,
        offset: {x: 0, y:0},
        width: 0,
        height: 0
    },
    box: 16,
    scale: 2,
    sprites_img: new Image(),
    sprites_scaled: null,
    noise_img: null,
    next_turn: new Image(),
    sprites: [],
    big_sprites: [],
    render_initialized: false,

    init: function(){
        if(!this.render_initialized){
            
            this.box = this.box * this.scale;
            this.viewport.width = (window.innerWidth/this.box)<<0;
            this.viewport.height = (window.innerHeight/this.box)<<0;

            this.createDOM();

            this.noise_img = this.fastNoise(world.map.width*this.box, world.map.height*this.box, 8 );

            this.sprites_img.src = "/media/sprites.png";
            this.sprites_img.onload = function(){                

                render.sprites_img = render.resize(render.sprites_img, render.scale);

                // map & items & GUI
                render.sprites[0] = render.makeSprite(0,0, false); // sea
                render.sprites[1] = render.makeSprite(1,0, false); // water
                render.sprites[2] = render.makeSprite(2,0, false); // beach
                render.sprites[3] = render.makeSprite(3,0, false); // beach rif
                render.sprites[4] = render.makeSprite(0,1, false); // grass
                render.sprites[5] = render.makeSprite(1,1, false); // grass rif
                render.sprites[6] = render.makeSprite(3,1, false); // bridge east west
                render.sprites[7] = render.makeSprite(4,1, false); // bridge north south
                render.sprites[8] = render.makeSprite(6,1, false); // merge
                render.sprites[9] = render.makeSprite(4,0, false); // move
                render.sprites[10] = render.makeSprite(5,0, false); // select
                render.sprites[11] = render.makeSprite(5,1, false); // done
                render.sprites[12] = render.makeSprite(6,0, false); // attack
                render.sprites[13] = render.makeSprite(0,2, false); // treasure
                render.sprites[14] = render.makeSprite(1,2, false); // treasure open
                render.sprites[15] = render.makeSprite(5,2, false); // reloading
                render.sprites[16] = render.makeSprite(2,1, false); // pirate flag
                render.sprites[37] = render.makeSprite(7,3, false); // buy area
                render.sprites[38] = render.makeSprite(6,3, false); // cut forest
                render.sprites[48] = [render.makeSprite(9,4, false),render.makeSprite(9,4, true)]; // cross / die

                // entities
                render.sprites[17] = [render.makeSprite(0,3, false),render.makeSprite(0,3, true)]; // pirate 1
                render.sprites[18] = [render.makeSprite(1,3, false),render.makeSprite(1,3, true)]; // pirate 2
                render.sprites[19] = [render.makeSprite(2,3, false),render.makeSprite(2,3, true)]; // pirate 3
                render.sprites[20] = [render.makeSprite(3,3, false),render.makeSprite(3,3, true)]; // pirate 4
                render.sprites[21] = [render.makeSprite(4,3, false),render.makeSprite(4,3, true)]; // pirate 5
                render.sprites[22] = [render.makeSprite(5,3, false),render.makeSprite(5,3, true)]; // pirate 6
                render.sprites[23] = [render.makeSprite(0,5, false),render.makeSprite(0,5, true)]; // skeletor 1
                render.sprites[24] = [render.makeSprite(1,5, false),render.makeSprite(1,5, true)]; // skeletor 2
                render.sprites[25] = [render.makeSprite(2,5, false),render.makeSprite(2,5, true)]; // skeletor 3
                render.sprites[26] = [render.makeSprite(3,5, false),render.makeSprite(3,5, true)]; // skeletor 4
                render.sprites[27] = [render.makeSprite(4,5, false),render.makeSprite(4,5, true)]; // skeletor 5
                render.sprites[28] = [render.makeSprite(5,5, false),render.makeSprite(5,5, true)]; // skeletor 6
                render.sprites[29] = [render.makeSprite(0,4, false),render.makeSprite(0,4, true)]; // range pirate 1
                render.sprites[30] = [render.makeSprite(1,4, false),render.makeSprite(1,4, true)]; // range pirate 2
                render.sprites[31] = [render.makeSprite(2,4, false),render.makeSprite(2,4, true)]; // range pirate 3
                render.sprites[32] = [render.makeSprite(3,4, false),render.makeSprite(3,4, true)]; // range pirate 4
                render.sprites[33] = [render.makeSprite(4,4, false),render.makeSprite(4,4, true)]; // range pirate 5
                render.sprites[34] = [render.makeSprite(5,4, false),render.makeSprite(5,4, true)]; // range pirate 6
                render.sprites[35] = [render.makeSprite(2,2, false),render.makeSprite(2,2, true)]; // ship
                render.sprites[36] = [render.makeSprite(0,6, false),render.makeSprite(0,6, true)]; // octopus
                render.sprites[39] = [render.makeSprite(3,2, false),render.makeSprite(3,2, false)]; // cementary
                render.sprites[49] = [render.makeSprite(6,5, false),render.makeSprite(6,5, true)]; // dust
                render.sprites[53] = [render.makeSprite(6,4, false),render.makeSprite(6,4, true)]; // lumberjack
				render.sprites[59] = [render.makeSprite(7,5, false),render.makeSprite(7,5, true)]; // cannon
				render.sprites[68] = [render.makeSprite(9,5, false),render.makeSprite(9,5, true)]; // daemon
				
                // hints
                render.sprites[40] = render.makeSprite(2,10, false); // hint top
                render.sprites[41] = render.makeSprite(2,7, false); // hint right
                render.sprites[42] = render.makeSprite(2,9, false); // hint bottm
                render.sprites[43] = render.makeSprite(3,7, false); // hint left

                render.sprites[44] = render.makeSprite(0,8, false); // hint top-right
                render.sprites[45] = render.makeSprite(0,7, false); // hint right-bottom
                render.sprites[46] = render.makeSprite(1,7, false); // hint bottm-left
                render.sprites[47] = render.makeSprite(1,8, false); // hint left-top
                
                render.sprites[60] = render.makeSprite(3,10, false); // hint top red
                render.sprites[61] = render.makeSprite(2,8, false); // hint right red
                render.sprites[62] = render.makeSprite(3,9, false); // hint bottm red
                render.sprites[63] = render.makeSprite(3,8, false); // hint left red

                render.sprites[64] = render.makeSprite(0,9, false); // hint bottom-right red
                render.sprites[65] = render.makeSprite(0,10, false); // hint top-right red
                render.sprites[66] = render.makeSprite(1,9, false); // hint bottm-left red
                render.sprites[67] = render.makeSprite(1,10, false); // hint top-left red

                

                // clouds
                render.sprites[50] = render.makeSprite(7,0, false); // cloud 0
                render.sprites[51] = render.makeSprite(7,1, false); // cloud bottom
                render.sprites[52] = render.makeSprite(7,2, false); // cloud right
                                
                
                render.sprites[54] = render.makeSprite(3,6, false); // cutted palm
                render.sprites[55] = render.makeSprite(1,6, false); // palm
                render.sprites[56] = render.makeSprite(2,6, false); // forest            
    
                render.sprites[57] = render.makeSprite(6,2, false); // shout
                render.sprites[58] = render.makeSprite(4,2, false); // message
                
                

                render.big_sprites[0] = render.resize(render.sprites[35][0], 8);
                render.big_sprites[1] = render.resize(render.sprites[36][0], 8);                

                GUI.init();
                fogOfWar.init();
                game.centerMap();
                render.render({all:true});
            };
            
            /*
            this.next_turn.src = "/media/next_turn.png";
            this.next_turn.onload = function(){                
                render.render({gui:true});
            };
            */
            this.render_initialized = true;
        }else{
            this.destroyDOM();
            this.createDOM();            
            this.noise_img = this.fastNoise(world.conf.width*this.box, world.conf.height*this.box, 8 );
        }

    },    
    

    createDOM: function(){
        var gameDiv = document.getElementById('game'),
            viewportDiv = document.createElement('canvas');
		
		gameDiv.innerHTML = '';
		
        viewportDiv.setAttribute('id','viewport');

        gameDiv.appendChild(viewportDiv);
        gameDiv.style.width = (this.viewport.width*this.box)+'px';
        gameDiv.style.height = (this.viewport.height*this.box)+'px';
        
        document.getElementById('play').style.width = gameDiv.style.width;
        document.getElementById('play').style.height = gameDiv.style.height;

        /*
        var gameDiv = document.getElementById('game'),
            mapDiv = document.createElement('canvas'),
            entitiesDiv = document.createElement('canvas'),
            skyDiv = document.createElement('canvas'),
            guiDiv = document.createElement('canvas'),
            hintsDiv = document.createElement('canvas');
        
        mapDiv.setAttribute('id','map');
        entitiesDiv.setAttribute('id','entities');
        skyDiv.setAttribute('id','sky');
        guiDiv.setAttribute('id','gui');
        hintsDiv.setAttribute('id','hints');
                    
        gameDiv.appendChild(mapDiv);
        gameDiv.appendChild(entitiesDiv);
        gameDiv.appendChild(skyDiv);
        gameDiv.appendChild(hintsDiv);
        gameDiv.appendChild(guiDiv);
                    
                
        gameDiv.style.width = (this.viewport.width*this.box)+'px';
        gameDiv.style.height = (this.viewport.height*this.box)+'px';
        
        document.getElementById('play').style.width = gameDiv.style.width;
        */

        this.viewport.canvas = document.getElementById('viewport');
        this.viewport.canvas.width = this.viewport.width*this.box;
        this.viewport.canvas.height = this.viewport.height*this.box;
        this.viewport.ctx = this.viewport.canvas.getContext('2d');

        this.map.canvas = document.createElement('canvas');
        this.map.canvas.width = world.map.width*this.box;
        this.map.canvas.height = world.map.height*this.box;
        this.map.ctx = this.map.canvas.getContext('2d');

        this.entities.canvas = document.createElement('canvas');
        this.entities.canvas.width = world.map.width*this.box;
        this.entities.canvas.height = world.map.height*this.box;
        this.entities.ctx = this.entities.canvas.getContext('2d');

        this.gui.canvas = document.createElement('canvas');
        this.gui.canvas.width = world.map.width*this.box;
        this.gui.canvas.height = world.map.height*this.box;
        this.gui.ctx = this.gui.canvas.getContext('2d');
        
        this.sky.canvas = document.createElement('canvas');
        this.sky.canvas.width = world.map.width*this.box;
        this.sky.canvas.height = world.map.height*this.box;
        this.sky.ctx = this.sky.canvas.getContext('2d');

        this.hints.canvas = document.createElement('canvas');
        this.hints.canvas.width = this.viewport.width*this.box;
        this.hints.canvas.height = this.viewport.height*this.box;
        this.hints.ctx = this.hints.canvas.getContext('2d');

        this.menu.canvas = document.createElement('canvas');
        this.menu.canvas.width = this.viewport.width*this.box;
        this.menu.canvas.height = this.viewport.height*this.box;
        this.menu.ctx = this.menu.canvas.getContext('2d');

        io.init();
    },
        
    destroyDOM: function(){
        io.clear();
        document.getElementById('game').innerHTML = '';       
    },

    makeSprite: function(x,y, flip){
        var m_canvas = document.createElement('canvas');
            m_canvas.width = this.box;
            m_canvas.height = this.box;
        var m_context = m_canvas.getContext('2d');
        m_context.drawImage(this.sprites_img, -x*this.box, -y*this.box);

        if(flip){
            var m_canvas2 = document.createElement('canvas');
                m_canvas2.width = this.box;
                m_canvas2.height = this.box;
            var m_context2 = m_canvas2.getContext('2d');
                //m_context2.save();
                m_context2.scale(-1,1)
                m_context2.drawImage(m_canvas, -this.box, 0);
                //m_context2.restore();
            return m_canvas2;
        }
        return m_canvas;
    },

    resize: function( img, scale ) {
        // Takes an image and a scaling factor and returns the scaled image

        // The original image is drawn into an offscreen canvas of the same size
        // and copied, pixel by pixel into another offscreen canvas with the
        // new size.

        var widthScaled = img.width * scale;
        var heightScaled = img.height * scale;

        var orig = document.createElement('canvas');
        orig.width = img.width;
        orig.height = img.height;
        var origCtx = orig.getContext('2d');
        origCtx.drawImage(img, 0, 0);
        var origPixels = origCtx.getImageData(0, 0, img.width, img.height);

        var scaled = document.createElement('canvas');
        scaled.width = widthScaled;
        scaled.height = heightScaled;
        var scaledCtx = scaled.getContext('2d');
        var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );

        for( var y = 0; y < heightScaled; y++ ) {
            for( var x = 0; x < widthScaled; x++ ) {
                var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
                var indexScaled = (y * widthScaled + x) * 4;
                scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
                scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
                scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
                scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
            }
        }
        scaledCtx.putImageData( scaledPixels, 0, 0 );
        return scaled;
    },

    fastNoise: function(width, height, opacity){
        var m_canvas = document.createElement('canvas');
        m_canvas.width = width;
        m_canvas.height = height;
        var m_context = m_canvas.getContext('2d');

        var imageData = m_context.getImageData(0, 0, m_canvas.width, m_canvas.height),
            random = Math.random,
            pixels = imageData.data,
            n = pixels.length,
            i = 0;

        while (i < n) {
            pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256);
            pixels[i++] = opacity;
        }

        m_context.putImageData(imageData, 0, 0);

        return m_canvas;
    },

    drawMessage: function(msg, x, y, important){
        if(important){
            this.gui.ctx.drawImage(this.sprites[57], (x*this.box)-(12), (y*this.box)-(18));
            this.gui.ctx.fillStyle = '#fff';
        }else{
            this.gui.ctx.drawImage(this.sprites[58], (x*this.box)-(12), (y*this.box)-(18));
            this.gui.ctx.fillStyle = '#000';
        }
        
        this.gui.ctx.font = '12px VT323, cursive';
        this.gui.ctx.textBaseline = 'top';
        this.gui.ctx.textAlign = 'center';
        this.gui.ctx.fillText(msg , (x*this.box)+(4), (y*this.box)-(4));
    },

    drawNextTurn: function(){
        var pos = 0.1,
            nextTurn = document.getElementById('nextTurn');
    
        if(game.play){
            
            if(game.teams[game.turn.team].ai){
                this.gui.ctx.fillStyle = '#f8f8f8';
                this.gui.ctx.font = 'bold 1.4em VT323, cursive';
                this.gui.ctx.textBaseline = 'middle';
                this.gui.ctx.textAlign = 'center';
                
                this.gui.ctx.drawImage(this.next_turn, ((world.map.width*0.5)<<0)*this.box - ((this.next_turn.width*0.5)<<0), ((world.map.height*pos)<<0)*this.box - ((this.next_turn.height*0.5)<<0));
                this.gui.ctx.fillText('Skeleton Army..', ((world.map.width*0.5)<<0)*this.box, ((world.map.height*pos)<<0)*this.box );
                
                nextTurn.style.display = 'none';
            }else{
                nextTurn.style.display = 'inline-block';
            }   
            
        }
    },

    move:function(args){
        var margin = {
            x:2,
            y:2
        }

        if(this.viewport.offset.x + args.x >= -(world.map.width-margin.x) && this.viewport.offset.x + args.x <= this.viewport.width - margin.x){
            this.viewport.offset.x += args.x;
            game.teams[game.turn.team].offset.x = this.viewport.offset.x;
            this.drawHints();
            this.post_render();                    
        }

        if(this.viewport.offset.y +args.y >= -(world.map.height-margin.y) && this.viewport.offset.y + args.y <= this.viewport.height - margin.y){
            this.viewport.offset.y += args.y;        
            game.teams[game.turn.team].offset.y = this.viewport.offset.y;
            this.drawHints();
            this.post_render();
        }

        
        
        
    },

    drawHints: function(){        
        var indicator = {x:0,y:0, sprite:40},
            draw = {x:0,y:0, red:false};
        this.hints.draw = [];
        this.hints.ctx.clearRect(0, 0, this.viewport.width*this.box, this.viewport.height*this.box);

        for(i=0; i<world.map.entities.length; i++){
            if(world.map.entities[i].alive && world.map.entities[i].team === game.turn.team){                
                draw.x = world.map.entities[i].x + this.viewport.offset.x;
                draw.y = world.map.entities[i].y + this.viewport.offset.y;                
                if(draw.x < 0 || draw.x >= this.viewport.width || draw.y < 0 || draw.y >= this.viewport.height){
                    if(world.map.entities[i].moves > 0 && world.map.entities[i].reloading < 1){
                        draw.red = true;
                    }else{
                    	draw.red = false;
                    }
                    this.hints.draw.push({x:draw.x, y:draw.y, red:draw.red});
                }
            }
        } 

        for (var i = 0; i < this.hints.draw.length; i++) {
            
            if(this.hints.draw[i].x < 0 ){
                indicator.x = 0;
                indicator.y = this.hints.draw[i].y;
                indicator.sprite = 43;
                if(this.hints.draw[i].red){
                    indicator.sprite = 63;
                }
            }
            if(this.hints.draw[i].x >= this.viewport.width ){
                indicator.x = this.viewport.width-1;
                indicator.y = this.hints.draw[i].y;
                indicator.sprite = 41;
                if(this.hints.draw[i].red){
                    indicator.sprite = 61;
                }
            }
            if(this.hints.draw[i].y < 0 ){
                indicator.x = this.hints.draw[i].x;
                indicator.y = 0;            
                indicator.sprite = 40;
                if(this.hints.draw[i].red){
                    indicator.sprite = 60;
                }
            }
            if(this.hints.draw[i].y >= GUI.conf.bottom ){            
                indicator.x = this.hints.draw[i].x;
                indicator.y = this.viewport.height-1;
                indicator.sprite = 42;
                if(this.hints.draw[i].red){
                    indicator.sprite = 62;
                }
            }

            if(indicator.x >= this.viewport.width){
                indicator.x = this.viewport.width-1;                
            }
            if(indicator.x < 0){
                indicator.x = 0;                
            }
            if(indicator.y >= GUI.conf.bottom){
                indicator.y = this.viewport.height-1;                
            }
            if(indicator.y < 0){
                indicator.y = 0;                
            }

            
            if(indicator.x === 0 && indicator.y === 0){
               indicator.sprite = 47; 
               if(this.hints.draw[i].red){
                    indicator.sprite = 67;
                }
            }
            if(indicator.x === 0 && indicator.y == this.viewport.height-1){
               indicator.sprite = 46; 
               if(this.hints.draw[i].red){
                    indicator.sprite = 66;
                }
            }
            if(indicator.x == this.viewport.width-1 && indicator.y === 0){
               indicator.sprite = 44; 
               if(this.hints.draw[i].red){
                    indicator.sprite = 65;
                }
            }
            if(indicator.x == this.viewport.width-1 && indicator.y == this.viewport.height-1){
               indicator.sprite = 45; 
               if(this.hints.draw[i].red){
                    indicator.sprite = 64;
                }
            }
                
            this.hints.ctx.drawImage(this.sprites[ indicator.sprite ], indicator.x*this.box, indicator.y*this.box);
        };              
    },

    render: function(args){
        var draw = {x:0,y:0};

        if(args.all){
            args.map = true;
            args.entities = true;
            args.gui = true;
            args.menu = true;
            args.sky = true;
            args.hints = true;
        }

        if(args.map){
            this.map.ctx.clearRect(0, 0, world.map.width*this.box, world.map.height*this.box);
            
            for(var y=0; y<world.map.height; y++){
                for(var x=0; x<world.map.width; x++){
                    this.map.ctx.drawImage(this.sprites[world.map.data[x+(y*world.map.width)]], x*this.box, y*this.box);                                            
                }
            }
            args.items = true;
            this.map.ctx.drawImage(this.noise_img, 0, 0);            
        }

        if(args.items){
            for(i=0; i<world.map.items.length; i++){
                this.map.ctx.drawImage(this.sprites[ world.map.items[i].sprite ], world.map.items[i].x*this.box, world.map.items[i].y*this.box);            
            }
        }

        if(args.entities){            
            this.entities.ctx.clearRect(0, 0, world.map.width*this.box, world.map.height*this.box);            
            for(i=0; i<world.map.entities.length; i++){
                if(world.map.entities[i].alive){                                 
                    this.entities.ctx.drawImage(this.sprites[ world.map.entities[i].sprite ][ world.map.entities[i].flip ], world.map.entities[i].x*this.box, world.map.entities[i].y*this.box);                                        
                }
            }
            this.drawHints();         
        }

        if(args.gui){ 
            var draw = {x:0,y:0}

            this.gui.ctx.clearRect(0, 0, world.map.width*render.box, world.map.height*render.box);
            
            if(!game.teams[game.turn.team].ai){
                for(i=0; i<world.map.entities.length; i++){

                    if(world.map.entities[i].reloading > 0 && world.map.entities[i].alive ){
                        this.gui.ctx.drawImage(render.sprites[15], world.map.entities[i].x*render.box, world.map.entities[i].y*render.box);                        
                    }
                    if(world.map.entities[i].moves < 1 && world.map.entities[i].alive){                        
                        this.gui.ctx.drawImage(render.sprites[11], world.map.entities[i].x*render.box, world.map.entities[i].y*render.box);                        
                    }

                    if(world.map.entities[i].selected){
                        
                        this.gui.ctx.drawImage(render.sprites[10], world.map.entities[i].x*render.box, world.map.entities[i].y*render.box);                        
                        
                        for (var j = 0; j < world.map.entities[i].move_area.length; j++) {
                            var block = null;
                            if(world.map.entities[i].move_area[j].move){
                                block = 9;
                            }
                            if(world.map.entities[i].move_area[j].attack){
                                block = 12;
                            }
                            if(world.map.entities[i].move_area[j].merge){
                                block = 8;
                            }
                            if(world.map.entities[i].move_area[j].buy){
                                block = 37;
                            }
                            if(world.map.entities[i].move_area[j].forest){
                                block = 38;
                            }
                            if(block){                                    
                                this.gui.ctx.drawImage(render.sprites[block],world.map.entities[i].move_area[j].x*render.box, world.map.entities[i].move_area[j].y*render.box);                                
                            }
                        }
                    }else{
                        if(world.map.entities[i].message && world.map.entities[i].alive){                        
                            render.drawMessage(world.map.entities[i].message,world.map.entities[i].x, world.map.entities[i].y, world.map.entities[i].important);                            
                        }
                    }                    
                }
            }
        }
        
        if(args.menu){  
            GUI.render({menu:true});
        }

        if(args.sky && game.play && !game.teams[game.turn.team].ai){
            this.sky.ctx.clearRect(0, 0, world.map.width*this.box, world.map.height*this.box);
            for(var y=0; y<world.map.height; y++){
                for(var x=0; x<world.map.width; x++){                                                             
                    if(fogOfWar.data[game.turn.team][x+(y*world.map.width)]){
                        this.sky.ctx.drawImage(this.sprites[ fogOfWar.data[game.turn.team][x+(y*world.map.width)] ], x*this.box, y*this.box);                                                   
                    }
                }
            }           
        }        

        if(args.hints){
            this.hints.ctx.clearRect(0, 0, this.viewport.width*this.box, this.viewport.height*this.box);
            this.drawHints();
        }                    

        this.post_render();
    },

    post_render: function(){
        var layers = [],
            draw = {x:0,y:0};

        layers.push(this.map.canvas);
        if(!game.map){ layers.push(this.entities.canvas); }
        layers.push(this.gui.canvas);
        if(!game.map){ layers.push(this.sky.canvas); }                         

        draw.x = this.viewport.offset.x;
        draw.y = this.viewport.offset.y;

        this.viewport.ctx.clearRect(0, 0, this.viewport.width*this.box, this.viewport.height*this.box);
        for (var i = 0; i < layers.length; i++) {                        
            this.viewport.ctx.drawImage( layers[i], draw.x*this.box, draw.y*this.box );
        };
        this.viewport.ctx.drawImage( this.hints.canvas, 0,0);
        this.viewport.ctx.drawImage( this.menu.canvas, 0,0);
        
    },

};