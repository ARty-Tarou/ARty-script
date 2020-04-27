function saveStick(req, res){
  //日付計算で使う
  require('moment');

  //リクエストボディから受け取る
  var detail = req.body.detail;
  var stampData = req.body.stampData;
  var userId = req.body.userId;

  //decodeStampData作成
  var decodeStampData = new Buffer(stampData, 'base64');

  //deleteDate作成
  var nowdate = moment();
  var deleteDate = String(today.add(7, 'd'));

  //ヘッダーからとる（現時点では不要、権限系のエラーが出てきたら考える）
  //var userName = req.get("username");
  //var password = req.get("password");

  //はいはい、サブクラス
  var NCMB = require('ncmb');

  //アプリケーションキーとクライアントキーの格納
  //test用
  //var applicationKey = 'd91ef8d2ed3fe27ccfb5e2432de36e114ffd7e25e0e03c813be03b33df575ead';
  //var clientKey = 'aa0d0bd3ed6288f250f21f5f63dc2d99d4d18f14a1c2a835271ee57a607e9708';

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンス生成
  var ncmb = new NCMB(applicationKey, clientKey);

  //ファイルストアにイメージを保存
  var fileName = userId + deleteDate + ".png";
  ncmb.File.upload(fileName, decodeStampData)
           .then(function(res){
             ncmb.File.equalTo("fileName", fileName)
                 .fetchAll()
                 .then(function(file){
                   var stampId = file.objectId;
                 })
                 .catch(function(err){
                   res.status(500);
                   res.send("Error : " + err);
                 });
           })
           .catch(function(err){
             res.status(500);
             res.send("Error : " + err);
           })

/*権限確認＆権限系エラーの返却
  if (userName != "Yamada" || password != "1234"){
    res.status(401);
    res.send("Authentication fail!");
  }
*/

  //サブクラスとインスタンス
  var Stick = ncmb.DataStore('Stick');
  var stick = new Stick();

  //.set()：登録
  //.save()：保存
  //then&catch構文
  stick.set("deleteDate", deleteDate)
       .set("detail", detail)
       .set("numberOfViews", 0)
       .set("stampArtId", "")
       .set("stampId", stampId)
       .set("userId", userId)
       .save()
       .then(function(stick){
         res.status(200).send("success!");
       })
       .catch(function(err){
         res.status(500).send("Error: " + err);
       });

}
module.exports = saveStick;
