//個人情報を変更するときに使用するよ。
//アルゴリズム未定
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  var informs = [];
  var userInform = [];
  var informs[0] = req.body.userName;
  var informs[1] = req.body.password;
  var informs[2] = req.body.mailAddress;
  var userInform[0] = req.body.birthday;
  var userInform[1] = req.body.iconImageName;
  var userInform[2] = req.body.selfIntroduction;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);
  var user = ncmb.DataStore('user');
  var userDetails = ncmb.DataStore('UserDetails');

  user.equalTo("objectId", userId)
      .fetch()
      .then(function(result){
        result.set("userName", inform[0])
              .set("password", inform[1])
              .set("mailAddress", imform[2])
              .update()
              .then(function(res){
                res.status(200)
                   .send("user save success");
              })
              .catch(function(err){
                res.status(500)
                   .send("user save error : " + err);
              });
      })
      .catch(function(err){
        res.status(500)
           .send("user fetch error : " + err);
      });

  userDetails.equalTo("objectId", userId)
             .fetch()
             .then(function(result){
               result.set("birthDay", userInform[0])
                     .set("userImageName", userInform[1])
                     .set("selfIntroduction", userInform[2])
                     .update()
                     .then(function(res){
                       res.status(200)
                          .send("userDetail save success");
                     })
                     .catch(function(err){
                       res.status(500)
                          .send("userDetail save error : " + err);
                     });
             })
             .catch(function(err){
               res.status(500)
                  .send("userDetail fetch error : " + err);
             });

}
