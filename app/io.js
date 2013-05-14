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

var io = {
    touch: {
        init: false,
        move: false,
        start: {x:0,y:0},
        end: {x:0,y:0},
        counter: {x:0,y:0},
    },

    init: function(){
        if(game.mobile || game.tablet ){
            render.viewport.canvas.addEventListener('touchstart', io.begin, false);
            render.viewport.canvas.addEventListener('touchmove', io.move, false);
            render.viewport.canvas.addEventListener('touchend', io.click, false);
        }else{
            render.viewport.canvas.addEventListener('mousedown', io.begin, false);
            render.viewport.canvas.addEventListener('mousemove', io.move, false);
            render.viewport.canvas.addEventListener('mouseup', io.click, false);
        }
    },

    selected: function(cX,cY){
                    
        if(GUI.select(cX,cY)){
            audio.play({sound:'button'});
            return true;
        }else{
            if(game.play){        
                realX = cX - render.viewport.offset.x;
                realY = cY - render.viewport.offset.y;

                if(game.unit_selected !== false){
                    game.attackOrMove(realX, realY)
                    render.render({entities:true, gui:true});
                    return false;
                }else{
                    if(game.select(realX, realY)){
                        render.render({gui:true});
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }

        return false
    },

    begin: function(e){
        
        var px,py;
        if(game.mobile || game.tablet ){
            px = e.changedTouches[0].pageX;
            py = e.changedTouches[0].pageY;
        }else{
            px = e.pageX;
            py = e.pageY;
        }

        var gameDiv = document.getElementById('game'),
            cX = ((px - gameDiv.offsetLeft)/render.box<<0),
            cY = ((py - gameDiv.offsetTop)/render.box<<0);

        
        if(game.mobile || game.tablet ){
            io.touch.start.x = e.touches[0].pageX;
            io.touch.start.y = e.touches[0].pageY;
        }else{
            io.touch.start.x = e.pageX;
            io.touch.start.y = e.pageY;
        }            

        if(!io.selected(cX,cY)){
            io.touch.init = true;
        }
    },

    move: function(e){
    	e.preventDefault();
        if(io.touch.init && (game.play || game.map)){
            if(game.mobile || game.tablet ){
                px = e.touches[0].pageX;
                py = e.touches[0].pageY;
            }else{
                px = e.pageX;
                py = e.pageY;
            }

            if( px > io.touch.start.x &&  px - io.touch.start.x >= (render.box*0.5) ){
                render.move({x:1,y:0});
                io.touch.start.x = px;
                io.touch.move = true;
            }else
            if( px < io.touch.start.x &&  io.touch.start.x  - px >= (render.box*0.5) ){
                render.move({x:-1,y:0});
                io.touch.start.x = px;
                io.touch.move = true;
            }else
            if( py > io.touch.start.y &&  py - io.touch.start.y >= (render.box*0.5) ){
                render.move({x:0,y:1});
                io.touch.start.y = py;
                io.touch.move = true;
            }else
            if( py < io.touch.start.y &&  io.touch.start.y  - py >= (render.box*0.5) ){
                render.move({x:0,y:-1});
                io.touch.start.y = py;
                io.touch.move = true;
            }
        }
    },

    click: function(e){
        io.touch.init = false;        
        io.touch.move = false;
    },

    clear: function(){        
        if(game.mobile || game.tablet ){
            render.viewport.canvas.removeEventListener('touchstart', io.begin, false);
            render.viewport.canvas.removeEventListener('touchmove', io.move, false);
            render.viewport.canvas.removeEventListener('touchend', io.click, false);
        }else{
            render.viewport.canvas.removeEventListener('mousedown', io.begin, false);
            render.viewport.canvas.removeEventListener('mousemove', io.move, false);
            render.viewport.canvas.removeEventListener('mouseup', io.click, false);
        }
    },
};