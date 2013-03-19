var editor = {
    settings: null,
    entities: [],
    saved_entities: [],
    
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
        
        game.turn.start = true;
        game.play = true;
        game.editor = false;
        game.preview_play = true;
        
        document.getElementById('generator').style.display = 'none';
        document.getElementById('play').innerHTML = 'Exit play';
        document.getElementById('play').setAttribute('onclick','editor.exitPlay()');
    },
    
    exitPlay: function(){
        
        game.editor = true;
        game.play = false;
        
        editor.generateMap(false);
        
        render.render({gui:true, entities:true, map:true});
        
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
    
    putUnit: function(x,y, unit, squad){ 
        
        
        var new_unit = true;
        
        for (var i = 0; i < this.entities.length; i++) {
            if(this.entities[i].x == x && this.entities[i].y == y){
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
            
            if(unit == 'pirate'){
                this.entities.push(new Pirate({x:x,y:y,squad:squad,team:0}));
                this.saved_entities.push(new Pirate({x:x,y:y,squad:squad,team:0}));                
            }
            
            if(unit == 'range_pirate'){
                this.entities.push(new RangePirate({x:x,y:y,squad:squad,team:0}));
                this.saved_entities.push(new RangePirate({x:x,y:y,squad:squad,team:0}));
            }
            
            if(unit == 'skeleton'){
                this.entities.push(new Skeleton({x:x,y:y,squad:squad,team:1}));
                this.saved_entities.push(new Skeleton({x:x,y:y,squad:squad,team:1}));
            }
            
            if(unit == 'octopus'){
                this.entities.push(new Octopus({x:x,y:y,squad:1,team:1}));
                this.saved_entities.push(new Octopus({x:x,y:y,squad:1,team:1}));
            }
            
            if(unit == 'ship'){
                this.entities.push(new Ship({x:x,y:y,squad:1,team:0}));
                this.saved_entities.push(new Ship({x:x,y:y,squad:1,team:0}));
            }
            
            if(unit == 'black_pearl'){
                this.entities.push(new BlackPearl({x:x,y:y,squad:1,team:0}));
                this.saved_entities.push(new BlackPearl({x:x,y:y,squad:1,team:0}));
            }
        }
        
        render.render({entities:true});
    },
    
    
}