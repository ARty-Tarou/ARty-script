/*
    一旦、中止
*/
//検索結果を返すよ。
//searchWordをもらってStickテーブルの
//いろんなフィールドを検索したいと思っています
module.exports = function(req, res){
  //送られてきたデータを取得
  var searchWord = req.body.searchWord;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  var Stick = ncmb.DataStore('Stick');
  var User = ncmb.DataStore('user');

  var userNameResult = User.equalTo("userName", searchWord);
  var userQuery = Stick.select("userId", "objectId", userNameResult);

  //正規表現を用いて部分検索を行うメソッド
  //regularExpressionTo("フィールド名", "String:検索に使う正規表現")
  var detailQuery = Stick.regularExpressionTo("")


}
