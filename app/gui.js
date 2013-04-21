var GUI = {
	ctx: null,
	conf: {
		color: '#f8f8f8',
		color2: '#005e67',
		background: '#007888',
		width: 0,
		bottom: 0,
	},
	buttons: [],
	labels: [],
	show: ['play','random', 'map_size1', 'map_size2', 'map_size3'],

	init: function(){
		this.ctx = render.gui.ctx;

		this.resize();		

		this.buttons['play'] = {				
				sprite: this.makeButton({x:4, y:8, width:2, text:'PLAY'}),
				width:2,
				position: render.viewport.width-4,
				action: 'game',
				value: 'start',
			};

		this.buttons['ready'] = {				
				sprite: this.makeButton({x:4, y:8, width:2, text:'READY'}),
				width:2,
				position: render.viewport.width-4,
				action: 'game',
				value: 'ready',
			};

		this.buttons['random'] = {				
				sprite: this.makeButton({x:4, y:8, width:2, text:'RANDOMIZE'}),
				width:2,
				position: 0,
				action: 'game',
				value: 'random',
			};

		this.buttons['map_size1'] = {				
				sprite: this.makeButton({x:4, y:6, width:1, text:'SMALL'}),
				width:1,
				position: 4,
				action: 'mapSize',
				value: 'small',
			};

		this.buttons['map_size2'] = {				
				sprite: this.makeButton({x:4, y:6, width:1, text:'NORMAL'}),
				width:1,
				position: 6,
				action: 'mapSize',
				value: 'normal',
			};
		
		this.buttons['map_size3'] = {				
				sprite: this.makeButton({x:4, y:6, width:1, text:'BIG'}),
				width:1,
				position: 8,
				action: 'mapSize',
				value: 'big',
			};		

		this.buttons['end'] = {
				sprite: this.makeButton({x:4, y:8, width:2, text:'END TURN'}),
				width:2,
				position: render.viewport.width-4,
				action: 'game',
				value: 'nextTurn',
			};

		this.buttons['ship'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 35, width:1, label:shop.price_list['ship']}),
				width:1,
				position: 2,
				action: 'buy',
				value: 'ship'
			};		

		this.buttons['pirate'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 17, width:1, label:shop.price_list['pirate']}),
				width:1,
				position: 4,
				action: 'buy',
				value: 'pirate'
			};

		this.buttons['range_pirate'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 29, width:1, label:shop.price_list['range_pirate']}),
				width:1,
				position: 6,
				action: 'buy',
				value: 'range_pirate'
			};

		this.buttons['lumberjack'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 53, width:1, label:shop.price_list['lumberjack']}),
				width:1,
				position: 8,
				action: 'buy',
				value: 'lumberjack'
			};

		this.buttons['cementary'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 39, width:1, label:shop.price_list['cementary']}),
			width:1,
			position: 2,
			action: 'buy',
			value: 'cementary'
		};

		this.buttons['octopus'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 36, width:1, label:shop.price_list['octopus']}),	
				width:1,			
				position: 4,
				action: 'buy',
				value: 'octopus'
			};

		this.buttons['skeleton'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 23, width:1, label:shop.price_list['skeleton']}),	
				width:1,			
				position: 6,
				action: 'buy',
				value: 'skeleton'
			};

		this.buttons['dust'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 49, width:1, label:shop.price_list['dust']}),	
				width:1,			
				position: 8,
				action: 'buy',
				value: 'dust'
			};		

		this.labels['wallet'] = {
				text: '$',
				live: 'wallet',
				position: 0,
			};
		this.render({menu:true});
	},

	action: function(key){
		if(this.buttons[key].action == 'game'){
			if(this.buttons[key].value == 'start'){
				game.start();
			}
			if(this.buttons[key].value == 'random'){
				game.randomMap();
			}
			if(this.buttons[key].value == 'nextTurn'){
				game.ready = false;
				game.nextTurn();				
			}			
			if(this.buttons[key].value == 'ready'){	
				game.play = true;
				game.ready = true;
				this.show = [];
				shop.show();
				GUI.show.push('end');
				render.render({all:true});
			}
		}
		if(this.buttons[key].action == 'mapSize'){
			if(this.buttons[key].value == 'small'){
				game.mapSize({w:18,h:12});
			}
			if(this.buttons[key].value == 'normal'){
				game.mapSize({w:24,h:18});
			}
			if(this.buttons[key].value == 'big'){
				game.mapSize({w:48,h:32});
			}
		}
		
		if(this.buttons[key].action == 'buy'){
			shop.buy({unit:this.buttons[key].value});
		}
		
	},

	resize: function(){
		this.conf.width = render.viewport.width;
		this.conf.bottom = render.viewport.height - 2;
	},

	drawFooter: function(){
		this.ctx.fillStyle = this.conf.background;
        this.ctx.fillRect(0, this.conf.bottom*render.box, this.conf.width*render.box, 2*render.box);
	},

	drawReady: function(args){		
		this.ctx.fillStyle = this.conf.background;
        this.ctx.fillRect(0, 0, this.conf.width*render.box, render.viewport.height*render.box);

		if(game.teams[game.turn.team].pirates){
			this.ctx.drawImage(render.big_sprites[0],((render.viewport.width*render.box)*0.5<<0) - ((render.big_sprites[0].width*0.5)<<0),((render.viewport.height*render.box)*0.5<<0) - ((render.big_sprites[0].height*0.5)<<0));
		}
		if(game.teams[game.turn.team].skeletons){
			this.ctx.drawImage(render.big_sprites[1],((render.viewport.width*render.box)*0.5<<0) - ((render.big_sprites[1].width*0.5)<<0),((render.viewport.height*render.box)*0.5<<0) - ((render.big_sprites[1].height*0.5)<<0));
		}

		this.ctx.fillStyle = this.conf.color2;
		this.ctx.font = '24px VT323, cursive';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		
		this.ctx.fillText('TURN '+game.turn.id, (this.conf.width*render.box)*0.5<<0, (render.viewport.height*render.box)*0.9<<0);
		
		this.show = [];
		this.show.push('ready');
		this.render({menu:true});
	},
	
	makeButton: function(args){
		var m_canvas = document.createElement('canvas');
            m_canvas.width = render.box * args.width * 2;
            m_canvas.height = render.box * 2;
        var m_context = m_canvas.getContext('2d');
        
        m_context.drawImage(render.sprites_img, -args.x*render.box, -args.y*render.box);
		
		if(args.sprite_over){
        	m_context.drawImage(render.sprites[args.sprite_over][0], ((m_canvas.width*0.5)<<0)-16, ((m_canvas.height*0.5)<<0)-16);        	
        }

        if(args.text || args.label){
        	var font_size = '16px',
        		color = this.conf.color;
        		text = args.text
        		x = (m_canvas.width*0.5)<<0,
        		y = (m_canvas.height*0.5)<<0;
        	if(args.label){
        		font_size = '12px';
        		color = this.conf.color2;
        		text = args.label;
        		y = (m_canvas.height*0.8)<<0;
        	}
        	m_context.fillStyle = color;        	
			m_context.font = font_size+' VT323, cursive';
			m_context.textBaseline = 'middle';
			m_context.textAlign = 'center';
			m_context.fillText(text, x, y);
        }
        
        return m_canvas;
	},	

	drawLabel: function(args){
		var text = args.text;
		this.ctx.fillStyle = this.conf.color;
		this.ctx.font = '16px VT323, cursive';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		
		if(args.live == 'wallet'){
			text = args.text + game.teams[game.turn.team].wallet;
		}
		this.ctx.fillText(text, (args.position*render.box*2)+render.box, this.conf.bottom*render.box+(render.box));
	},

	select: function(x,y){
		var selected = false;

		for (key in this.buttons) {				
			if(x >= this.buttons[key].position && x < this.buttons[key].position+(this.buttons[key].width*render.scale) ){
				for (var i = 0; i < this.show.length; i++) {					
					if(key == this.show[i]){
						selected = key;
					}
				}
			}					
		}

		if(selected){
			this.action(selected);			
		}
	},	

	render: function(args){
		if(args.menu){
			this.ctx.clearRect(0, this.conf.bottom*render.box, this.conf.width*render.box, 2*render.box);
			this.drawFooter();
			
			for (key in this.buttons) {
				for (var i = 0; i < this.show.length; i++) {
					if(this.show[i] == key){
						this.ctx.drawImage(this.buttons[key].sprite, this.buttons[key].position*render.box, this.conf.bottom*render.box);
					}
				}
			}

			for (key in this.labels) {
				for (var i = 0; i < this.show.length; i++) {
					if(this.show[i] == key){
						this.drawLabel(this.labels[key]);
					}
				}
			}
			/*
			for (var i = 0; i < this.buttons.length; i++) {								
				this.ctx.drawImage(this.buttons[i].sprite, this.buttons[i].position*render.box, this.conf.bottom*render.box);
			};
			for (var i = 0; i < this.labels.length; i++) {				
				this.drawLabel(this.labels[i]);
			};
			*/
		}

		if(args.game){
			var draw = {x:0,y:0}

			this.ctx.clearRect(0, 0, render.viewport.width*render.box, this.conf.bottom*render.box);
			
			if(!game.teams[game.turn.team].ai){
                for(i=0; i<world.map.entities.length; i++){
                    if(world.map.entities[i].selected){
                    	draw.x = world.map.entities[i].x+render.viewport.offset.x;
                    	draw.y = world.map.entities[i].y+render.viewport.offset.y;
                    	if(draw.x >= 0 & draw.y >= 0 && draw.x < render.viewport.width && draw.y < render.viewport.height){
                        	this.ctx.drawImage(render.sprites[10], draw.x*render.box, draw.y*render.box);
                    	}
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
                            	draw.x = world.map.entities[i].move_area[j].x+render.viewport.offset.x;
                    			draw.y = world.map.entities[i].move_area[j].y+render.viewport.offset.y;
                    			if(draw.x >= 0 & draw.y >= 0 && draw.x < render.viewport.width && draw.y < render.viewport.height){
                                	this.ctx.drawImage(render.sprites[block],draw.x*render.box, draw.y*render.box);
                                }
                            }
                        }
                    }else{
                        if(world.map.entities[i].message && world.map.entities[i].alive){
                            draw.x = world.map.entities[i].x+render.viewport.offset.x;
                   			draw.y = world.map.entities[i].y+render.viewport.offset.y;
                   			if(draw.x >= 0 & draw.y >= 0 && draw.x < render.viewport.width && draw.y < render.viewport.height){
                            	render.drawMessage(world.map.entities[i].message,draw.x, draw.y, world.map.entities[i].important);
                        	}
                        }
                    }
                    if(world.map.entities[i].reloading > 0 && world.map.entities[i].alive ){
						draw.x = world.map.entities[i].x+render.viewport.offset.x;
                   		draw.y = world.map.entities[i].y+render.viewport.offset.y;
                   		if(draw.x >= 0 & draw.y >= 0 && draw.x < render.viewport.width && draw.y < render.viewport.height){
                   	    	this.ctx.drawImage(render.sprites[15], draw.x*render.box, draw.y*render.box);
                   	    }
                    }
                    if(world.map.entities[i].moves < 1 && world.map.entities[i].alive){
                        draw.x = world.map.entities[i].x+render.viewport.offset.x;
                   		draw.y = world.map.entities[i].y+render.viewport.offset.y;
                   		if(draw.x >= 0 & draw.y >= 0 && draw.x < render.viewport.width && draw.y < render.viewport.height){
                        	this.ctx.drawImage(render.sprites[11], draw.x*render.box, draw.y*render.box);
                        }
                    }
                }
            }
		}
	}
};