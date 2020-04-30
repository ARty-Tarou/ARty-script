module.exports = function(req, res){
  //カレントユーザーのオブジェクトID
  var userIdOrMailAddress = req.body.userIdOrMailAddress;
  var password = req.body.password;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  //正規表現によるメールアドレスの検査
  var result = userIdOrMailAddress.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);

  if(result != null){
    //渡されたものがメールアドレスだった場合
    ncmb.User.loginWithMailAddress(result[0], password)
        .then(function(data){
          res.status(200)
             .send("success!");
        })
        .catch(function(err){
          res.status(401)
             .send("Error : " + err);
        });
  }else{
    //渡されたものがユーザー名だった場合
    ncmb.User.login(userIdOrMailAddress, password)
        .then(function(data){
          res.status(200)
             .send("success!");
        })
        .catch(function(err){
          res.status(401)
             .send("Error : " + err);
        });
  }
}
