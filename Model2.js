//お手本のファイル2だよ。
//匿名記法
/*
module.exports = 関数名(引数){
    処理
}
*/

//一般記法
//引数のreqはリクエストが格納される。resは返す用の変数。
function saveData(req, res) {
  // POSTのデータを取得
  /*
    呼び出し側
    ncmb.Script
      // リクエストヘッダを指定
      .set({"username": "admin", "password": "123456"})
      // リクエストボディを指定
      .data({"field1": 111, "field2": 2222})
      .exec("POST", "testScript_POST.js")
      .then(function(res){
        // 実行後処理
        console.log(res);
      })
      .catch(function(err){
        // エラー処理
        console.log(err);
      });
  */
  var field1 = req.body.field1;
  var field2 = req.body.field2;

  // ヘッダーのデータを取得
  var username = req.get("username");
  var password = req.get("password");

  var NCMB = require('ncmb');
  var ncmb = new NCMB('YOUR_APPLICATION_KEY', 'YOUR_CLIENT_KEY');

  //エラー（権限系）を返す場所
  //ARtyでは全ユーザーがデータストアへの格納権限を持つ必要があるため不要かな？
  if ( username != "admin" || password != "123456" ) {
    res.status(401);
    res.send("Authentication fail!");
  }

  // データを保存する
  //データストアのインスタンスを生成
  var Item = ncmb.DataStore('Item');
  var item = new Item();

  //.set(格納したいフィールド名, 格納したい値)
  item.set("field1", field1)
      .set("field2", field2)
      .save()
      .then(function(item){
        // 成功
        res.send("POST data successfully!");
      })
      .catch(function(err){
        // 失敗
        res.status(500).send("Error: " + err);
      });
}

module.exports = saveData;
