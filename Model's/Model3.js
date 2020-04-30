//ニフクラのデータストア系のお手本だよ。

//保存の処理　例（
//いつものサブクラス作成とインスタンス生成
var GameScore = ncmb.DataStore("GameScore");
var gameScore = new GameScore();

//.set(格納したいフィールド名, 格納したい値)
gameScore.set("score", 1337)
         .set("playerName", "Taro")
         .set("cheatMode", false)
         //保存処理を行うメソッド
         .save()
         .then(function(gameScore){
          // 保存後の処理
         })
         .catch(function(err){
           // エラー処理
         });

//取得の処理　例（
//サブクラス作成
var GameScore = ncmb.DataStore("GameScore");

//.fetchAll()：全権取得するメソッド
GameScore.fetchAll()
         .then(function(results){
            //取得後の処理
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              console.log(object.score + " - " + object.get("playerName"));
            }
          })
         .catch(function(err){
            //失敗後の処理
            console.log(err);
          });

//更新の処理　例（
//次から何してるか書かんからな！！
var GameScore = ncmb.DataStore("GameScore");
var gameScore = new GameScore();

//なるほど
//以下の例では、最初の2つのsetで更新したいカラムを生成しています。
//そのうえで、更新したいカラムのsaveの成功時の処理でupdateをかけてる。
gameScore.set("score", 1337)
         .set("cheatMode", false)
         .save() // gameScoreオブジェクトを保存
         .then(function(gameScore){
           gameScore.set("cheatMode", true);
           // 保存したgameScoreオブジェクトを更新
           return gameScore.update();
         })
         .then(function(gameScore){
           // 更新後の処理
          })
         .catch(function(err){
           // エラー処理
         });

//削除の処理　例（
//.delete()：オブジェクトの作成を行うメソッド
gameScore.delete()
         .then(function(result){
           //成功した時の処理
           console.log(result); // true
          })
         .catch(function(err){
           // エラー処理
          });

//検索の処理　例（
//NCMBのインスタンスを生成
var ncmb = new NCMB(apikey, clientkey);

// プレイヤーがTaroのスコアを降順で取得
//いつものサブクラス生成
var GameScore = ncmb.DataStore("GameScore");

//.equalTo(検索したいフィールド名, 検索したい値)
//.order(並べたいフィールド名, bool値で降順、昇順指定)
//昇順の場合：order(並べたいフィールド名)
GameScore.equalTo("playerName", "Taro")
         .order("score",true)
         .fetchAll()
         .then(function(results){
            //成功した時の処理
            console.log("Successfully retrieved " + results.length + " scores.");
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              console.log(object.score + " - " + object.get("playerName"));
            }
          })
         .catch(function(err){
            //失敗した時の処理
            console.log(err);
          });

//クエリ生成の役に立つよ集
// playerName === "Taro"
equalTo("playerName", "Taro")

// playerName !== Taro
notEqualTo("playerName", "Taro")


// playerAge > 18
greaterThan("playerAge", 18)

// playerAge >= 18
greaterThanOrEqualTo("playerAge", 18)

// playerAge < 18
lessThan("playerAge", 18)

// playerAge <= 18
lessThanOrEqualTo("playerAge", 18)


// playerName === "Taro" || playerName === "Jiro" || playerName === "Saburo"
in("playerName",
["Taro", "Jiro", "Saburo"])

// playerName !== "Taro" && playerName !== "Jiro" && playerName !== "Saburo"
notIn("playerName",
["Taro", "Jiro", "Saburo"])

// score != null
exists("score")

//クエリの合成（AND合成）　例（
var GameScore = ncmb.DataStore("GameScore");

// GameScoreクラスでscoreが100以上500未満のオブジェクトを検索
//特にいうことはない。
//メソッド連結で条件をつなげるだけ
GameScore.lessThan("score", 500)
         .greaterThanOrEqualTo("score", 100)
         .fetchAll()
         .then(function(results){
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log (object.score);
            }
          })
         .catch(function(err){
            console.log(err);
          });

//クエリの合成（OR合成）　例（
var GameScore = ncmb.DataStore("GameScore");

//条件を変数に格納する
var subquery1 = GameScore.lessThan("level", 10);
var subquery2 = GameScore.greaterThanOrEqualTo("score", 500);

// GameScoreクラスでscoreが500以上か、levelが10より小さいオブジェクトを検索
//.or()：OR合成を行うメソッド。引数には先ほど作成した条件の変数を配列で渡す
GameScore.or([subquery1, subquery2])
         .fetchAll()
         .then(function(results){
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log (object.id);
            }
          })
         .catch(function(err){
            console.log(err);
          });

//サブクエリの結果を利用した検索　例1（
var City = ncmb.DataStore("City");
var Team = ncmb.DataStore("Team");

//政令指定都市を探しているサブクエリ
var bigCity = City.greaterThan("population", 1000000);

//.select()：サブクエリを活用して検索を行うメソッド
/*
  select(検索したいフィールド名,
         サブクエリで取得したカラムの使いたいフィールド名,
         利用するサブクエリの結果)
*/
Team.select("hometown", "cityname", bigCity)
         .fetchAll()
         .then(function(results){
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log (object.id);
            }
          })
         .catch(function(err){
            console.log(err);
          });

//サブクエリの結果を利用した検索　例2（
var City = ncmb.DataStore("City");
var Team = ncmb.DataStore("Team");

//政令指定都市を探すサブクエリ
var bigCity = City.greaterThan("population", 1000000);

//.inQuery()：サブクエリを検索条件に設定できる検索用メソッド
//inQuery(検索したいフィールド名, サブクエリ名)
Team.inQuery("hometown", bigCity)
         .fetchAll()
         .then(function(results){
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log (object.id);
            }
          })
         .catch(function(err){
            console.log(err);
          });
