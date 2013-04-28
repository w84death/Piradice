var GUI = {
	ctx: null,
	conf: {
		color: '#f8f8f8',
		color2: '#005e67',
		background: '#007888',
		bottom: 0,		
	},
	buttons: [],
	labels: [],
	show: ['play','random', 'map_size1', 'map_size2', 'map_size3'],

	init: function(){
		this.ctx = render.menu.ctx;		
		this.conf.bottom = render.viewport.height-2;

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
				position: ((render.viewport.width*0.5)<<0)-2,
				action: 'game',
				value: 'ready',
			};

		this.buttons['new_game'] = {				
				sprite: this.makeButton({x:4, y:8, width:2, text:'END GAME'}),
				width:2,
				position: 0,
				action: 'game',
				value: 'new',
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

	drawFooter: function(){
		this.ctx.fillStyle = this.conf.background;
        this.ctx.fillRect(0, (render.viewport.height-2)*render.box, render.viewport.width*render.box, 2*render.box);
	},

	drawReady: function(args){			
		this.ctx.fillStyle = this.conf.background;
		this.ctx.fillRect(0, 0, render.viewport.width*render.box, render.viewport.height*render.box);

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
		
		this.ctx.fillText('TURN '+game.turn.id, (render.viewport.width*render.box)*0.5<<0, 2*render.box);		
		
		this.show = [];
		this.show.push('ready');
		this.show.push('new_game');
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
		this.ctx.fillText(text, (args.position*render.box*2)+render.box, render.viewport.height*render.box+(render.box));
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
		
			this.ctx.clearRect(0, 0, render.viewport.width*render.box, render.viewport.height*render.box);
			
			if(args.ready){
				this.drawReady();
			}

			this.drawFooter();

			for (key in this.buttons) {
				for (var i = 0; i < this.show.length; i++) {
					if(this.show[i] == key){
						this.ctx.drawImage(this.buttons[key].sprite, this.buttons[key].position*render.box, (render.viewport.height-2)*render.box);
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
		render.post_render();
	}
};