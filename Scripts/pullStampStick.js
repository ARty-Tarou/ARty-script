module.exports = function(req, res){
  //送られてきたデータを取得
  var stampName = req.body.stampName;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var stampStick = ncmb.DataStore('stampStick');
  var stick = ncmb.DataStore('Stick');

  stampStick.equalTo("stampName", stampName)
            .fetch()
            .then(function(result){
              var id = result.objectId;
              stick.equalTo("stamp", true)
                   .fetchAll()
                   .then(function(results){
                     for(var i = 0; i < results.length; i++){
                       var object = results[i];
                       var staticData = object.staticData;
                       if(staticData.objectId == id){
                         res.status(200)
                            .json(object);
                       }
                     }
                   })
                   .catch(function(err){
                     res.status(500)
                        .send("stick fetch error : " + err);
                   });
            })
            .catch(function(err){
              res.status(500)
                 .send("stampStick fetch error : " + err);
            });

}
