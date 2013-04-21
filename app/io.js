var io = {
    touch: {
        init: false,
        start: {x:0,y:0},
        end: {x:0,y:0},
        counter: {x:0,y:0},
    },

    init: function(){
        if(game.mobile || game.tablet ){
            render.gui.canvas.addEventListener('touchstart', io.begin, false);
            render.gui.canvas.addEventListener('touchmove', io.move, false);
            render.gui.canvas.addEventListener('touchend', io.click, false);
        }else{
            render.gui.canvas.addEventListener('mousedown', io.begin, false);
            render.gui.canvas.addEventListener('mousemove', io.move, false);
            render.gui.canvas.addEventListener('mouseup', io.click, false);
        }
    },

    begin: function(e){
        io.touch.init = true;
        if(game.mobile || game.tablet ){
            io.touch.start.x = event.touches[0].pageX;
            io.touch.start.y = event.touches[0].pageY;
        }else{
            io.touch.start.x = e.pageX;
            io.touch.start.y = e.pageY;
        }        
    },

    move: function(e){
        if(io.touch.init){
            if(game.mobile || game.tablet ){
                px = event.touches[0].pageX;
                py = event.touches[0].pageY;
            }else{
                px = e.pageX;
                py = e.pageY;
            }
            if( px > io.touch.start.x &&  px - io.touch.start.x >= render.box){
                render.move({x:1,y:0});
                io.touch.start.x = px;
            }else
            if( px < io.touch.start.x &&  io.touch.start.x  - px >= render.box){
                render.move({x:-1,y:0});
                io.touch.start.x = px;
            }else
            if( py > io.touch.start.y &&  py - io.touch.start.y >= render.box){
                render.move({x:0,y:1});
                io.touch.start.y = py;
            }else
            if( py < io.touch.start.y &&  io.touch.start.y  - py >= render.box){
                render.move({x:0,y:-1});
                io.touch.start.y = py;
            }
        }
    },

    click: function(e){
        io.touch.init = false;
        var px,py;
        if(game.mobile || game.tablet ){
            px = event.touches[0].pageX;
            py = event.touches[0].pageY;
        }else{
            px = e.pageX;
            py = e.pageY;
        }

        var gameDiv = document.getElementById('game'),
            cX = ((px - gameDiv.offsetLeft)/render.box<<0),
            cY = ((py - gameDiv.offsetTop)/render.box<<0);
        
        if(cY >= GUI.conf.bottom){
            GUI.select(cX,cY);
        }else{
            if(game.play){        
                cX += render.viewport.offset.x;
                cY += render.viewport.offset.y;
                if(game.unit_selected > -1){
                    game.attackOrMove(cX, cY)
                    render.render({entities:true, gui:true});
                }else{
                    game.select(cX, cY);
                    render.render({gui:true});
                }

            }
        }
    },

    clear: function(){
        render.gui.canvas.removeEventListener('mousedown', io.click, false);
    },
};