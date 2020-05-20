//自分がいいねしたStickを検索して返そうと思ってるもの
//渡してほしいもの：userのobjectId（userId）
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
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

  //GoodしたスティックのIDをユーザーIDを用いて検索
  var goods = good.equalTo("userId", userId);

  var stickResult = [];

  //Stickを検索
  stick.select("objectId", "stickId", goods)
       .include("staticData")
       .order("createDate", true)
       .skip(skip)
       .fetchAll()
       .then(function(results){
         for(var i = 0; i < 30 && i < results.length; i++){
           stickResult.push(results[i]);
         }
         res.status(200)
            .json({stickData: stickResult, skip: i});
       })
       .catch(function(err){
         res.status(500)
            .send("stick fetch error : " + err);
       });
}
