//stampを投稿するStickを保存するためのスクリプト
//StampのStickかStampArtのStickかの判断をどうつけるか不明
/*
渡してほしいもの：userのobjectId（userId）
                添付されてるstampのfileデータのfileName（fileName）
                stickのテキストデータ（detail）
*/
//返ってくるもの：json型のデータ
function saveStampStick(req, res){
  //日付計算で使う
  var moment = require('moment');

  //リクエストボディから受け取る
  var detail = req.body.detail;
  var fileName = req.body.fileName;
  var userId = req.body.userId;

  //deleteDate作成
  var nowdate = moment();
  var deleteDate = nowdate.add(7, 'd');

  //はいはい、サブクラス
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンス生成
  var ncmb = new NCMB(applicationKey, clientKey);

  //サブクラスとインスタンス
  var Stick = ncmb.DataStore('StampStick');
  var stick = new Stick();

  stick.set("deleteDate", deleteDate)
       .set("detail", detail)
       .set("good", 0)
       .set("numberOfViews", 0)
       .set("stampName", fileName)
       .set("userId", userId)
       .save()
       .then(function(res){
         //console.log("Aman0002");
         res.status(200)
            .send("stampStick save success!");
       })
       .catch(function(err){
         res.status(500)
            .send("stampStick save error! Error : " + err);
       });

}

module.exports = saveStampStick;

//一応残しとこう
/*
  decodeStampData作成
  var decodeStampData = new Buffer(stampData, 'base64');

  ヘッダーからとる（現時点では不要、権限系のエラーが出てきたら考える）
  var userName = req.get("username");
  var password = req.get("password");

  アプリケーションキーとクライアントキーの格納
  test用
  var applicationKey = 'd91ef8d2ed3fe27ccfb5e2432de36e114ffd7e25e0e03c813be03b33df575ead';
  var clientKey = 'aa0d0bd3ed6288f250f21f5f63dc2d99d4d18f14a1c2a835271ee57a607e9708';

  権限確認＆権限系エラーの返却
    if (userName != "Yamada" || password != "1234"){
      res.status(401);
      res.send("Authentication fail!");
    }
*/
