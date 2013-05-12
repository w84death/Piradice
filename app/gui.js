var GUI = {
	ctx: null,
	conf: {
		color: '#f8f8f8',
		color2: '#005e67',
		color3: '#884d00',
		labelColor: '#8d611a',
		background: '#007888'		
	},
	buttons: [],
	labels: [],
	hud: [],
	popUp: {
		show: false,
		canvas: null,
		position: {
			x: 0,
			y: 0
		}
	},
	basket: false,
	show: [],

	init: function(){
		this.ctx = render.menu.ctx;		

		this.hud['logo'] = {
			sprite: this.drawHUD({
				sprite: {
					x:0,
					y:11
				},
				width:4,
				height:2,
				scale: 4			
			}),						
			position: {
				x:((render.viewport.width*0.5)<<0)-8,
				y:1}			
		};
		
		this.buttons['play'] = {				
			sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'PLAY'}),
			width: 4,
			height: 2,
			position: {
				x: ((render.viewport.width*0.5)<<0),
				y: render.viewport.height-3
			},
			action: 'game',
			value: 'start',
		};

		this.buttons['share'] = {				
			sprite: this.makeButton({x:4, y:10, width:4, height:2, text:'SHARE MAP'}),
			width: 4,
			height: 2,
			position: {
				x: 2,
				y: render.viewport.height-3
			},
			action: 'game',
			value: 'share',
		};

		this.labels['copyright'] = {
			text: 'Krzysztof Jankowski && Przemyslaw Sikorski',
			position: {
				x: ((render.viewport.width*0.5)<<0),
				y: 5.5
			}
		};

		this.buttons['random'] = {				
				sprite: this.makeButton({x:4, y:10, width:4, height:2, text:'RANDOMIZE'}),
				width: 4,
				height: 2,
				position: {
					x: ((render.viewport.width*0.5)<<0)-4,
					y: render.viewport.height-3
				},
				action: 'game',
				value: 'random',
			};

		this.hud['map'] = {
			sprite: this.drawHUD({
				sprite: {
					x:8,
					y:6
				},
				width:2,
				height:2,
				special: 'map'				
			}),						
			position: {
				x:1,
				y:1
			}			
		};

		this.buttons['map_size1'] = {				
				sprite: this.makeButton({x:4, y:6, width:2, height:2, text:'SMALL'}),
				width: 2,
				height: 2,
				position: {
					x: ((render.viewport.width*0.5)<<0)-2,
					y: render.viewport.height-5
				},
				action: 'mapSize',
				value: 'small',
			};

		this.buttons['map_size2'] = {				
				sprite: this.makeButton({x:4, y:6, width:2, height:2, text:'NORMAL'}),
				width: 2,
				height: 2,
				position: {
					x: ((render.viewport.width*0.5)<<0),
					y: render.viewport.height-5
				},
				action: 'mapSize',
				value: 'normal',
			};
		
		this.buttons['map_size3'] = {				
				sprite: this.makeButton({x:4, y:6, width:2, height:2, text:'BIG'}),
				width: 2,
				height: 2,
				position: {
					x: ((render.viewport.width*0.5)<<0)+2,
					y: render.viewport.height-5
				},
				action: 'mapSize',
				value: 'big',
			};		

		this.buttons['close'] = {				
				sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'CLOSE'}),
				width: 4,
				height: 2,
				position: {
					x: ((render.viewport.width*0.5)<<0)-2,
					y: 10
				},
				action: 'war',
				value: 'close',
			};

		this.buttons['ready'] = {				
				sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'READY'}),
				width: 4,
				height: 2,
				position: {
					x: render.viewport.width-5,
					y: 1
				},
				action: 'game',
				value: 'ready',
			};

		this.buttons['surrender'] = {				
				sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'SURRENDER'}),
				width: 4,
				height: 2,
				position: {
					x: 1,
					y: 1
				},
				action: 'game',
				value: 'surrender',
			};

		this.buttons['surrender_ok'] = {				
				sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'OK'}),
				width: 4,
				height: 2,
				position: {
					x: render.viewport.width-5,
					y: 1
				},
				action: 'game',
				value: 'surrender_ok',
			};

		this.buttons['surrender_cancel'] = {				
				sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'CANCEL'}),
				width: 4,
				height: 2,
				position: {
					x: 1,
					y: 1
				},
				action: 'game',
				value: 'surrender_cancel',
			};

		this.buttons['end'] = {
				sprite: this.makeButton({x:4, y:8, width:4, height:2, text:'END TURN'}),
				width: 4,
				height: 2,
				position: {
					x: render.viewport.width-5,
					y: render.viewport.height-3
				},
				action: 'game',
				value: 'nextTurn',
			};

	// STORE

		this.buttons['ship'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 35, width:2, height:2}),
				width: 2,
				height: 2,
				position: {
					x: render.viewport.width-3,
					y: 1
				},
				action: 'basket',
				value: 'ship'
			};		

		this.buttons['pirate'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 17, width:2, height:2}),
				width: 2,
				height: 2,
				position: {
					x: render.viewport.width-3,
					y: 3
				},
				action: 'basket',
				value: 'pirate'
			};

		this.buttons['gunner'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 29, width:2, height:2}),
				width: 2,
				height: 2,
				position: {
					x: render.viewport.width-3,
					y: 5
				},
				action: 'basket',
				value: 'gunner'
			};

		this.buttons['lumberjack'] = {
				sprite: this.makeButton({x:4, y:6, sprite_over: 53, width:2, height:2}),
				width: 2,
				height: 2,
				position: {
					x: render.viewport.width-3,
					y: 7
				},
				action: 'basket',
				value: 'lumberjack'
			};
			
		this.buttons['cannon'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 59, width:2, height:2}),
			width: 2,
			height: 2,
			position: {
				x: render.viewport.width-3,
				y: 3
			},
			action: 'basket',
			value: 'cannon'
		};

		this.buttons['fort'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 71, width:2, height:2}),	
			width: 2,
			height: 2,			
			position: {
				x: render.viewport.width-3,
				y: 5
			},
			action: 'basket',
			value: 'fort'
		};

		this.buttons['cementary'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 39, width:2, height:2}),
			width: 2,
			height: 2,
			position: {
				x: render.viewport.width-3,
				y: 1
			},
			action: 'basket',
			value: 'cementary'
		};

		this.buttons['octopus'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 36, width:2, height:2}),	
			width: 2,
			height: 2,			
			position: {
				x: render.viewport.width-3,
				y: 3
			},
			action: 'basket',
			value: 'octopus'
		};

		this.buttons['skeleton'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 23, width:2, height:2}),	
			width: 2,
			height: 2,			
			position: {
				x: render.viewport.width-3,
				y: 5
			},
			action: 'basket',
			value: 'skeleton'
		};

		this.buttons['daemon'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 68, width:2, height:2}),	
			width: 2,
			height: 2,			
			position: {
				x: render.viewport.width-3,
				y: 7
			},
			action: 'basket',
			value: 'daemon'
		};

		this.buttons['dust'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 49, width:2, height:2}),	
			width: 2,
			height: 2,			
			position: {
				x: render.viewport.width-3,
				y: 9
			},
			action: 'basket',
			value: 'dust'
		};

		this.buttons['bonfire'] = {
			sprite: this.makeButton({x:4, y:6, sprite_over: 70, width:2, height:2}),	
			width: 2,
			height: 2,			
			position: {
				x: render.viewport.width-3,
				y: 5
			},
			action: 'basket',
			value: 'bonfire'
		};

		this.buttons['buy'] = {
			sprite: this.makeButton({x:8, y:2, width:2, height:2, text:'BUY'}),			
			width: 2,
			height: 2,
			position: {
				x: 1,
				y: 1
			},
			action: 'buy',
			value: 'unit'
		};		

	// HUD
		this.hud['inventory'] = {
			sprite: this.drawHUD({
				sprite: {
					x:8,
					y:8
				},
				width:2,
				height:4,
				icons:				
					[{	
						sprite: render.sprites[14],
						label: '999',
						position: {x:16,y:16}
					},
					{
						sprite: render.sprites[55],
						label: '99',
						position: {x:16,y:68}
					}]
				}),											
			position: {x:1,y:4}				
		};			

		this.labels['gold'] = {
			text: game.teams[game.turn.team].wallet.gold,
			position: {
				x:32,
				y:52,
			},
			live: 'wallet',
			parent: 'inventory'
		};

		this.labels['trees'] = {
			text: game.teams[game.turn.team].wallet.trees,
			position: {
				x:32,
				y:104
			},
			live: 'trees',
			parent: 'inventory'
		};

		this.hud['basket'] = {
			sprite: this.drawHUD({
				sprite: {
					x:10,
					y:2
				},
				width:8,
				height:2,
				icons:				
					[{	
						sprite: render.sprites[14],
						label: '999',
						position: {x:16,y:16}
					},
					{
						sprite: render.sprites[55],
						label: '99',
						position: {x:80,y:16}
					}]
				}),											
			position: {x:0,y:0}				
		};			

		this.labels['basket_gold'] = {
			text: 'gold',
			position: {
				x:64,
				y:32,
			},
			parent: 'basket'
		};

		this.labels['basket_trees'] = {
			text: 'trees',
			position: {
				x:128,
				y:32
			},
			parent: 'basket'
		};		

		if(!game.play){
			game.menu();
		}
		//this.render({menu:true});
	},

	action: function(key){
		if(this.buttons[key].action == 'game'){
			if(this.buttons[key].value == 'start'){
				game.start();
			}
			if(this.buttons[key].value == 'share'){				
				game.shareMap();
			}
			if(this.buttons[key].value == 'surrender'){				
				this.render({surrender:true});
			}
			if(this.buttons[key].value == 'surrender_cancel'){				
				this.render({ready:true});
			}
			if(this.buttons[key].value == 'surrender_ok'){
				game.restart();
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
				GUI.show.push('map');
        		GUI.show.push('inventory');
				GUI.show.push('gold');
        		GUI.show.push('trees');
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
		
		if(this.buttons[key].action == 'war'){
			if(this.buttons[key].value == 'close'){
				this.popUp.show = false;
				GUI.show = ['map','inventory','gold','trees','end'];
				game.play = true;
				render.render({menu:true});
			}
		}

		if(this.buttons[key].action == 'basket'){			
			this.drawBasket({unit:this.buttons[key].value, x:this.buttons[key].position.x, y:this.buttons[key].position.y });
			render.render({menu:true});
		}

		if(this.buttons[key].action == 'buy'){
			shop.buy({unit:this.buttons[key].value});
		}
		
	},

	refreshMap: function(){
		this.hud['map'].sprite = this.drawHUD({
                sprite: {x:8,y:6},
                width:2, height:2,
                special: 'map'});
	},

	drawFooter: function(){
		this.ctx.fillStyle = this.conf.background;
        this.ctx.fillRect(0, (render.viewport.height-2)*render.box, render.viewport.width*render.box, 2*render.box);
	},

	drawBasket: function(args){
		if(this.basket == args.unit){
			// second click? hide the basket
			this.basket = false;
			if(this.show.indexOf('buy')>0){
				this.show.splice(this.show.indexOf('buy'),1);
			}
			this.show.splice(this.show.indexOf('basket'),1);
			this.show.splice(this.show.indexOf('basket_gold'),1);
			this.show.splice(this.show.indexOf('basket_trees'),1);			
		}else{
			// render basket
			this.hud['basket'].position.x = args.x-8;
			this.hud['basket'].position.y = args.y;			
			this.labels['basket_gold'].text = shop.price_list[args.unit].gold;
			this.labels['basket_trees'].text = shop.price_list[args.unit].trees;

			// render buy button
			this.basket = args.unit;
			this.buttons['buy'].position.x = args.x-3;
			this.buttons['buy'].position.y = args.y;
			this.buttons['buy'].value = args.unit;			
			if(this.show.indexOf('basket')<0){
				this.show.push('basket', 'basket_gold', 'basket_trees');
			}
			if(game.teams[game.turn.team].wallet.gold >= shop.price_list[args.unit].gold && game.teams[game.turn.team].wallet.trees >= shop.price_list[args.unit].trees){
				if(this.show.indexOf('buy')<0){
					this.show.push('buy');
				}
			}else{
				if(this.show.indexOf('buy')>0){
					this.show.splice(this.show.indexOf('buy'),1);
				}
			}
		}
	},

	drawSurrender: function(){
		this.ctx.fillStyle = this.conf.background;
		this.ctx.fillRect(0, 0, render.viewport.width*render.box, render.viewport.height*render.box);
		this.ctx.fillStyle = this.conf.color2;
		this.ctx.font = '24px VT323, cursive';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		
		this.ctx.fillText('SURRENDER AND EXIT GAME?', (render.viewport.width*render.box)*0.5<<0, (render.viewport.height*render.box)*0.5<<0);		
		this.show = ['surrender_ok','surrender_cancel'];		
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
		
		this.show = ['ready','surrender'];
	},

	drawEnd: function(args){			
		this.ctx.fillStyle = this.conf.color;
		this.ctx.fillRect(0, 0, render.viewport.width*render.box, render.viewport.height*render.box);

		if(game.teams[game.turn.team].pirates){
			this.ctx.drawImage(render.big_sprites[0],((render.viewport.width*render.box)*0.5<<0) - ((render.big_sprites[0].width*0.5)<<0),((render.viewport.height*render.box)*0.5<<0) - ((render.big_sprites[0].height*0.5)<<0));
		}
		if(game.teams[game.turn.team].skeletons){
			this.ctx.drawImage(render.big_sprites[1],((render.viewport.width*render.box)*0.5<<0) - ((render.big_sprites[1].width*0.5)<<0),((render.viewport.height*render.box)*0.5<<0) - ((render.big_sprites[1].height*0.5)<<0));
		}

		this.ctx.fillStyle = this.conf.color2;
		this.ctx.font = 'bold 32px VT323, cursive';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('GAME OVER', (render.viewport.width*render.box)*0.5<<0, (render.viewport.height-4)*render.box);		
		this.ctx.font = '24px VT323, cursive';
		this.ctx.fillText(args.message, (render.viewport.width*render.box)*0.5<<0, (render.viewport.height-2)*render.box);		
		
		this.show = [];
		this.show.push('new_game');
	},
	
	makeButton: function(args){
		if(!args.height){
			args.height = 2;
		}
		var m_canvas = document.createElement('canvas');
            m_canvas.width = render.box * args.width;
            m_canvas.height = render.box * args.height;
        var m_context = m_canvas.getContext('2d');
        
        m_context.drawImage(render.sprites_img, -args.x*render.box, -args.y*render.box);
		
		if(args.sprite_over){
        	m_context.drawImage(render.sprites[args.sprite_over][0], ((m_canvas.width*0.5)<<0)-16, ((m_canvas.height*0.5)<<0)-16);        	
        }

        if(args.text || args.label){
        	var font_size = '16px',
        		color = this.conf.color,
        		text = args.text,
        		x = (m_canvas.width*0.5)<<0,
        		y = (m_canvas.height*0.5)<<0;

        	if(args.label){
        		font_size = '12px';
        		color = this.conf.labelColor;
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
		var text = args.text,
			pos = {
				x:args.position.x * render.box,
				y:args.position.y * render.box
			};

		this.ctx.fillStyle = this.conf.color3;
		this.ctx.font = '16px VT323, cursive';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';

		if(args.live){
			if(args.live == 'wallet' ) { text = game.teams[game.turn.team].wallet.gold; }
			if(args.live == 'trees' ) { text = game.teams[game.turn.team].wallet.trees; }
		}
		if(args.parent){
			pos.x = ( this.hud[args.parent].position.x*render.box ) + args.position.x;
			pos.y = ( this.hud[args.parent].position.y*render.box ) + args.position.y;
		}
		this.ctx.fillText(text, pos.x, pos.y );
	},

	drawHUD: function(args){
		var m_canvas = document.createElement('canvas');
            m_canvas.width = render.box * args.width;
            m_canvas.height = render.box * args.height;
        var m_context = m_canvas.getContext('2d');
        
        m_context.drawImage(render.sprites_img, -args.sprite.x*render.box, -args.sprite.y*render.box);
        
		if(args.icons){
	        for (var i = 0; i < args.icons.length; i++) {        	
	        	m_context.drawImage(args.icons[i].sprite, args.icons[i].position.x, args.icons[i].position.y);        	
	        };
		}
		if(args.special == 'map'){
			var offset = {x:8,y:10},
				pin = 0;

			for(var y=0; y<world.map.height; y++){
                for(var x=0; x<world.map.width; x++){                     
                    pin = world.map.data[x+(y*world.map.width)];
                    if( pin != 0 && pin != 1){                    	
                    	m_context.fillStyle = this.conf.color3;
        				m_context.fillRect(x+offset.x, y+offset.y, 1,1);
                   	}
                }
            }
	    }
		if(args.scale){
			return render.resize(m_canvas, args.scale);
		}else{
			return m_canvas;	
		}
	},

	warReport: function(args){
		var x = ((render.viewport.width*0.5)<<0)-4,
			y = ((render.viewport.height*0.5)<<0)-3,
			width = 8,
			height = 8;

		var m_canvas = document.createElement('canvas');
            m_canvas.width = render.box * width;
            m_canvas.height = render.box * height;
        var m_context = m_canvas.getContext('2d');
		var center = (((m_canvas.width*0.5)/render.box)<<0);
		
		//m_context.fillStyle = '#ffda90';
		//m_context.fillRect(0, 0, width*render.box, height*render.box);

		m_context.drawImage(render.sprites_img, -10*render.box, -4*render.box);
		
		m_context.drawImage(render.sprites[ args.left.sprite ][ 0 ], center*render.box-(render.box*0.5), render.box-(render.box*0.5));
		m_context.drawImage(render.sprites[ args.right.sprite ][ 1 ], center*render.box-(render.box*0.5), 5*render.box-(render.box*0.5));
		
		m_context.fillStyle = this.conf.labelColor;        	
		m_context.font = '18px VT323, cursive';
		m_context.textBaseline = 'middle';
		m_context.textAlign = 'center';
		m_context.fillText(args.left.hit, center*render.box, 2*render.box);		
		m_context.fillText(args.right.hit, center*render.box, 4*render.box);
		m_context.fillText('vs', center*render.box, 3*render.box);
		m_context.font = '18px VT323, cursive';
		m_context.fillText(args.title, center*render.box, 6*render.box);
		m_context.font = '14px VT323, cursive';
		m_context.fillText(args.message, center*render.box, 7*render.box);
		
		game.play = false;
		this.show = ['close'];
		this.buttons['close'].position.y = y+8;

		//render.post_render();

		this.popUp = {
			show: true,
			canvas: m_canvas,
			position: {
				x: x,
				y: y
			}
		};
		render.render({menu:true});

		//GUI.warReport({left:{unit:world.map.entities[2],hit:10}, right:{unit:world.map.entities[3],hit:4},message:'test message'});
	},

	select: function(x,y){
		var selected = false;

		for (key in this.buttons) {	
			if(x >= this.buttons[key].position.x && x < this.buttons[key].position.x+(this.buttons[key].width) && y >= this.buttons[key].position.y && y < this.buttons[key].position.y+(this.buttons[key].height) ){				
				for (var i = 0; i < this.show.length; i++) {					
					if(key == this.show[i]){
						selected = key;
					}
				}
			}					
		}

		if(selected){
			this.action(selected);
			return true;			
		}else{
			return false;
		}
	},	

	render: function(args){
		
			this.ctx.clearRect(0, 0, render.viewport.width*render.box, render.viewport.height*render.box);
			
			if(args.ready){
				this.drawReady();
			}

			if(args.surrender){
				this.drawSurrender();
			}

			if(args.end){
				this.drawEnd({message: args.message});
			}

			if(this.popUp.show){
				this.ctx.drawImage(this.popUp.canvas, this.popUp.position.x*render.box,this.popUp.position.y*render.box);
			}
			
			for (key in this.hud) {
				for (var i = 0; i < this.show.length; i++) {
					if(this.show[i] == key){
						this.ctx.drawImage(this.hud[key].sprite, this.hud[key].position.x*render.box, this.hud[key].position.y*render.box);
					}
				}
			}

			for (key in this.buttons) {
				for (var i = 0; i < this.show.length; i++) {
					if(this.show[i] == key){
						this.ctx.drawImage(this.buttons[key].sprite, this.buttons[key].position.x*render.box, this.buttons[key].position.y*render.box);
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