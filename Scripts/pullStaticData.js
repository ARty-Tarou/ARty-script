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

  var stick = ncmb.DataStore('Stick');

  var staticData = []

  stick.equalTo("stamp", true)
       .include("staticData")
       .fetchAll()
       .then(function(results){
         Promise.resolve()
                .then(function(){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      for(var i = 0; i < results.length; i++){
                        var object = results[i];
                        staticData.push(object.staticData);
                      }
                      resolve([results, staticData]);
                    }, 1);
                  });
                })
                .then(function(value){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      var results = value[0];
                      var staticData = value[1];
                      for(var i = 0; i < results.length; i++){
                        if(staticData[i].stampName == stampName){
                          res.status(200)
                             .json(results[i]);
                        }
                      }
                      res.status(500)
                         .send("stick fetch error : " + err);
                    },1);
                  });
                })
                .catch(function(err){
                  res.status(500)
                     .send("stick fetch error : " + err);
                });
       })
       .catch(function(err){
         res.status(500)
            .send("staticData fetch error : " + err);
       });

}
