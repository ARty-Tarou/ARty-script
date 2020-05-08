//自分のユーザーデータが変更された際に動く
/*
渡してほしいもの：userのobjectId（userId）
                userのuserName（userName）
                userのpassword（password）
                userのmailAddress（mailAddress）
*/
//返ってくるもの：メッセージ
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  var userName = req.body.userName;
  var password = req.body.password;
  var mailAddress = req.body.mailAddress;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var user = ncmb.DataStore('user');

  user.equalTo("objectId", userId)
      .fetch()
      .then(function(result){
        result.set("userName", userName)
              .set("password", password)
              .set("mailAddress", mailAddress)
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

}
