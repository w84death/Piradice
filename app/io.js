var io = {
    init: function(){
        if(game.mobile || game.tablet ){
            render.gui.canvas.addEventListener('touchstart', io.click, false);
        }else{
            render.gui.canvas.addEventListener('mousedown', io.click, false);
        }
    },


    click: function(e){
        
        var px,py;
        if(game.mobile || game.tablet ){
            px = event.touches[0].pageX;
            py = event.touches[0].pageY;
        }else{
            px = e.pageX;
            py = e.pageY;
        }

        var gameDiv = document.getElementById('game'),
            cX = (px - gameDiv.offsetLeft)/render.box<<0,
            cY = (py - gameDiv.offsetTop)/render.box<<0;
                
        if(game.play){        

            if(game.unit_selected > -1){
                game.attackOrMove(cX, cY)
                render.render({entities:true, gui:true});
            }else{
                game.select(cX, cY);
                render.render({gui:true});
            }

        }
    },

    clear: function(){
        render.gui.canvas.removeEventListener('mousedown', io.click, false);
    },
};