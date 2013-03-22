var editor = {
    settings: null,
    entities: [],
    saved_entities: [],
    prices: [
            {unit: 'pirate',price: 10,},
            {unit: 'range_pirate',price: 15,},
            {unit: 'lumberjack',price: 20,},
            {unit: 'skeleton',price: 10,},
            {unit: 'dust',price: 20,},
            {unit: 'ship',price: 50,},
            {unit: 'black_pearl',price: 65,},
            {unit: 'octopus',price: 15,}],
    
    init: function(){
        this.updateSettings();
        game.init(this.settings);        
        game.editor = true;
        game.play = false;        
        this.updateButtons();        
        
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
        world.loadMap(this.settings);        
        game.turn.id = 1;
        game.turn.start = true;
        game.play = true;
        game.editor = false;
        game.preview_play = true;
        
        document.getElementById('gameGUI').style.display = 'block';
        document.getElementById('editorWallet').style.display = 'none';
        document.getElementById('generator').style.display = 'none';
        document.getElementById('play').innerHTML = 'Exit play';
        document.getElementById('play').setAttribute('onclick','editor.exitPlay()');
    },
    
    exitPlay: function(){
        
        game.editor = true;
        game.play = false;
        
        editor.generateMap(false);
        
        render.render({gui:true, entities:true, map:true});
        
        document.getElementById('multi').style.display = 'none';
        document.getElementById('gameGUI').style.display = 'none';
        document.getElementById('editorWallet').style.display = 'block';            
        document.getElementById('generator').style.display = 'block';
        document.getElementById('play').innerHTML = 'Play this map';
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
            entities: this.entities,               
        }
    },
    
    updateButtons: function(){
        if(localStorage.getItem("save")){
            document.getElementById('load').removeAttribute('class');
            document.getElementById('load').setAttribute('onclick','editor.loadSettings()');
        }else{
            document.getElementById('load').setAttribute('class','disabled');
            document.getElementById('load').removeAttribute('onclick');
        }
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
            entities: [],               
        }
        
        document.getElementById('seed').value = this.settings.seed;
        document.getElementById('islands').value = this.settings.islands;
        document.getElementById('islands_size').value = this.settings.islands_size;
        document.getElementById('grass').value = this.settings.grass;
        document.getElementById('palms').value = this.settings.palms;
        document.getElementById('chests').value = this.settings.chests;
         
         
        this.saved_entities = [];   
        
        var entities_from_storage = JSON.parse(localStorage.getItem("entities"));
                
        this.generateMap(true);
        
        for (var i = 0; i < entities_from_storage.length; i++) {
            this.putUnit( entities_from_storage[i].x, entities_from_storage[i].y,entities_from_storage[i].name, entities_from_storage[i].squad);
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
                
        localStorage.setItem("entities",JSON.stringify(this.entities));
        this.updateButtons(); 
        
        console.log(':: SETTINGS SAVED...');
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
    },
    
    putUnit: function(x,y, unit, squad, team){ 
        var new_unit = true,
            team = parseInt(document.getElementById('team').value),
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
            squad = parseInt(document.getElementById('squad').value);
        }
        
        if(!unit){
            unit = document.getElementById('unit').value;
        }
        
        if(new_unit){
            
                if(this.buyUnit(unit, squad, team)){
                
                if(unit == 'pirate'){
                    this.entities.push(new Pirate({x:x,y:y,squad:squad,team:team, ai:ai}));
                    this.saved_entities.push(new Pirate({x:x,y:y,squad:squad,team:team, ai:ai}));                
                }
                
                if(unit == 'range_pirate'){
                    this.entities.push(new RangePirate({x:x,y:y,squad:squad,team:team, ai:ai}));
                    this.saved_entities.push(new RangePirate({x:x,y:y,squad:squad,team:team, ai:ai}));
                }
                
                if(unit == 'lumberjack'){
                    this.entities.push(new Lumberjack({x:x,y:y,team:team, ai:ai}));
                    this.saved_entities.push(new Lumberjack({x:x,y:y,team:team, ai:ai}));
                }
                
                if(unit == 'skeleton'){
                    this.entities.push(new Skeleton({x:x,y:y,squad:squad,team:team, ai:ai}));
                    this.saved_entities.push(new Skeleton({x:x,y:y,squad:squad,team:team, ai:ai}));
                }
                
                if(unit == 'dust'){
                    this.entities.push(new Dust({x:x,y:y,team:team, ai:ai}));
                    this.saved_entities.push(new Dust({x:x,y:y,team:team, ai:ai}));
                }
                
                if(unit == 'octopus'){
                    this.entities.push(new Octopus({x:x,y:y,team:team, ai:ai}));
                    this.saved_entities.push(new Octopus({x:x,y:y,team:team, ai:ai}));
                }
                
                if(unit == 'ship'){
                    this.entities.push(new Ship({x:x,y:y,team:team, ai:ai}));
                    this.saved_entities.push(new Ship({x:x,y:y,team:team, ai:ai}));
                }
                
                if(unit == 'black_pearl'){
                    this.entities.push(new BlackPearl({x:x,y:y,team:team, ai:ai}));
                    this.saved_entities.push(new BlackPearl({x:x,y:y,team:team,ai:ai}));
                }
            }
        }
        
        render.render({entities:true});
    },
    
    
}