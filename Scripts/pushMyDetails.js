//個人の詳細な情報を変更するときに使用するよ。
/*
渡してほしいもの：userのobjectId（userId）
                userの誕生日（birthday）
                userのアイコンのfileデータのfileName（iconImageName）
                userの自己紹介（selfIntroduction）
*/
//返ってくるもの：メッセージ
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  //var userName = req.body.userName;
  //var birthday = req.body.birthday;
  var iconImageName = req.body.iconImageName;
  var selfIntroduction = req.body.selfIntroduction;

  //！はfalseか0かundefinedかnull
  //if(!birthday){
    //birthday = "";
  //}
  if(!iconImageName){
    iconImageName = "FirstIcon";
  }
  if(!selfIntroduction){
    selfIntroduction = "よろしくお願いします";
  }

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var UserDetails = ncmb.DataStore('UserDetails');

  var userDetails = new UserDetails();

  //{key:{__type:"Pointer",className:"対象クラス名", objectId:"対象オブジェクトID"}}

  //ncmb.User.equalTo("objectId", userId)
    //       .fetch()
      //     .then(function(result){
        //     result.set("usserName", userName)
          // })

  Promise.resolve()
         .then(function(){
           return new Promise(function(resolve, reject){
             setTimeout(function(){
               ncmb.User.equalTo("objectId", userId)
                        .fetch()
                        .then(function(result){
                          resolve(result);
                        })
                        .catch(function(err){
                          res.status(500)
                             .send("user fetch error : " + err);
                        });
             }, 1);
           });
         })
         .then(function(value){
           UserDetails.equalTo("userId", userId)
                      .fetch()
                      .then(function(result){
                          result.set("userId", userId)
                                .set("iconImageName", iconImageName)
                                .set("selfIntroduction", selfIntroduction)
                                .set("userData", value)
                                .set("numberOfFollow", result.numberOfFollow)
                                .set("numberOfFollowed", result.numberOfFollowed);
                                return result.update();
                      })
                      .then(function(result){
                        res.status(200)
                           .send("userDetails update success");
                      })
                      .catch(function(err){
                        userDetails.set("userId", userId)
                                   .set("iconImageName", iconImageName)
                                   .set("selfIntroduction", selfIntroduction)
                                   .set("userData", value)
                                   .set("numberOfFollow", 0)
                                   .set("numberOfFollowed", 0)
                                   .save()
                                   .then(function(result){
                                     res.status(200)
                                        .send("userDetail save success");
                                   })
                                   .catch(function(err){
                                     res.status(500)
                                        .send("userDetail save error : " + err);
                                   });
                      });
         })

}
