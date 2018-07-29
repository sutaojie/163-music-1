{
    let view={
        el:'.page > main',
        init(){this.$el=$(this.el)},
        template:`
        <h3>新建歌曲</h3>
        <form class="form">
          <div class="row">
            <label>歌名 </label>
            <input name="name" type="text" value="__key__">
          </div>
          <div class="row">
            <label>歌手 </label>
            <input name="songer" type="text">
          </div>
          <div class="row">
            <label>外链 </label>
            <input name="url" type="text" value="__link__">
          </div>
          <div class="row actions">
            <button type="submit">提交</button>
          </div>
        </form>
       
        `,
        render(data = {}){
            let placeholders = ['key', 'link']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string]||"")
            })
            $(this.el).html(html)
        }
    }
    let model = {}
    let controller= {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data)=>{
                this.view.render(data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit', 'form', (e)=>{
                e.preventDefault()
                let needs = 'name songer url'.split(' ')
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                console.log(data);
                
            })
        }

    }
    controller.init(view, model)
}