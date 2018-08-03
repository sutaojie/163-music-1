{
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
  console.log(id);
  
}
