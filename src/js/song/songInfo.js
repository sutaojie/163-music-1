{
    let view = {
        el:'#app',
        template:`
        <audio autoplay controls src="{{url}}"></audio> 
        `,
        render(data){
            $(this.el).html(this.template.replace('{{url}}', data.url))
        }
    } 
    let model = {
        data:{
            id:'',
            name:'',
            songe:'',
            url:'',
        },
        get(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=> {
                // return {id:song.id, ...song.attributes}  
                
                Object.assign(this.data, song.attributes)
                return song
            }, function (error) {
                console.log(error);
                
            });
        }
        
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
                
            })           
        },
        getSongId(){
            let search = window.location.search;
            if (search.indexOf("?") === 0) {
              search = search.substring(1);
            }
            let id = ''
            let array = search.split('&').filter((v=>v))
            for(let i=0; i<array.length; i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                  id = value
                  break;
                }
                
            }
           return id
        }
    }
    controller.init(view, model)
  
}
