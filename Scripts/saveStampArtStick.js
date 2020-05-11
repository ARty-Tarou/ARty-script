//stampArtを投稿するStickを保存するためのスクリプト
//StampのStickかStampArtのStickかの判断をどうつけるか不明
/*
渡してほしいもの：userのobjectId（userId）
                添付されてるstampのfileデータのfileName（fileName）
                stickのテキストデータ（detail）
*/
//返ってくるもの：json型のデータ
function saveStampArtStick(req, res){
  //日付計算で使う
  var moment = require('moment');

  //リクエストボディから受け取る
  var detail = req.body.detail;
  var stampName = req.body.stampName;
  var stampArtName = req.body.stampArtName;
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
  var Stick = ncmb.DataStore('StampArtStick');
  var stick = new Stick();

  stick.set("deleteDate", deleteDate)
       .set("detail", detail)
       .set("good", 0)
       .set("numberOfViews", 0)
       .set("stampArtName", stampArtName)
       .set("stampName", stampName)
       .set("userId", userId)
       .save()
       .then(function(res){
         //console.log("Aman0002");
         res.status(200)
            .send("stampArtStick save success!");
       })
       .catch(function(err){
         res.status(500)
            .send("stampArtStick save error! Error : " + err);
       });

}

module.exports = saveStampArtStick;
