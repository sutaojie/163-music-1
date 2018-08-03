{
    let view = {

    } 
    let model = {
        
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            console.log(id);
            
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
