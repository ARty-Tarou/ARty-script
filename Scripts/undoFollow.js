//フォローを解除した時に動く
//Folowテーブルにカラムを削除、フォロワー数等を1減らす
/*
渡してほしいもの：userのobjectId（followerId）
                フォローを解除したいuserのobjectId（followedUserId）
*/
//返ってくるもの：メッセージ
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

  var follow = ncmb.DataStore('Follow');
  var followerDetail = ncmb.DataStore('UserDetails');
  var followedUserDetail = ncmb.DataStore('UserDetails');

  follow.equalTo("followerId", followerId)
        .equalTo("followedUserId", followedUserId)
        .fetch()
        .then(function(result){
          return result.delete();
        })
        .then(function(result){
          followerDetail.equalTo("userId", followerId)
                        .fetch()
                        .then(function(followerResult){
                          followerResult.setIncrement("numberOfFollow", -1)
                          return followerResult.update();
                        })
                        .then(function(result){
                          followedUserDetail.equalTo("userId", followedUserId)
                                            .fetch()
                                            .then(function(followedUserResult){
                                              followedUserResult.setIncrement("numberOfFollowed", -1)
                                              return followedUserResult.update();
                                            })
                                            .then(function(result){
                                              res.status(200)
                                                 .send("All object save success");
                                            })
                                            .catch(function(err){
                                              res.status(500)
                                                 .send("followedUserDetail save error : " + err);
                                            });
                        })
                        .catch(function(err){
                          res.status(500)
                             .send("followerDetail save error : ", + err);
                        });
        })
        .catch(function(err){
          res.status(500)
             .send("follow save error");
        });

}
