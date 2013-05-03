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

    begin: function(e){
        io.touch.init = true;
        if(game.mobile || game.tablet ){
            io.touch.start.x = e.touches[0].pageX;
            io.touch.start.y = e.touches[0].pageY;
        }else{
            io.touch.start.x = e.pageX;
            io.touch.start.y = e.pageY;
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
        if(!io.touch.move){
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
	        
	        if(GUI.select(cX,cY)){
	            return true;
	        }else{
	            if(game.play){        
	                realX = cX - render.viewport.offset.x;
	                realY = cY - render.viewport.offset.y;
	
	                if(game.unit_selected > -1){
	                    game.attackOrMove(realX, realY)
	                    render.render({entities:true, gui:true});
	                }else{
	                    game.select(realX, realY);
	                    render.render({gui:true});
	                }
	
	            }
	        }
        }
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