//自分がフォローしている人間一覧を取得
//渡してほしいもの：userのobjectId（userId）
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var follow = ncmb.DataStore('Follow');
  var userDetails = ncmb.DataStore('UserDetails');

  var resultFollow = [];
  var ids = [];

  Promise.resolve()
         .then(function(){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
               follow.equalTo("followerId", userId)
                     .fetchAll()
                     .then(function(followResults){
                       resolve(followResults);
                     })
                     .catch(function(err){
                       res.status(500)
                          .send("follow fetch error : " + err);
                     });
             }, 1000);
           });
         })
         .then(function(followResults){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
               for(var i = 0; i < followResults.length; i++){
                 var object = followResults[i];

                 ids.push(object.followedUserId);
               }
               resolve(ids);
             }, 1000);
           });
         })
         .then(function(ids){
           userDetails.in("userId", ids)
                      .include("userData")
                      .fetchAll()
                      .then(function(userResults){
                        res.status(200)
                           .json(userResults);
                      })
                      .catch(function(err){
                        res.status(500)
                           .send("userDetails fetch error : " + err);
                      });
         })
         .catch(function(err){
           res.status(500)
              .json("resultFollow make error : " + err);
         });


}
