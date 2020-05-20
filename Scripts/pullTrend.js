//トレンドをとるよ。(投稿日時を新しい順に並べそれを見られた数が多い順に並べ替える)
//最大10件（変更可）
//渡してほしいもの：
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var stick = ncmb.DataStore('Stick');
  var userDetails = ncmb.DataStore('UserDetails');

  var userIds = [];
  var resultJson = [];

  stick.order("updateDate", true)
       .order("numberOfViews", true)
       .include("staticData")
       .limit(10)
       .fetchAll()
       .then(function(stickResults){
         Promise.resolve()
                .then(function(){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      for(var i = 0; i < stickResults.length; i++){
                        var object = stickResults[i];
                        userIds.push(object.userId);
                      }
                      resolve(stickResults);
                    }, 1);
                  });
                })
                .then(function(value){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      var flag = 0;
                      userDetails.in("userId", userIds)
                                 .include("userData")
                                 .fetchAll()
                                 .then(function(userResults){
                                   for(var i = 0; i < stickResults.length; i++){
                                     var stickObject = stickResults[i];
                                     for(var j = 0; j < userResults.length; j++){
                                       var userObject = userResults[j];
                                       if(stickObject.userId == userObject.userId && flag == 0){
                                         resultJson.push({stickData: stickObject, userDetailData: userObject});
                                         flag = 1;
                                       }
                                     }
                                     flag = 0;
                                   }
                                   res.status(200)
                                      .json(resultJson);
                                 })
                                 .catch(function(err){
                                   res.status(500)
                                      .send("userDetails fetch error : " + err);
                                 });
                    }, 1);
                  });
                })
                .catch(function(err){
                  res.status(500)
                     .send("resultJson make error : " + err);
                });
       })
       .catch(function(err){
         res.status(500)
            .send("Error : " + err);
       });

}
