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
    version: 'DEV 4',
    paused: true,
    turn: {
        id: 1,
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

        console.log('\nWELCOME TO PIRADICE\n' + this.version);

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

        if(this.turn.team === 0){
            for (var i = 0; i < world.maps[world.map].entities.length; i++) {
                if(world.maps[world.map].entities[i].x == cX && world.maps[world.map].entities[i].y == cY && world.maps[world.map].entities[i].team == this.turn.team && world.maps[world.map].entities[i].moves > 0 && world.maps[world.map].entities[i].reloading < 1) {
                    world.maps[world.map].entities[i].select();
                    world.maps[world.map].entities[i].open();
                    this.unit_selected = i;
                }
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

                if(world.maps[world.map].entities[i].squad < 1){
                    world.maps[world.map].entities[i].moves = 0;
                    world.maps[world.map].entities[i].x = 0;
                    world.maps[world.map].entities[i].y = 0;
                }

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
                    if(world.maps[world.map].entities[i].transport && world.maps[world.map].entities[i].on_board < 1){

                    }else{
                        world.maps[world.map].entities[i].shout();
                    }
                }
            }
            this.turn.start = false;
            next_turn = false;
        }else{
            for (i = 0; i < world.maps[world.map].entities.length; i++) {
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
                // AI TURN
                this.turn.team = 0;
                this.turn.ai = false;
                this.turn.id++;

            }else{
                // PLAYER turn
                this.turn.team = 1;
                this.turn.ai = true;
            }

            var loose = true;

            for (i = 0; i < world.maps[world.map].entities.length; i++) {
                if(world.maps[world.map].entities[i].team === 0 && world.maps[world.map].entities[i].squad > 0){
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

            this.unit_selected = -1;

            if(loose){
                this.lose();
            }

            this.turn.start = true;

            if(this.turn.ai){
                 ai.loop();
                 /*s
                 -webkit-transform-style: preserve-3d;
                -webkit-transform: perspective(950) rotateX(30deg);
                */
            }
        }

        render.render({gui:true, entities:true});
    },

    win: function(){
        if(world.map < world.maps.length-1){
            world.map++;
            this.turn.start = true;
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
    loop_id: 0,

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



    loop: function() {
        setTimeout(function () {
            game.nextTurn();
            if (game.turn.ai) {
                ai.loop();
            }
    }, 500);
}
};

var world = {
    _W: 0,
    _H: 0,
    map: localStorage.getItem("map_dev") || 0,
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

        this.sprites_img.src = "media/sprites.png";
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
            render.sprites[8] = render.makeSprite(2,1, false); // palm
            render.sprites[9] = render.makeSprite(4,0, false); // move
            render.sprites[10] = render.makeSprite(5,0, false); // select
            render.sprites[11] = render.makeSprite(5,1, false); // done
            render.sprites[12] = render.makeSprite(6,0, false); // attack
            render.sprites[13] = render.makeSprite(0,2, false); // treasure
            render.sprites[14] = render.makeSprite(1,2, false); // treasure open
            render.sprites[15] = render.makeSprite(5,2, false); // reloading
            render.sprites[37] = render.makeSprite(3,2, false); // big skeleton head
            render.sprites[38] = render.makeSprite(4,2, false); // message

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
            render.sprites[49] = [render.makeSprite(3,7, false),render.makeSprite(3,7, true)]; // black pearl 3
            render.sprites[50] = [render.makeSprite(4,7, false),render.makeSprite(4,7, true)]; // black pearl 4
            render.sprites[51] = [render.makeSprite(5,7, false),render.makeSprite(5,7, true)]; // black pearl 5
            render.sprites[52] = [render.makeSprite(6,7, false),render.makeSprite(6,7, true)]; // black pearl 6


            render.render({map:true, entities:true,});
        }

        this.next_turn.src = "media/next_turn.png";
        this.next_turn.onload = function(){
            render.render({gui:true});
        }

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

    drawMessage: function(msg, x, y){

        this.gui.ctx.drawImage(this.sprites[38], (x*this.box)-(12), (y*this.box)-(18));
        this.gui.ctx.fillStyle = '#000';
        this.gui.ctx.font = '12px VT323, cursive';
        this.gui.ctx.textBaseline = 'top';
        this.gui.ctx.textAlign = 'center';
        this.gui.ctx.fillText(msg , (x*this.box)+(4), (y*this.box)-(4));
    },

    drawNextTurn: function(){
        var pos = 0.1;

        if(game.turn.start || game.turn.ai){

            document.getElementById('loading').style.display = 'none';
            document.getElementById('game').style.display = 'block';

            //this.gui.ctx.fillStyle = 'rgba(0,0,0,0.2)';
            //this.gui.ctx.fillRect(0, 0, world._W*this.box, world._H*this.box);

            this.gui.ctx.fillStyle = '#f8f8f8';
            this.gui.ctx.font = 'bold 1.4em VT323, cursive';
            this.gui.ctx.textBaseline = 'middle';
            this.gui.ctx.textAlign = 'center';


            this.gui.ctx.drawImage(this.next_turn, ((world.maps[world.map].width*0.5)<<0)*this.box - ((this.next_turn.width*0.5)<<0), ((world.maps[world.map].height*pos)<<0)*this.box - ((this.next_turn.height*0.5)<<0));

            if(game.turn.ai){
                this.gui.ctx.fillText('Skeleton Army..', ((world.maps[world.map].width*0.5)<<0)*this.box, ((world.maps[world.map].height*pos)<<0)*this.box );
            }else{
                this.gui.ctx.fillText('Your turn', ((world.maps[world.map].width*0.5)<<0)*render.box, ((world.maps[world.map].height*pos)<<0)*this.box );
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
                if(world.maps[world.map].entities[i].squad > 0){
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
                        if(world.maps[world.map].entities[i].move_area[j].attack){
                            render.gui.ctx.drawImage(render.sprites[12], world.maps[world.map].entities[i].move_area[j].x*render.box, world.maps[world.map].entities[i].move_area[j].y*render.box);
                        }else{
                            render.gui.ctx.drawImage(render.sprites[9], world.maps[world.map].entities[i].move_area[j].x*render.box, world.maps[world.map].entities[i].move_area[j].y*render.box);
                        }
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

            this.drawNextTurn();

        }

    },

};


game.init();