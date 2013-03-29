var editor = {
    settings: null,
    entities: [],
    saved_entities: [],
    basket: null,
    initalized: false,
    
    prices: [
            {unit: 'pirate',price: 10,},
            {unit: 'range_pirate',price: 15,},
            {unit: 'lumberjack',price: 20,},
            {unit: 'skeleton',price: 10,},
            {unit: 'dust',price: 20,},
            {unit: 'ship',price: 50,},
            {unit: 'cementary',price: 40,},
            {unit: 'octopus',price: 15,}],
    
    init: function(args){
        if(args.random){
            this.randomSettings();
            this.updateButtons();
        }

        if(!this.initalized){
            this.updateSettings();                        
            game.init(this.settings);        
            game.editor = true;
            game.play = false;
            this.updateButtons();
            this.initalized = true;
        }else{
            this.generateMap();
        }        
    },
    
    generateMap: function(clear){
        game.editor = true;
        game.play = false;
        if(clear){
            this.entities = [];
        }else {
            this.entities = utilities.clone(this.saved_entities);
        }
        this.updateSettings();        
        world.loadMap(this.settings);
        render.render({gui:true, entities:true, map:true});
    },
    
    playMap: function(){
        this.updateSettings();
               
        game.turn.id = 1;
        game.turn.team = 0;
        game.turn.start = true;
        game.play = true;
        game.editor = false;
        game.preview_play = true;        
        world.loadMap(this.settings); 
        shop.buyStarter();     
        game.shoutTeam();   
        render.render({all:true});
        document.getElementById('settings').style.display = 'none';
        document.getElementById('world').style.display = 'none';
        
        document.getElementById('nextTurn').style.display = 'inline-block';
        document.getElementById('play').style.display = 'none';
    },
    
    exitPlay: function(){
        
        game.editor = true;
        game.play = false;
        
        editor.generateMap(false);
        
        render.render({gui:true, entities:true, map:true, clearSky:true});
        
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('world').style.display = 'inline-block';

        document.getElementById('nextTurn').style.display = 'none';
        document.getElementById('play').style.display = 'inline-block';
        document.getElementById('play').innerHTML = 'PLAY';
        document.getElementById('play').setAttribute('onclick','editor.playMap()');
    },
    
    updateSettings: function(){
        this.settings = { 
            editor: true,
            id: 0,
            seed: document.getElementById('seed').value,
            islands: parseInt(document.getElementById('islands').value),
            islands_size: parseInt(document.getElementById('islands_size').value),      
            grass: parseInt(document.getElementById('grass').value),
            palms: parseInt(document.getElementById('palms').value),
            chests: parseInt(document.getElementById('chests').value),
            wallet: 200,
            player1_gold: game.teams[0].wallet,
            player2_gold: game.teams[1].wallet,
            entities: this.entities,               
        }
    },

    randomSettings: function(){
        this.settings = { 
            editor: true,
            id: 0,
            seed: (Math.random()*1024)<<0,
            islands: 1 + (Math.random()*12)<<0,
            islands_size: 10 + (Math.random()*70)<<0,      
            grass: 0 + (Math.random()*80)<<0,
            palms: 10 + (Math.random()*80)<<0,
            chests: 1 + (Math.random()*4)<<0,
            wallet: 200,
            entities: [],               
        }
    },
    
    updateButtons: function(){
        document.getElementById('nextTurn').style.display = 'none';
        document.getElementById('play').style.display = 'inline-block';
                
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('world').style.display = 'inline-block';

        if(localStorage.getItem("save")){
            document.getElementById('load').removeAttribute('class');
            document.getElementById('load').setAttribute('onclick','editor.loadSettings()');
        }else{
            document.getElementById('load').setAttribute('class','disabled');
            document.getElementById('load').removeAttribute('onclick');
        }  

        document.getElementById('seed').value = this.settings.seed;
        document.getElementById('islands').value = this.settings.islands;
        document.getElementById('islands_size').value = this.settings.islands_size;
        document.getElementById('grass').value = this.settings.grass;
        document.getElementById('palms').value = this.settings.palms;
        document.getElementById('chests').value = this.settings.chests;          
        document.getElementById('player1_gold').value = this.settings.player1_gold;  
        document.getElementById('player2_gold').value = this.settings.player2_gold;      
    },
    
    loadSettings: function(){
        console.log(':: LOADING...');
        this.settings = { 
            editor: true,
            id: 0,
            seed: localStorage.getItem("seed"),
            islands: localStorage.getItem("islands"),
            islands_size: localStorage.getItem("islands_size"),      
            grass: localStorage.getItem("grass"),
            palms: localStorage.getItem("palms"),
            chests: localStorage.getItem("chests"),
            wallet: localStorage.getItem("wallet"),
            player1_gold: localStorage.getItem("player1_gold"),
            player2_gold: localStorage.getItem("player2_gold"),
            entities: [],               
        }
                
        this.updateButtons();
        game.updateGold({
            player1: player1_gold,
            player2: player2_gold
        });
        this.saved_entities = [];   
        
        var entities_from_storage = JSON.parse(localStorage.getItem("entities"));
                
        this.generateMap(true);
        
        for (var i = 0; i < entities_from_storage.length; i++) {
            this.putUnit( entities_from_storage[i].x, entities_from_storage[i].y,entities_from_storage[i].name, entities_from_storage[i].squad, entities_from_storage[i].team);
        }
        
        console.log(':: SETTINGS LOADED');
        
    },
    
    saveSettings: function(){        
        console.log(':: SAVEING...');
        
        localStorage.setItem("save",true);
        localStorage.setItem("seed",this.settings.seed);
        localStorage.setItem("islands",this.settings.islands);
        localStorage.setItem("islands_size",this.settings.islands_size);
        localStorage.setItem("grass",this.settings.grass);
        localStorage.setItem("palms",this.settings.palms);
        localStorage.setItem("chests",this.settings.chests);        
        localStorage.setItem("wallet",this.settings.wallet);            
        localStorage.setItem("entities",JSON.stringify(this.entities));
        localStorage.setItem("player1_gold",game.teams[0].wallet);
        localStorage.setItem("player2_gold",game.teams[1].wallet);
        this.updateButtons(); 
        
        console.log(':: SETTINGS SAVED...');
    },
    
    addToBasket: function(unit){
        editor.basket = unit;   
    },
    
    buyUnit: function(unit, squad, team){        
        var price = 0;
            
        for (var i = 0; i < this.prices.length; i++) {
            if(this.prices[i].unit == unit){
                price = this.prices[i].price;
            }
        }            
        
        if(price*squad > game.teams[team].wallet){
            return false;
        }else{
            game.teams[team].wallet -= price*squad;
            game.updateWallet();
            return true;
        }
    },
    
    sellUnit: function(unit, squad, team){
        var price = 0;
            
        for (var i = 0; i < this.prices.length; i++) {
            if(this.prices[i].unit == unit){
                price = this.prices[i].price;
            }
        }
        
        game.teams[team].wallet += price*squad;
        game.updateWallet();
        game.updateUnits();
    },
    
    putUnit: function(x,y, unit, squad, team){         
                
        var new_unit = true,            
            ai = game.teams[team].ai;
        

        for (var i = 0; i < this.entities.length; i++) {
            if(this.entities[i].x == x && this.entities[i].y == y){
                this.sellUnit(this.entities[i].name, this.entities[i].squad, this.entities[i].team);
                new_unit = false;
                this.entities.splice(i, 1);
                this.saved_entities.splice(i, 1);                
            }
        }
        
        if(!squad){
            squad = 1;
        }
        
        if(!unit){
            unit = this.basket;
        }
        
        if(new_unit){
            
            if(this.buyUnit(unit, squad, team)){
                
                if(unit == 'pirate'){
                    this.entities.push(new Pirate({x:x,y:y,squad:1,team:0, ai:ai}));
                    this.saved_entities.push(new Pirate({x:x,y:y,squad:1,team:0, ai:ai}));                
                }
                
                if(unit == 'range_pirate'){
                    this.entities.push(new RangePirate({x:x,y:y,squad:1,team:0, ai:ai}));
                    this.saved_entities.push(new RangePirate({x:x,y:y,squad:1,team:0, ai:ai}));
                }
                
                if(unit == 'lumberjack'){
                    this.entities.push(new Lumberjack({x:x,y:y,team:0, ai:ai}));
                    this.saved_entities.push(new Lumberjack({x:x,y:y,team:0, ai:ai}));
                }
                
                if(unit == 'ship'){
                    this.entities.push(new Ship({x:x,y:y,team:0, ai:ai}));
                    this.saved_entities.push(new Ship({x:x,y:y,team:0, ai:ai}));
                }

                if(unit == 'skeleton'){
                    this.entities.push(new Skeleton({x:x,y:y,squad:1,team:1, ai:ai}));
                    this.saved_entities.push(new Skeleton({x:x,y:y,squad:1,team:1, ai:ai}));
                }
                
                if(unit == 'dust'){
                    this.entities.push(new Dust({x:x,y:y,team:1, ai:ai}));
                    this.saved_entities.push(new Dust({x:x,y:y,team:1, ai:ai}));
                }
                
                if(unit == 'octopus'){
                    this.entities.push(new Octopus({x:x,y:y,team:1, ai:ai}));
                    this.saved_entities.push(new Octopus({x:x,y:y,team:1, ai:ai}));
                }
                
                if(unit == 'cementary'){
                    //this.entities.push(new Cementary({x:x,y:y,team:1, ai:ai}));
                    //this.saved_entities.push(new Cementary({x:x,y:y,team:1, ai:ai}));
                }
                
            }
        }
        
        game.updateUnits();
        render.render({entities:true});
    },
    
    
}