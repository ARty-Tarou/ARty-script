module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  var stickId = req.body.stickId;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var stick = ncmb.DataStore('Stick');
  var userDetails = ncmb.DataStore('UserDetails');
  var PointerGood = ncmb.DataStore('PointerGood');

  var pointers = [];

  stick.equalTo("objectId", stickId)
       .include("staticData")
       .fetch()
       .then(function(stickResult){
         pointers.push(stickResult);

         userDetails.equalTo("userId", userId)
                    .include("userData")
                    .fetch(function(userResult){
                      pointers.push(userResult);

                      var pointerGood = new PointerGood({stickData: pointers[0], userData: pointers[1]});

                      pointerGood.save()
                                 .then(function(result){
                                   res.status(200)
                                      .send("pointerGood save error : " + err);
                                 })
                                 .catch(function(err){
                                   res.status(500)
                                      .send("pointerGood save error : " + err);
                                 });
                    })
                    .catch(function(err){
                      res.status(500)
                         .send("userDetails fetch error : " + err);
                    });
       })
       .catch(function(err){
         res.status(500)
            .send("stick fetch error : " + err);
       });



}
