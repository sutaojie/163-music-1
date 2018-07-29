{
    let view = {
        el: '.page > main',
        init() { this.$el = $(this.el) },
        template: `
        <h3>新建歌曲</h3>
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
          <div class="row actions">
            <button type="submit">提交</button>
          </div>
        </form>
       
        `,
        render(data = {}) {
            let placeholders = ['name', 'songer', 'url']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || "")
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', songer: '', url: '', id: ''
        },
        createSong(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('songer', data.songer);
            song.set('url', data.url)
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            }, function (error) {
                console.error(error);
            });
        },

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
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

            })
        }

    }
    controller.init(view, model)
}