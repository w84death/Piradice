var audio = {

    pool: [],
    channels: [],
    max_channels: 20,

    init: function(){

        this.pool['music1'] = {
            audio: this.createChannel('http://rezoner.net/dontshare/piradice/loop.mp3'),            
            volume: 0.7,
            loop: true,
        };
        
        this.pool['button'] = {
            audio: this.createChannel('http://rezoner.net/dontshare/piradice/click-ack-hi.mp3'),
            volume: 0.9,
        };

        this.pool['select_unit'] = {
            audio: this.createChannel('http://rezoner.net/dontshare/piradice/click-ack-low.mp3'),
            volume: 0.9,
        };
        
        this.pool['click'] = {
            audio: this.createChannel('http://rezoner.net/dontshare/piradice/general-click.mp3'),
            volume: 0.9,
        };

        this.pool['gold'] = {
            audio: this.createChannel('http://rezoner.net/dontshare/piradice/jrpg-style-ack.mp3'),
            volume: 0.9,
        };      

    },

    createChannel: function(src){
        var audio = document.createElement('audio');         
        //document.body.appendChild(audio);
        
        // loading
        // this.channels[i].addEventLitener('canplaythrough',channelLoaded, false);
        
        audio.setAttribute('src', src);
        return audio;
    },

    play: function(args){
        var create_channel = true;

        if(this.pool[args.sound]){

            for (var i = 0; i < this.channels.length; i++) {
                if(this.channels[i].sound == args.sound && this.channels[i].audio.ended){
                   this.channels[i].audio.volume = this.pool[args.sound].volume;
                   this.channels[i].audio.play();
                   create_channel = false; 
                   return true;
                }
            };

            if(create_channel){
                if(this.channels.length < this.max_channels){
                    var temp_channel = document.createElement('audio'),
                        loop = this.pool[args.sound].loop;
                    temp_channel.setAttribute('src', this.pool[args.sound].audio.src);
                    temp_channel.volume = this.pool[args.sound].volume;
                    temp_channel.play();
                    this.channels.push({
                        audio: temp_channel,
                        sound: args.sound,
                        loop: loop
                    });

                    if(loop){
                        this.channels[this.channels.length-1].audio.addEventListener('ended',audio.replay,false);
                    }

                }else{
                    for (var i = 0; i < this.channels.length; i++) {
                        if((this.channels[i].audio.ended || !this.channels[i].audio.playing) && !this.channels[i].loop){
                            this.channels[i].audio.src = this.pool[args.sound].audio.src;
                            this.channels[i].sound = args.sound;
                            this.channels[i].audio.play();
                            return true;
                        }
                    }
                }
            }

        }
    },

    changeVolume: function(args){
        for (var i = 0; i < this.channels.length; i++) {
            if(this.channels[i].sound == args.sound){
                this.channels[i].audio.volume = args.volume;
            }
        }
        this.pool[args.sound].volume = args.volume;
    },

    stop: function(args){
        for (var i = 0; i < this.channels.length; i++) {
            if(this.channels[i].sound == args.sound){
                this.channels[i].audio.pause();                
            }
        }
    },

    replay: function(){
        for (var i = 0; i < audio.channels.length; i++) {
            if(audio.channels[i].loop && (audio.channels[i].audio.ended || !audio.channels[i].audio.playing)){
                audio.channels[i].audio.play();
            }
        }
    },

}