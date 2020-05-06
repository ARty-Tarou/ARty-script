//フォローした時に動く
//Folowテーブルにカラムを作成
module.exports = function(req, res){
  //送られてきたデータを取得
  var followerId = req.body.followerId;
  var followedUserId = req.body.followedUserId;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var Follow = ncmb.DataStore('Follow');
  var follow = new Follow();

  follow.set("followerId", followerId)
        .set("followedUserId", followedUserId)
        .save()
        .then(function(follow){
          res.status(200)
             .send("follow save success");
        })
        .catch(function(err){
          res.status(500)
             .send("follow save error");
        });

}
