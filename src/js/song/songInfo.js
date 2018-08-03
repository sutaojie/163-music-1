{
  let view = {
    el: "#app",
    init(){
      this.$el = $(this.el)
    },
    render(data) {
      let { song, status } = data;
      this.$el.css("background-image", `url(${song.cover})`);
      this.$el .find("img.cover") .attr("src", song.cover);
      this.$el.find('.song-description > h1').text(song.name)
      if ( this.$el.find("audio").attr("src") !== song.url) {
        this.$el .find("audio") .attr("src", song.url);
          let audio = this.$el.find("audio").get(0)
          audio.onended = ()=>{ 
            this.$el .find(".disc-container") .removeClass("playing");
          }

      }
      if (status === "playing") {
        this.$el .find(".disc-container") .addClass("playing")
          
      } else {
        this.$el .find(".disc-container") .removeClass("playing");
      }
      let {lyrics} = song;
      let array = lyrics.split('\n').map((string)=>{
        let p = document.createElement('p')
        p.textContent = string
        this.$el.find('.lyric > .lines').append(p)  
        return p
      })
      
      
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
      status: "paused"
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
