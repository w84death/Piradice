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
    version: 'PUBLIC BETA 22-03-2013',
    teams: [{
        ai: false,
        wallet: 200,
    },{
        ai: true,
        wallet: 200, 
    }],
    play: false,
    editor: false,    
    preview_play: false,
    turn: {
        id: 1,
        start: true,
        startTime: null,
        team: 0,
        endTime: null
    },
    ai_speed: 100,
    unit_selected: -1,
    select_area: [],

    init: function(args){
        
        console.log('\nWELCOME TO PIRADICE\n' + this.version);

        world.init(args);
        render.init(); 
        render.gui.canvas.addEventListener('mousedown', game.click, false);
                
        this.play = true;
        
    },

    click: function(e){
        var cX = (e.pageX - render.entities.canvas.offsetLeft)/render.box<<0,
            cY = (e.pageY - render.entities.canvas.offsetTop)/render.box<<0;
                
        if(game.play){
            

            if(game.unit_selected > -1){
                game.attackOrMove(cX, cY)
                render.render({entities:true, gui:true});
            }else{
                game.select(cX, cY);
                render.render({gui:true});
            }

        }
        
        if(game.editor){
           editor.putUnit(cX, cY);
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
        
        var randomizer = new Date();
        Math.seedrandom(randomizer);

        for (var i = 0; i < world.maps[world.map].entities[game.unit_selected].move_area.length; i++) {
            if(world.maps[world.map].entities[game.unit_selected].move_area[i].x == cX && world.maps[world.map].entities[game.unit_selected].move_area[i].y == cY){
                if(world.maps[world.map].entities[game.unit_selected].move_area[i].attack){
                    if(world.maps[world.map].entities[game.unit_selected].attack(cX, cY)){
                        if(!world.maps[world.map].entities[game.unit_selected].range){
                            world.maps[world.map].entities[game.unit_selected].move(cX, cY);
                        }
                    };
                }else
                if(world.maps[world.map].entities[game.unit_selected].move_area[i].merge){
                    if(world.maps[world.map].entities[game.unit_selected].merge(cX, cY)){
                        world.maps[world.map].entities[game.unit_selected].move(cX, cY);
                    }
                }else
                if(world.maps[world.map].entities[game.unit_selected].move_area[i].forest){                    
                    world.maps[world.map].entities[game.unit_selected].cut(cX, cY);
                }else
                if(world.maps[world.map].entities[game.unit_selected].move_area[i].move){
                    world.maps[world.map].entities[game.unit_selected].move(cX, cY);
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
            
            if(game.turn.team == 1){
                // AI TURN
                game.turn.team = 0;
                game.turn.id++;

            }else{
                // PLAYER turn
                game.turn.team = 1;
            }
            
            this.killZombies();
    
            this.shoutTeam();                        

            var loose = true;

            for (i = 0; i < world.maps[world.map].entities.length; i++) {
                if(world.maps[world.map].entities[i].team === this.turn.team && world.maps[world.map].entities[i].squad > 0){
                    if(world.maps[world.map].entities[i].transport && world.maps[world.map].entities[i].on_board.length < 1){

                    }else{
                        loose = false;
                    }
                }

                if(world.maps[world.map].entities[i].range){
                    world.maps[world.map].entities[i].reloading--;
                }
                if(world.maps[world.map].entities[i].transport && world.maps[world.map].entities[i].on_board.length  < 1){
                    world.maps[world.map].entities[i].moves = 0;
                }else{
                    world.maps[world.map].entities[i].moves = 1;
                }

                world.maps[world.map].entities[i].selected = false;
            }

            game.unit_selected = -1;

            if(loose){
                game.lose();
            }

            if(this.teams[this.turn.team].ai){
                 ai.loop();
            }        

        render.render({gui:true, entities:true});
        multi.show();
    },


    killZombies: function(){
    
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {
            if(!world.maps[world.map].entities[i].alive){                
                world.maps[world.map].entities[i].x = 0;
                world.maps[world.map].entities[i].y = 0;
                //delete world.maps[world.map].entities[i]
                world.maps[world.map].entities.slice(i,1);
            }                        
        }
        
        render.render({entities:true});
        
    },
            
    win: function(){
        if(this.preview_play){
            window.alert('You win!.\nClick ok to back to editor');
            world.restartMap();
            editor.exitPlay();
        }else{
            world.nextMap();        
            this.turn.start = true;        
            render.render({gui:true, entities:true, map:true});
        }
    },

    lose: function(){        
        if(this.preview_play){
            window.alert('You lose.\nClick ok to back to editor');
            world.restartMap();
            editor.exitPlay();
        }else{
            window.alert('You lose.\nClick ok to restart map');
            this.turn.start = true;
            world.restartMap();
            render.render({gui:true, entities:true, map:true});    
        }
        
    },
        
    updatePlayer: function(){
        var team = parseInt(document.getElementById('team').value),
            ai = Boolean(parseInt(document.getElementById('ai').value));
            
        game.teams[team].ai = ai;            
    },
    
    switchPlayer:function(){
        var ai = document.getElementById('ai'),
            team = parseInt(document.getElementById('team').value),
            val = game.teams[team].ai ? 1 : 0;    
    
        for (var i = 0; i < ai.options.length; i++) {
            if(parseInt(ai.options[i].value) == val){
                ai.options.selectedIndex = i;
            }
        }    
    },
    
    setWallet: function(){
        var wallet = parseInt(document.getElementById('wallet').value);
        for (var i = 0; i < game.teams.length; i++) {
            game.teams[i].wallet = wallet;    
        }
        game.updateWallet();
    },
    
    updateWallet: function(){
        var player1_dolars = document.getElementById('player1_dolars'),
            player2_dolars = document.getElementById('player2_dolars');                
        
        player1_dolars.innerHTML = game.teams[0].wallet;
        player2_dolars.innerHTML = game.teams[1].wallet;            
    },
    
    updateUnits: function(){
        var player1_units = 0,
            player2_units = 0;
        
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {
            if(world.maps[world.map].entities[i].team === 0){
                player1_units += world.maps[world.map].entities[i].squad;
            }else{
                player2_units += world.maps[world.map].entities[i].squad; 
            }
        }
        document.getElementById('player1_units').innerHTML = player1_units;
        document.getElementById('player2_units').innerHTML = player2_units;
    },
    
    shoutTeam: function(){
        for (var i = 0; i < world.maps[world.map].entities.length; i++) {
            world.maps[world.map].entities[i].message = null;
            if(world.maps[world.map].entities[i].team === game.turn.team && world.maps[world.map].entities[i].reloading < 1){
                if(world.maps[world.map].entities[i].transport && world.maps[world.map].entities[i].on_board < 1){

                }else{
                    world.maps[world.map].entities[i].shout();
                }
            }
        }
    },
};

var multi = {
    
    show: function(msg){ 
        if(!game.teams[0].ai && !game.teams[1].ai){
            document.getElementById('multi').style.display = 'block';  
            document.getElementById('turn').innerHTML = game.turn.id;
            document.getElementById('playerID').innerHTML = game.turn.team + 1;
            document.getElementById('playButton').innerHTML = msg || 'Play';            
        }
    },
    
    play: function(){
        document.getElementById('multi').style.display = 'none';
    },
};

var world = {
    _W: 0,
    _H: 0,
    map: localStorage.getItem("map") || 0,
    saved_map: [],
    maps: [],
    entities: [],

    init: function(args){        
        if(args.campain){
            this.maps = load.map({campain: true});
            this.saved_map = utilities.clone(this.maps);
            this._W = this.maps[this.map].width;
            this._H = this.maps[this.map].height;
        
        }
        
        if(args.editor){
            this.map = 0;
            this._W = 32;
            this._H = 24;
            this.maps = load.map(args);
            this.saved_map = utilities.clone(this.maps);                    
        }                
        game.shoutTeam(); 
    },
    
    loadMap: function(args){
        this.map = args.id;        
        this.maps = load.map(args);
        this.saved_map = utilities.clone(this.maps);
        game.updateUnits();
        game.shoutTeam();
        multi.show();
    },
    
    restartMap: function(){
        this.maps[this.map] = utilities.clone(this.saved_map[this.map]);
    },
    
    nextMap: function(){
        if(this.map < this.maps.length-1){
            this.map++;   
        }else{
            window.alert('\n\nCongratulations.\nYou win!\n\n\nIf You like this game share it!\n\n#piradice');
            this.map = 0;
            this.restartMap();
        }
        
        localStorage.setItem("map", world.map);        
    },    
        
};

var utilities = {
    clone: function(from, to){
        // http://stackoverflow.com/a/1042676
        if (from == null || typeof from != "object") return from;
        if (from.constructor != Object && from.constructor != Array) return from;
        if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

        to = to || new from.constructor();
    
        for (var name in from)
        {
            to[name] = typeof to[name] == "undefined" ? this.clone(from[name], null) : to[name];
        }
    
        return to;
    }
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
    box: 16,
    scale: 2,
    sprites_img: new Image(),
    sprites_scaled: null,
    noise_img: null,
    next_turn: new Image(),
    sprites: [],

    init: function(){
        this.box = this.box * this.scale;

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

        this.noise_img = this.fastNoise(world._W*this.box, world._H*this.box, 8 ),

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
            //16
            render.sprites[37] = render.makeSprite(3,2, false); // big skeleton head
            render.sprites[38] = render.makeSprite(6,3, false); // cut forest

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

            render.sprites[36] = [render.makeSprite(2,2, false),render.makeSprite(2,2, true)]; // octopus

            render.sprites[39] = [render.makeSprite(0,6, false),render.makeSprite(0,6, true)]; // ship 0
            render.sprites[40] = [render.makeSprite(1,6, false),render.makeSprite(1,6, true)]; // ship 1
            render.sprites[41] = [render.makeSprite(2,6, false),render.makeSprite(2,6, true)]; // ship 2
            render.sprites[42] = [render.makeSprite(3,6, false),render.makeSprite(3,6, true)]; // ship 3
            render.sprites[43] = [render.makeSprite(4,6, false),render.makeSprite(4,6, true)]; // ship 4
            render.sprites[44] = [render.makeSprite(5,6, false),render.makeSprite(5,6, true)]; // ship 5
            render.sprites[45] = [render.makeSprite(6,6, false),render.makeSprite(6,6, true)]; // ship 6

            render.sprites[46] = [render.makeSprite(0,7, false),render.makeSprite(0,7, true)]; // black pearl 0
            render.sprites[47] = [render.makeSprite(1,7, false),render.makeSprite(1,7, true)]; // black pearl 1
            render.sprites[48] = [render.makeSprite(2,7, false),render.makeSprite(2,7, true)]; // black pearl 2
            
            render.sprites[49] = [render.makeSprite(6,5, false),render.makeSprite(6,5, true)]; // dust
            render.sprites[50] = render.makeSprite(6,7, false); // cloud
            render.sprites[51] = 0;
            render.sprites[52] = 0;
            
            render.sprites[53] = [render.makeSprite(6,4, false),render.makeSprite(6,4, true)]; // lumberjack
            
            render.sprites[54] = render.makeSprite(5,7, false); // cutted palm
            render.sprites[55] = render.makeSprite(3,7, false); // palm
            render.sprites[56] = render.makeSprite(4,7, false); // forest
            

            render.sprites[57] = render.makeSprite(6,2, false); // shout
            render.sprites[58] = render.makeSprite(4,2, false); // message

            render.render({map:true, entities:true,});
        };

        this.next_turn.src = "/media/next_turn.png";
        this.next_turn.onload = function(){
            render.render({gui:true});
        };

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
            gameGUI = document.getElementById('gameGUI');
    
        if(game.play){
            
            if(game.turn.ai){
                this.gui.ctx.fillStyle = '#f8f8f8';
                this.gui.ctx.font = 'bold 1.4em VT323, cursive';
                this.gui.ctx.textBaseline = 'middle';
                this.gui.ctx.textAlign = 'center';
                
                this.gui.ctx.drawImage(this.next_turn, ((world.maps[world.map].width*0.5)<<0)*this.box - ((this.next_turn.width*0.5)<<0), ((world.maps[world.map].height*pos)<<0)*this.box - ((this.next_turn.height*0.5)<<0));
                this.gui.ctx.fillText('Skeleton Army..', ((world.maps[world.map].width*0.5)<<0)*this.box, ((world.maps[world.map].height*pos)<<0)*this.box );
                
                gameGUI.style.display = 'none';
                /*
                DOM.style.MozTransformStyle = 'preserve-3d';
                DOM.style.webkitTransformStyle = 'preserve-3d';                
                
                DOM.style.MozTransform = 'perspective(830px) rotateX(25deg) translate3d(0,50px,120px)';
                DOM.style.webkitTransform = 'perspective(830px) rotateX(25deg) translate3d(0,50px,120px)';
                */
            }else{
                gameGUI.style.display = 'block';
                /*
                DOM.style.MozTransformStyle = '';
                DOM.style.MozTransform = '';
                DOM.style.webkitTransformStyle = '';
                DOM.style.webkitTransform = '';
                */
            }   
            
        }
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
            this.map.ctx.drawImage(this.noise_img, 0, 0);
        }

        if(args.items){
            for(i=0; i<world.maps[world.map].items.length; i++){
                this.map.ctx.drawImage(this.sprites[ world.maps[world.map].items[i].sprite ], world.maps[world.map].items[i].x*this.box, world.maps[world.map].items[i].y*this.box);
            }
        }

        if(args.entities){            
            this.entities.ctx.clearRect(0, 0, world._W*this.box, world._H*this.box);
            for(i=0; i<world.maps[world.map].entities.length; i++){
                if(world.maps[world.map].entities[i].alive){                    
                    this.entities.ctx.drawImage(this.sprites[ world.maps[world.map].entities[i].sprite ][ world.maps[world.map].entities[i].flip ], world.maps[world.map].entities[i].x*this.box, world.maps[world.map].entities[i].y*this.box);
                }
            }
        }

        if(args.gui){
            this.gui.ctx.clearRect(0, 0, world._W*this.box, world._H*this.box);
            for(i=0; i<world.maps[world.map].entities.length; i++){
                if(world.maps[world.map].entities[i].selected){
                    this.gui.ctx.drawImage(this.sprites[10], world.maps[world.map].entities[i].x*this.box, world.maps[world.map].entities[i].y*this.box);
                    for (var j = 0; j < world.maps[world.map].entities[i].move_area.length; j++) {
                        var block = null;
                        if(world.maps[world.map].entities[i].move_area[j].move){
                            block = 9;
                        }
                        if(world.maps[world.map].entities[i].move_area[j].attack){
                            block = 12;
                        }
                        if(world.maps[world.map].entities[i].move_area[j].merge){
                            block = 8;
                        }
                        if(world.maps[world.map].entities[i].move_area[j].forest){
                            block = 38;
                        }
                        if(block){
                            render.gui.ctx.drawImage(render.sprites[block], world.maps[world.map].entities[i].move_area[j].x*render.box, world.maps[world.map].entities[i].move_area[j].y*render.box);
                        }
                    }
                }else{
                    if(world.maps[world.map].entities[i].message && world.maps[world.map].entities[i].squad > 0){
                        this.drawMessage(world.maps[world.map].entities[i].message,world.maps[world.map].entities[i].x, world.maps[world.map].entities[i].y, world.maps[world.map].entities[i].important)
                    }
                }
                if(world.maps[world.map].entities[i].reloading > 0 && world.maps[world.map].entities[i].squad > 0 ){
                    render.gui.ctx.drawImage(render.sprites[15], world.maps[world.map].entities[i].x*render.box, world.maps[world.map].entities[i].y*render.box);
                }
                if(world.maps[world.map].entities[i].moves < 1 && world.maps[world.map].entities[i].squad > 0){
                    render.gui.ctx.drawImage(render.sprites[11], world.maps[world.map].entities[i].x*render.box, world.maps[world.map].entities[i].y*render.box);
                }
            }

            this.drawNextTurn();

        }

        if(game.turn.start){
            document.getElementById('loading').style.display = 'none';
            document.getElementById('game').style.display = 'block';
        }
    },

};