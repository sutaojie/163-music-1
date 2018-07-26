var http = require('http')
var fs = require('fs')
var url = require('url')
var qiniu = require('qiniu')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  //从这里开始看，上面不要看
 if(path === '/uptoken'){
  response.setHeader('Content-Type','text/html')
  response.setHeader('Access-Control-Allow-Origin',"*")
  var config = fs.openSync('../userKey.json','r')
  config = JSON.parse(config)
  var {accessKey, secretKey} = config
  var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  var options = {
    scope: '163-music-1',
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken=putPolicy.uploadToken(mac);
  response.write(`{
    "uptoken":"${uploadToken}"
  }`)
  response.end()
  }


  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
