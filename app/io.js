var io = {
    init: function(){
        render.gui.canvas.addEventListener('mousedown', io.click, false);
    },

    click: function(e){
        var gameDiv = document.getElementById('game'),
            cX = (e.pageX - gameDiv.offsetLeft)/render.box<<0,
            cY = (e.pageY - gameDiv.offsetTop)/render.box<<0;
                
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