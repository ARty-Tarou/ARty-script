//searchWordを使ってStickテーブルの検索して取得（最大30件）
//っさらに読み込みとかのボタンを押された時の機能を検討中
//渡してほしいもの：検索したい文字列（例：酒 飲みたい）（searchWord）
//返ってくるもの：json型のデータ
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

  var j = 0;
  var flag = 0;
  var searchResult = [];

  stick.order("createDate", true)
       .include("staticData")
       .fetchAll()
       .then(function(results){
         //res.json(results);
         for (var i = 0; j < 30 && i < results.length; i++){
           var object = results[i];
           //res.json(object);
           //var detail = object.get("detail")
           for(var word of searchWords){
             if(flag == 0 && object.get("detail").includes(word)){
               //if(flag == 0){
                 //res.json(object)
                 searchResult[j] = object;
                 flag = 1;
                 j = j + 1;
               }
             }
           flag = 0;
         }
         res.status(200)
            .json({result: searchResult, skip: i);
       })
       .catch(function(err){
         res.status(500)
            .send("stick fetch error : " + err);
       });
}
