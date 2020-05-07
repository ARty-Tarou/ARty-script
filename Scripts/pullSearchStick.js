//searchWordをもらってStickテーブルの検索をするよ
//結果を返却するよ
module.exports = function(req, res){
  //送られてきたデータを取得
  var searchWord = req.body.searchWord;

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

  //サブクエリを格納する配列の宣言
  var subQuerys = [];

  //配列の長さ分のループを回すよ
  //正規表現で必要な文字列を作成
  //サブクエリを作成する
  for (var i = 0, i < searchWords.length; i++){

    searchWord = "/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcfa-zA-Z0-9!\"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]*[" + searchWords[i] + "][\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcfa-zA-Z0-9!\"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]*$/";

    subQuerys[i] = stick.regularExpressionTo("detail", searchWord);

  }

  stick.or(subQuerys)
       .fetchAll()
       .then(function(results){
         res.status(200)
            .json(results);
       })
       .catch(function(err){
         res.status(500)
            .send("stick fetch error : " + err);
       });

}
