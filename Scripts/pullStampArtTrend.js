//スタンプアートのトレンドをとるよ。(投稿日時を新しい順に並べそれを見られた数が多い順に並べ替える)
//最大10件（変更可）
//渡してほしいもの：
//返ってくるもの：json型のデータ
module.exports = function(req, res){

  var userId = req.body.userId;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var stick = ncmb.DataStore('Stick');
  var userDetails = ncmb.DataStore('UserDetails');
  var follow = ncmb.DataStore('Follow');
  var good = ncmb.DataStore('Good');

  var userIds = [];
  var stickIds = [];
  var resultJson = [];

  var flag = 0;

  stick.equalTo("stamp", false)
       .order("updateDate", true)
       .order("good", true)
       .order("createDate", true)
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
                        stickIds.push(object.objectId);
                      }
                      resolve(stickResults);
                    }, 1);
                  });
                })
                .then(function(stickResults){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      userDetails.in("userId", userIds)
                                 .include("userData")
                                 .fetchAll()
                                 .then(function(userDetailResults){
                                   resolve([stickResults, userDetailResults]);
                                 })
                                 .catch(function(err){
                                   res.status(500)
                                      .send("userDetails fetch error : " + err);
                                 });
                    }, 1);
                  });
                })
                .then(function(value){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      follow.in("followedUserId", userIds)
                            .equalTo("followerId", userId)
                            .fetchAll()
                            .then(function(followResults){
                              resolve([value[0], value[1], followResults]);
                            })
                            .catch(function(err){
                              res.status(200)
                                 .send("follow fetch error : " + err);
                            });
                    }, 1);
                  });
                })
                .then(function(value){
                  var stickResults = value[0];
                  var userDetailResults = value[1];
                  var followResults = value[2];
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      good.equalTo("userId", userId)
                          .in("stickId", stickIds)
                          .fetchAll()
                          .then(function(goodResults){
                            for(var i = 0; i < stickResults.length; i++){
                              var stickObject = stickResults[i];
                              for(var j = 0; j < userDetailResults.length && flag == 0; j++){
                                var userDetailObject = userDetailResults[j];
                                if(userDetailObject.userId == stickObject.userId){
                                  for(var k = 0; k < followResults.length && flag == 0; k++){
                                    var followObject = followResults[k];
                                    if(followObject.followedUserId == stickObject.userId){
                                      for(var l = 0; l < goodResults.length && flag == 0; l++){
                                        var goodObject = goodResults[l];
                                        if(goodObject.stickId == stickObject.objectId){
                                          resultJson.push({stickData: stickObject, userDetailData: userDetailObject, follow: true, good: true});
                                          flag = 1;
                                        }
                                      }
                                      if(flag == 0){
                                        resultJson.push({stickData: stickObject, userDetailData: userDetailObject, follow: true, good: false});
                                        flag = 1;
                                      }
                                    }
                                  }
                                  if(flag == 0){
                                    for(var l = 0; l < goodResults.length && flag == 0; l++){
                                      var goodObject = goodResults[l];
                                      if(goodObject.stickId == stickObject.objectId){
                                        resultJson.push({stickData: stickObject, userDetailData: userDetailObject, follow: false, good: true});
                                        flag = 1;
                                      }
                                    }
                                    if(flag == 0){
                                      resultJson.push({stickData: stickObject, userDetailData: userDetailObject, follow: false, good: false});
                                      flag = 1;
                                    }
                                  }
                                }
                              }
                              flag = 0;
                            }
                            res.status(200)
                               .json({result: resultJson, skip: stickResults.length});
                          })
                          .catch(function(err){
                            res.status(500)
                               .send("good fetch error : " + err);
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
