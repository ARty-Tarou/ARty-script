//ユーザーがフォローしている人間一覧を取得
//currentUserがそいつをフォローしてるかも返す。
//渡してほしいもの：userのobjectId（userId）
//                currentUserのobjectId(currentUserId)
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

  var follow = ncmb.DataStore('Follow');
  var myFollow = ncmb.DataStore('Follow');
  var userDetails = ncmb.DataStore('UserDetails');

  var followIds = [];

  var resultJson = [];

  if(userId == currentUserId){
    var follows = myFollow.equalTo("followerId", currentUserId);

    userDetails.select("userId", "followedUserId", follows)
               .include("userData")
               .fetchAll()
               .then(function(results){
                 for(var i = 0; i < results.length; i++){
                   var object = results[i];

                   resultJson.push({userDetail: object, follow: true});
                 }
                 res.status(200)
                    .json(resultJson);
               })
               .catch(function(err){
                 res.status(200)
                    .send("userDetails fetch error : " + err);
               });
  }else{
    Promise.resolve()
           .then(function(){
             return new Promise(function(resolve, reject){
               setTimeout(function(){
                 follow.equalTo("followerId", userId)
                       .fetchAll()
                       .then(function(followResults){
                         for(var i = 0; i < followResults.length; i++){
                           var object = followResults[i];

                           followIds.push(object.followedUserId);
                         }
                         resolve(followIds);
                       })
                       .catch(function(err){
                         res.status(500)
                            .send("follow fetch error : " + err);
                       });
               }, 1);
             });
           })
           .then(function(followIds){
             return new Promise(function(resolve, reject){
               setTimeout(function(){
                 //res.status(200)
                    //.json(followIds);
                 userDetails.in("userId", followIds)
                            .include("userData")
                            .fetchAll()
                            .then(function(userResults){
                              //res.status(200)
                                 //.json(userResults);
                              resolve(userResults);
                            })
                            .catch(function(err){
                              res.status(500)
                                 .send("userDetails fetch error : " + err);
                            });
               }, 1);
             });
           })
           .then(function(userResults){
             return new Promise(function(resolve, reject){
               setTimeout(function(){
                   myFollow.equalTo("followerId", currentUserId)
                           .fetchAll()
                           .then(function(myFollowResults){
                             var flag = 0;
                             for(var i = 0; i < userResults.length; i++){
                               var followDetailObject = userResults[i];

                               for(var j = 0; j < myFollowResults.length; j++){
                                 var myFollowObject = myFollowResults[j];

                                 if(followDetailObject.userId == myFollowObject.followedUserId && flag == 0){
                                   resultJson.push({userDetail: followDetailObject, follow: true});

                                   flag = 1;
                                 }
                               }
                               if(flag == 0){
                                 resultJson.push({userDetail: followDetailObject, follow: false});
                               }else{
                                 flag = 0;
                               }
                             }
                             resolve(resultJson);
                           })
                           .catch(function(err){
                             res.status(500)
                                .send("myFollow fetch error : " + err);
                           });
               }, 1);
             });
           })
           .then(function(resultJson){
             return new Promise(function(resolve, reject){
               setTimeout(function(){
                 res.status(200)
                    .json(resultJson);
               }, 1);
             });
           })
           .catch(function(err){
             res.status(500)
                .json("resultFollow make error : " + err);
           });
  }
}
