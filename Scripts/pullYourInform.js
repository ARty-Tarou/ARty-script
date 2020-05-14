//他の人のマイページを構成するのに必要かと思われる詳細データを取得
//渡してほしいもの：userのobjectId（userId）
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  var currentUserId = req.body.currentUserId;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var userDetails = ncmb.DataStore('UserDetails');
  var follow = ncmb.DataStore('Follow');

  userDetails.equalTo("userId", userId)
             .include("userData")
             .fetch()
             .then(function(result){
               follow.equalTo("followerId", currentUserId)
                     .equalTo("followedUserId", userId)
                     .fetch()
                     .then(function(followResult){
                       //res.status(200)
                          //.json(followResults);
                       if(followResult.objectId != undefined){
                         res.status(200)
                            .json({result: result, follow: true});
                       }else{
                         res.status(200)
                            .json({result: result, follow: false});
                       }
                     })
                     .catch(function(err){
                       res.status(500)
                          .send("follow fetch error : " + err);
                     });
             })
             .catch(function(err){
               res.status(500)
                  .send("userDetails fetch error : " + err);
             });

}
