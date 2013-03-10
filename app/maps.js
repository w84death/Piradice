var load = {
    maps: [],
    
    init: function(){
        
        this.maps[0] = {
            name:   'Tutorial',
            width:  16,
            height: 12,
            data: [
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,
                0,0,0,0,2,2,4,4,2,0,0,0,0,0,0,0,
                0,0,0,0,2,5,4,4,2,2,0,0,0,0,0,0,
                0,0,0,0,3,2,5,5,2,3,0,0,0,0,0,0,
                0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
            ],
            moves: [],
            entities: [                                
                new Pirate({x:4,y:5,squad:1,team:0}),
                new Pirate({x:4,y:6,squad:2,team:0}),                
                new Skeleton({x:6,y:6,squad:1,team:1}),
                new Skeleton({x:7,y:6,squad:1,team:1}),
            ],
            items: [
                new Ship({x:3, y:5}),
                new Chest({x:7, y:5}),
                new Palm({x:6, y:5})
            ]    
        };
        
        this.maps[1] = {
            name:   'First islands',
            width:  16,
            height: 12,
            data: [
                0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,
                0,1,1,2,2,2,1,1,1,1,1,1,1,1,0,0,
                1,1,2,2,4,2,2,2,2,1,1,2,2,1,1,1,
                1,2,4,4,4,4,2,2,3,6,2,5,4,5,2,1,
                1,2,5,5,5,5,2,3,1,1,3,2,5,2,3,1,
                1,3,2,2,3,3,3,1,1,1,1,3,3,3,1,1,
                1,1,3,3,1,1,1,1,1,1,1,1,7,1,1,1,
                0,1,1,7,1,1,0,1,1,2,2,4,4,4,2,1,
                1,1,1,4,4,1,0,1,2,5,4,4,4,5,2,1,
                1,4,4,4,4,1,0,1,3,2,5,5,5,2,3,1,
                1,5,5,5,5,1,0,1,1,3,3,3,3,3,1,1,
                1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,
            ],
            moves: [],
            entities: [
                new Pirate({x:1,y:3,squad:1,team:0}),
                new RangePirate({x:1,y:5,squad:1,team:0}),
                new Pirate({x:2,y:3,squad:2,team:0}),                
                new Pirate({x:1,y:4,squad:1,team:0}),
                new Pirate({x:14,y:9,squad:2,team:0}),
                new Pirate({x:13,y:10,squad:1,team:0}),
                new Pirate({x:13,y:9,squad:1,team:0}),
                new Skeleton({x:5,y:2,squad:2,team:1}),
                new Skeleton({x:4,y:5,squad:1,team:1}),
                new Skeleton({x:12,y:4,squad:2,team:1}),
                new Skeleton({x:9,y:8,squad:1,team:1}),
                new Skeleton({x:13,y:8,squad:1,team:1}),                
                new Skeleton({x:4,y:9,squad:1,team:1}),
            ],
            items: [
                new Chest({x:5, y:4}),
                new Chest({x:11, y:2}),
                new Chest({x:9, y:8}),
                new Chest({x:1, y:10}),
                new Palm({x:4,y:3}),
                new Palm({x:11,y:7}),
                new Palm({x:11,y:8}),
                new Palm({x:10,y:8}),
                new Palm({x:3, y:3}),
                new Palm({x:2, y:9}),
                new Palm({x:4, y:8}),
                new Palm({x:4, y:10}),
                new Palm({x:1, y:9}), 
                new Palm({x:12, y:3}),
                new Ship({x:0, y:3}),
                new Ship({x:15, y:9})
            ]        
        };
            
        this.maps[2] = {
            name:   'Big land',
            width:  16,
            height: 12,
            data: [
                0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,
                1,1,2,2,1,1,0,0,0,0,1,1,1,1,1,1,
                1,2,2,2,2,1,1,0,0,1,1,4,4,4,5,1,
                1,2,2,2,2,2,1,0,0,1,4,4,4,4,1,1,
                1,2,2,2,2,2,1,0,0,1,5,4,4,4,4,1,
                1,3,2,4,3,1,1,0,0,1,1,4,4,4,5,1,
                1,1,5,4,1,1,0,0,0,0,1,5,4,4,1,1,
                0,1,1,7,1,1,0,0,0,0,1,1,5,4,1,1,
                0,1,1,4,4,1,1,1,1,1,0,1,1,4,4,1,
                0,1,5,4,4,4,5,5,4,1,1,1,4,4,5,1,
                0,1,1,5,5,5,1,1,5,5,6,5,5,5,1,1,
                0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0
            ],
            moves: [],
            entities: [
                new Pirate({x:2,y:1,squad:2,team:0}),
                new Pirate({x:2,y:2,squad:3,team:0}),
                new Pirate({x:3,y:1,squad:2,team:0}),                
                new RangePirate({x:3,y:3,squad:3,team:0}),
                new RangePirate({x:1,y:2,squad:1,team:0}),
                new Skeleton({x:4,y:4,squad:1,team:1}),
                new Skeleton({x:3,y:9,squad:5,team:1}),                
                new Skeleton({x:8,y:10,squad:3,team:1}),
                new Skeleton({x:13,y:5,squad:1,team:1}),
                new Skeleton({x:11,y:4,squad:2,team:1}),
                new Skeleton({x:13,y:7,squad:1,team:1}),
                new Skeleton({x:12,y:5,squad:1,team:1}),
                new Skeleton({x:12,y:6,squad:1,team:1})
                
            ],
            items: [
                new Chest({x:12, y:3}),
                new Palm({x:4, y:8}),
                new Palm({x:12, y:9}),
                new Palm({x:14, y:8}),
                new Palm({x:12, y:2}),
                new Palm({x:13, y:4}),
                new Palm({x:14, y:4}),
                new Palm({x:14, y:5}),
                new Palm({x:11, y:3}),
                new Palm({x:10, y:3}),
                new Palm({x:10, y:4}),
                new Ship({x:1, y:1})                
            ]    
        };
        
        this.maps[3] = {
            name:   'Hunting',
            width:  16,
            height: 12,
            data: [
                0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,
                1,1,2,2,1,1,2,2,3,3,2,2,1,1,1,0,
                1,2,2,2,2,2,2,2,1,1,3,2,2,2,1,1,
                1,2,2,3,3,2,2,3,1,1,1,3,3,2,2,1,
                1,2,2,1,1,3,3,1,1,1,1,1,1,2,2,1,
                1,2,2,1,1,1,1,1,4,4,1,1,1,2,2,1,
                1,2,2,1,1,0,0,1,5,4,1,1,1,2,2,1,
                1,3,2,2,1,1,1,1,1,7,1,1,1,2,3,1,
                1,1,3,2,2,2,1,1,1,4,4,4,4,3,1,1,
                0,1,1,3,2,2,4,4,4,5,5,5,1,1,1,0,
                0,0,1,1,3,3,3,5,5,1,1,1,1,0,0,0,
                0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0
            ],
            moves: [],
            entities: [                                
                new RangePirate({x:2,y:1,squad:1,team:0}),
                new RangePirate({x:2,y:2,squad:1,team:0}),
                new RangePirate({x:1,y:3,squad:2,team:0}),
                
                new RangePirate({x:13,y:2,squad:1,team:0}),
                new RangePirate({x:13,y:3,squad:1,team:0}),
                new RangePirate({x:14,y:3,squad:3,team:0}),
                
                new Skeleton({x:14,y:6,squad:3,team:1}),
                new Skeleton({x:13,y:7,squad:1,team:1}),
                new Skeleton({x:11,y:9,squad:1,team:1}),
                
                new Skeleton({x:6,y:1,squad:1,team:1}),
                new Skeleton({x:1,y:6,squad:1,team:1}),
                new Skeleton({x:5,y:2,squad:1,team:1}),                
                new Skeleton({x:2,y:7,squad:1,team:1}),                
                new Skeleton({x:6,y:10,squad:3,team:1}),
                new Skeleton({x:5,y:9,squad:2,team:1}),
                new Skeleton({x:13,y:8,squad:1,team:1})
            ],
            items: [
                new Ship({x:1, y:1}),
                new Ship({x:14, y:2}),
                new Chest({x:9, y:5}),
                new Chest({x:6, y:9}),
                new Chest({x:12, y:8}),
                new Palm({x:8, y:5}),
                new Palm({x:10, y:8}),
                new Palm({x:11, y:8}),
                new Palm({x:8, y:9}),
                new Palm({x:7, y:9})
            ]    
        };
        
                    
        for (var i = 0; i < this.maps.length; i++) {                                
            for (var j = 0; j < this.maps[i].data.length; j++) {
                if(this.maps[i].data[j] === 0 || this.maps[i].data[j] == 1){
                    this.maps[i].moves.push(0);
                }else{
                    this.maps[i].moves.push(1);
                }
            }
        }
    },
    
    map: function(){
        this.init();
        return this.maps;
    },
    
       
};

