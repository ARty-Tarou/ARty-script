//自分関連のStickを検索し返すよ
//渡してほしいもの：userのobjectId（userId）
//返ってくるもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  //フォローテーブルとスティックテーブル、グッドテーブルのインスタンスの生成
  var follow = ncmb.DataStore('Follow');
  var stick = ncmb.DataStore('Stick');
  var good = ncmb.DataStore('Good');

  //フォロワーIDにカレントユーザーのIDがあるものを調べる
  var ids = follow.equalTo("followerId", userId);

  //自分がGoodしたStickのIDを検索
  var goods = good.equalTo("userId", userId);

  //サブクエリの作成を行う
  /*
    フォローしている人間のStick
    自分がGoodしたStick
    自分が投稿したStick
  */
  var subquery1 = stick.select("userId", "folowedUserId", ids);
  var subquery2 = stick.select("objectId", "stickId", goods);
  var subquery3 = stick.equalTo("userId", userId);

  //スティックテーブルからフォローしている人物のStickを検索し日付順に並び替え表示
  stick.or([subquery1, subquery2, subquery3])
       .order("createDate", true)
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
