//お手本のファイルだよ。
//Node.jsの勉強中です。
//一般記法
/*
function 関数名(引数){
  処理の内容
}

module.exports = 関数名;
*/

//匿名記法
module.exports = function(req, res) {
  //パッケージ等の読み込みに利用する関数（require）
  var NCMB = require('ncmb');

  //アプリケーションキーとクライアントキーを設定し、対応するアプリを指定する
  var ncmb = new NCMB('YOUR_APPLICATION_KEY', 'YOUR_CLIENT_KEY');

  //ncmbパッケージのDataStore関数の呼び出し（引数：テーブル名）
  var Item = ncmb.DataStore('Item');

  //作ったインスタンスからfetchAll関数（全件取得）
  Item.fetchAll()

      //then&catch構文
      /*
        then：成功時の処理を書く
        catch：失敗時の処理を書く
      */
      .then(function(items){
        // ランダムに 1 件選択してitemに代入
        item = items[Math.floor(Math.random() * items.length)];

        //ステータスコード200とjsonにキャストしたitemを呼び出し元に返却
        res.status(200).json(item);
      })
      .catch(function(error){
        //ステータスコード500（サーバーエラー系やったかな？）と下記内容のjsonを返却
        res.status(500).json({error: 500});
      });
}
