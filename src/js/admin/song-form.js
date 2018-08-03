{
    let view = {
        el: '.page > main',
        init() { this.$el = $(this.el) },
        template: `
        <form class="form">
          <div class="row">
            <label>歌名 </label>
            <input name="name" type="text" value="__name__">
          </div>
          <div class="row">
            <label>歌手 </label>
            <input name="songer" type="text" value="__songer__">
          </div>
          <div class="row">
            <label>外链 </label>
            <input name="url" type="text" value="__url__">
          </div>
          <div class="row">
            <label>封面 </label>
            <input name="cover" type="text" value="__cover__">
          </div>
          <div class="row actions">
            <button type="submit">提交</button>
            
          </div>
        </form>
       
        `,
        render(data = {}) {
            let placeholders = ['name', 'songer', 'url', 'cover']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || "")
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h3>编辑歌曲</h3>')
            }else{
                $(this.el).prepend('<h3>新建歌曲</h3>')
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', songer: '', url: '', id: '', cover: ''
        },
        createSong(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('songer', data.songer);
            song.set('url', data.url)
            song.set('cover', data.cover)
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            }, function (error) {
                console.error(error);
            });
        },
        updateSong(data){
          var song = AV.Object.createWithoutData('Song', this.data.id);
          song.set('name', data.name);
          song.set('songer', data.songer);
          song.set('url', data.url)
          song.set('cover', data.cover)
          return song.save().then((response)=>{
            Object.assign(this.data, data)
            return response 
          });
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        create(){
          let needs = 'name songer url'.split(' ')
          let data = {}
          needs.map((string) => {
              data[string] = this.view.$el.find(`[name="${string}"]`).val()
          })
          this.model.createSong(data)
              .then(() => {
                  this.model.data = data
                  this.view.reset()
                  let string = JSON.stringify(data)
                  let object = JSON.parse(string)
                  window.eventHub.emit('create', object)
              })
        },
        update(){
          let needs = 'name songer url cover'.split(' ')
          let data = {}
          needs.map((string) => {
              data[string] = this.view.$el.find(`[name="${string}"]`).val()
          })
        this.model.updateSong(data) 
              .then(()=>{
                window.eventHub.emit('updata',JSON.parse(JSON.stringify(this.model.data)))

              })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()

                if(this.model.data.id){
                  this.update()
                }else{
                  this.create()
                }
               

            })
        },
        bindEventHub(){
            window.eventHub.on('new', (data) => {
                if(this.model.data.id ) {
                    this.model.data = {name: '', songer: '', url: '', id: '',} 
                }else{
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('select',(data)=>{
                this.model.data = data
                this.view.render(data)
                
            })
        }

    }
    controller.init(view, model)
}