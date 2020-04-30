module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  var informs = [];
  var informs[0] = req.body.userName;
  var informs[1] = req.body.password;
  var informs[2] = req.body.mailAddress;
  var informs[3] = req.body.birthday;
  var informs[4] = req.body.iconImageId;
  var informs[5] = req.body.selfIntroduction;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

}
