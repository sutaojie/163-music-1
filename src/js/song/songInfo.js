{
  let view = {
    el: "#app",
    init(){
      this.$el = $(this.el)
    },
    render(data) {
      let { song, status, loadlyricStatus } = data;
      this.$el.find('.blurImage').css("background-image", `url(${song.cover})`);
      this.$el .find("img.cover") .attr("src", song.cover);
      this.$el.find('.song-description > h1').text(song.name)
      if ( this.$el.find("audio").attr("src") !== song.url) {
        this.$el .find("audio") .attr("src", song.url);
          let audio = this.$el.find("audio").get(0)
          audio.onended = ()=>{ 
            this.$el .find(".disc-container") .removeClass("playing");
          }
          audio.ontimeupdate = ()=>{
             this.showLyric(audio.currentTime)
                    
          }

      }
      if (status === "playing") {
        this.$el .find(".disc-container") .addClass("playing")
          
      } else {
        this.$el .find(".disc-container") .removeClass("playing");
      }
     let {lyrics} = song 
      if(loadlyricStatus){
        this.loadLyric(lyrics)
      }
      
    },
    loadLyric(lyric){
      let lyrics = lyric;
      let regex = /\[([\d:|\d.]+)\](.+)/
      let array = lyrics.split('\n').map((string)=>{
        let p = document.createElement('p')
        let match = string.match(regex)
        if(match){
          p.textContent = match[2]
          let time = match[1].split(':')
          let minutes = time[0]
          let secondes = time[1]
          let newTime = parseFloat(minutes,10)*60 + parseFloat(secondes,10)
          p.setAttribute('data-time', newTime)
        }else{
          p.textContent = string
        }
      
        this.$el.find('.lyric > .lines').append(p)  
      })
    },
    showLyric(lyricTime){
      
      let allP = this.$el.find('.lyric > .lines > p')
      
      for(let i =0; i<allP.length-1; i++){
        let currentTime = allP.eq(i).attr('data-time')
        let nextTime = allP.eq(i+1).attr('data-time')
        if(currentTime < lyricTime && lyricTime < nextTime){
          let h1 = allP.eq(i).offset().top
          let h2 = this.$el.find('.lyric > .lines ').offset().top
          let height = h1 - h2
          allP.eq(i).addClass('active').siblings().removeClass('active')
          this.$el.find('.lyric > .lines').css('transform', `translateY(${-(height-25)}px)`)
          break;
          
        }
      }
      
    },
    play() {
      this.$el .find("audio")[0] .play();
    },
    pause() {
      this.$el
        .find("audio")[0]
        .pause();
    }
  };
  let model = {
    data: {
      song: {
        id: "",
        name: "",
        songe: "",
        url: "",
        cover: ""
      },
      status: "paused",
      loadlyricStatus: 'loading'
    },
    get(id) {
      var query = new AV.Query("Song");
      return query.get(id).then(song => {
        // return {id:song.id, ...song.attributes}

        Object.assign(this.data.song, song.attributes);
        return song;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init()
      let id = this.getSongId();
      this.model.get(id).then(() => {
        this.view.render(this.model.data);
      });
      this.bindEvents();
    },
    bindEvents() {
      $(this.view.el).on("click", ".icon-wrapper", () => {
        if (this.model.data.status === "playing") {
          this.model.data.status = "paused";
          this.view.render(this.model.data);
          this.view.pause();
        } else {
          this.model.data.status = "playing";
          this.model.data.loadlyricStatus = '';
          this.view.render(this.model.data);
          this.view.play();
        }
      });
    },
    getSongId() {
      let search = window.location.search;
      if (search.indexOf("?") === 0) {
        search = search.substring(1);
      }
      let id = "";
      let array = search.split("&").filter(v => v);
      for (let i = 0; i < array.length; i++) {
        let kv = array[i].split("=");
        let key = kv[0];
        let value = kv[1];
        if (key === "id") {
          id = value;
          break;
        }
      }
      return id;
    }
  };
  controller.init(view, model);
}
