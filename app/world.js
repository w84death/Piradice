var world = {
    saved_map: [],
    map: [],
    conf: { 
        width: 0,
        height: 0,
        seed: (Math.random()*1024)<<0,
        islands: 2 + (Math.random()*6)<<0,
        islands_size: 5 + (Math.random()*70)<<0,      
        grass: 0 + (Math.random()*80)<<0,
        palms: 0 + (Math.random()*80)<<0,
        chests: 2 + (Math.random()*4)<<0,
    },
    generator_version: 1,

    init: function(args){                

        this.conf.width = args.width;
        this.conf.height = args.height;
        
        if(window.location.hash === ''){
            this.randomMap();                             
        }else{
            this.decodeHash();
            this.generate();
        }
    },
    
    randomMap: function(){        

        this.conf.seed = (Math.random()*1024)<<0;        
        this.conf.grass = 0 + (Math.random()*80)<<0;
        this.conf.palms = 0 + (Math.random()*80)<<0;

        this.conf.islands = 2 + (Math.random()*6)<<0;
        this.conf.islands_size = 10 + (Math.random()*70)<<0;
        this.conf.chests = 2 + (Math.random()*4)<<0;           
        
        this.generate();             
    },

    generate: function(){
        this.encodeHash();
        this.map = [];
        this.map = maps.load(this.conf);
        this.saved_map = utilities.clone(this.map);
    },

    encodeHash: function(){
        var hash = '#',
            separator = '|';

        hash += this.conf.width + separator +
            this.conf.height + separator +
            this.conf.seed + separator +
            this.conf.islands + separator +
            this.conf.islands_size + separator +
            this.conf.grass + separator +
            this.conf.palms + separator +
            this.conf.chests + separator +
            this.generator_version;

        window.location.hash = hash;
    },

    decodeHash: function(){
        var hash = window.location.hash.substr(1),
            separator = '|',
            block = [];

        block = hash.split(separator);
        if(block.length == 9){
            this.conf.width = block[0];
            this.conf.height = block[1];
            this.conf.seed = block[2];
            this.conf.islands = block[3];
            this.conf.islands_size = block[4];
            this.conf.grass = block[5];
            this.conf.palms = block[6];
            this.conf.chests = block[7];
            this.generator_version = block[8];            
        }else{
            alert('ERROR: WRONG HASH!');            
            this.randomMap();
            this.encodeHash();
        }
    },
    
    mapSize: function(args){
        this.conf.width = args.w;
        this.conf.height = args.h;
        this.generate();
    },

    restartMap: function(){
        this.map = [];
        this.map = utilities.clone(this.saved_map);
        render.render({all:true});
    },     

    loadMap: function(){
        this.conf = { 
            width: 64,
            height: 32,
            seed: 'czapka' || localStorage.getItem("seed"),
            islands: 8 || localStorage.getItem("islands"),
            islands_size: 30 || localStorage.getItem("islands_size"),      
            grass: 40 || localStorage.getItem("grass"),
            palms: 15 || localStorage.getItem("palms"),
            chests: 4 || localStorage.getItem("chests"),
            wallet: 500 || localStorage.getItem("wallet"),
        },
        this.generate();
    },

    saveMap: function(){
        localStorage.setItem("seed",this.conf.seed);
        localStorage.setItem("islands",this.conf.islands);
        localStorage.setItem("islands_size",this.conf.islands_size);
        localStorage.setItem("grass",this.conf.grass);
        localStorage.setItem("palms",this.conf.palms);
        localStorage.setItem("chests",this.conf.chests);        
        localStorage.setItem("wallet",this.conf.wallet);   
    },

    clearTerrain: function(args){

        for (var i = 0; i < this.map.items.length; i++) {
            if(this.map.items[i].forest){
                for (var x = args.x-args.size; x <= args.x+args.size; x++) {
                    for (var y = args.y-args.size; y <= args.y+args.size; y++) {                       
                        if(this.map.items[i].x === x && this.map.items[i].y === y){
                            this.map.moves[this.map.items[i].x+(this.map.items[i].y*this.map.width)] = 1;                                        
                            this.map.items.splice(i,1);//for_cut.push(i);        
                        }                        
                    }
                }
            }
        }

        render.render({map:true});
    },  
};