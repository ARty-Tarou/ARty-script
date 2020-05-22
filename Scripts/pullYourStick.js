//他の人の投稿を検索してくるよ
//渡してほしいもの：userのobjectId（userId）
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
  var currentUserId = req.body.currentUserId;
  var userId = req.body.userId;
  var skip = req.body.skip;

  if(skip == ""){
    skip = 0;
  }else{
    skip = Number(skip);
  }

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  //グッドテーブルとスティックテーブルのインスタンスを生成
  var good = ncmb.DataStore('Good');
  var stick = ncmb.DataStore('Stick');
  var follow = ncmb.DataStore('Follow');
  var userDetails = ncmb.DataStore('UserDetails');

  var stickIds = [];
  var resultJson = [];

  var flag = 0;

  //Stickを検索
  stick.equalTo("userId", userId)
       .include("staticData")
       .order("updateDate", true)
       .skip(skip)
       .fetchAll()
       .then(function(stickResults){
         Promise.resolve()
                .then(function(){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      //res.status(200)
                         //.json(stickResults);
                      for(var i = 0; i < stickResults.length; i++){
                        var object = stickResults[i];

                        stickIds.push(object.objectId);
                      }
                      resolve(stickResults);
                    }, 1);
                  });
                })
                .then(function(stickResults){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      //res.status(200)
                         //.json(stickResults);
                      userDetails.equalTo("userId", userId)
                                 .include("userData")
                                 .fetch()
                                 .then(function(userDetailResult){
                                   resolve([stickResults, userDetailResult]);
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
                      //res.status(200)
                        //.json(value);
                      var followflag = true;
                      follow.equalTo("followedUserId", userId)
                            .equalTo("followerId", currentUserId)
                            .fetchAll()
                            .then(function(result){
                              //res.status(200)
                                 //.json(result);
                              if(!result.objectId){
                                followflag = false;
                              }
                              resolve([value[0], value[1], followflag]);
                            })
                            .catch(function(err){
                              res.status(200)
                                 .send("follow fetch error : " + err);
                            });
                    }, 1);
                  });
                })
                .then(function(value){
                  return new Promise(function(resolve, reject){
                    setTimeout(function(){
                      var stickResults = value[0];
                      good.equalTo("userId", currentUserId)
                          .in("stickId", stickIds)
                          .fetchAll()
                          .then(function(goodResults){
                            for(var i = 0; i < stickResults.length; i++){
                              var stickObject = stickResults[i];
                              for(var j = 0; flag == 0 && j < goodResults.length; j++){
                                var goodObject = goodResults[j];
                                if(goodObject.stickId == stickObject.objectId){
                                  resultJson.push({stickData: stickObject, userDetailData: value[1], follow: value[2], good: true});
                                  flag = 1;
                                }
                              }
                              if(flag == 0){
                                resultJson.push({stickData: stickObject, userDetailData: value[1], follow: value[2], good: false});
                                flag = 1;
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
            .send("stick fetch error : " + err);
       });
}
