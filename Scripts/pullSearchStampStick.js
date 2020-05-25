//searchWordを使ってStickテーブルの検索して取得（最大30件）
//さらに読み込みとかのボタンを押された時の機能を検討中
//渡してほしいもの：検索したい文字列（例：酒 飲みたい）（searchWord）
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
  var searchWord = req.body.searchWord;
  var skip = req.body.skip;
  var currentUserId = req.body.currentUserId;

  if(skip == ""){
    skip = 0;
  }else{
    skip = Number(skip);
  }

  //半角空白で文字列を区切る
  var searchWords = searchWord.split(/\s/);

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

  var j = 0;
  var flag = 0;

  var searchResult = [];
  var userIds = [];
  var stickIds = [];

  var resultJson = [];

  Promise.resolve()
         .then(function(){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
               stick.equalTo("stamp", true)
                    .order("updateDate", true)
                    .include("staticData")
                    .skip(skip)
                    .limit(30)
                    .fetchAll()
                    .then(function(results){
                      //res.json(results);
                      for (var len = 0; searchResult.length < 30 && len < results.length; len++){
                        var object = results[len];
                        //res.json(object);
                        //var detail = object.get("detail")
                        for(var word of searchWords){
                          if(flag == 0 && object.get("detail").includes(word)){
                            //if(flag == 0){
                              //res.json(object)
                              searchResult.push(object);
                              userIds.push(object.userId);
                              stickIds.push(object.objectId);
                              flag = 1;
                            }
                          }
                        flag = 0;
                      }
                      resolve(len);
                    })
                    .catch(function(err){
                      res.status(500)
                         .send("stick fetch error : " + err);
                    });
             }, 1);
           });
         })
         .then(function(len){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
               flag = 0;
               userDetails.in("userId", userIds)
                          .include("userData")
                          .fetchAll()
                          .then(function(userResults){
                            resolve([len, userResults]);
                          })
                          .catch(function(err){
                            res.status(500)
                               .send("userDetail fetch error : " + err);
                          });
             }, 1);
           });
         })
         .then(function(value){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
               follow.in("followedUserId", userIds)
                     .equalTo("followerId", currentUserId)
                     .fetchAll()
                     .then(function(followResults){
                       resolve([value[0], value[1], followResults]);
                     })
                     .catch(function(err){
                       res.status(500)
                          .send("follow fetch error : " + err);
                     });
             }, 1);
           });
         })
         .then(function(value){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
              var userResults = value[1];
              var followResults = value[2];
              good.equalTo("userId", currentUserId)
                  .in("stickId", stickIds)
                  .fetchAll()
                  .then(function(goodResults){
                    for(var i = 0; i < searchResult.length; i++){
                      var searchObject = searchResult[i];
                      for(var j = 0; flag == 0 && j < userResults.length; j++){
                        var userObject = userResults[j];
                        if(userObject.userId == searchObject.userId){
                          for(var k = 0; flag == 0 && k < followResults.length; k++){
                            var followObject = followResults[k];
                            if(followObject.followedUserId == searchObject.userId){
                              for(var l = 0; flag == 0 && l < goodResults.length; l++){
                                var goodObject = goodResults[l];
                                if(goodObject.stickId == searchObject.objectId){
                                  resultJson.push({stickData: searchObject, userDetailData: userObject, follow: true, good: true});
                                  flag = 1;
                                }
                              }
                              if(flag == 0){
                                resultJson.push({stickData: searchObject, userDetailData: userObject, follow: true, good: false});
                                flag = 1;
                              }
                            }
                          }
                          if(flag == 0){
                            for(var l = 0; l < goodResults.length; l++){
                              var goodObject = goodResults[l];
                              if(goodObject.stickId == searchObject.objectId && flag == 0){
                                resultJson.push({stickData: searchObject, userDetailData: userObject, follow: false, good: true});
                                flag = 1;
                              }
                            }
                            if(flag == 0){
                              resultJson.push({stickData: searchObject, userDetailData: userObject, follow: false, good: false});
                              flag = 1;
                            }
                          }
                        }
                      }
                      flag = 0;
                    }
                    res.status(200)
                       .json({result: resultJson, skip: value[0]});
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
}
