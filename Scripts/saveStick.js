module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  var detail = req.body.detail;
  var flag = req.body.flag;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  if(flag == 0){
    var stampName = req.body.stampName;

    var Stick = ncmb.DataStore('Stick');
    var stick = new Stick({detail: detail,
                           good: 0,
                           numberOfViews: 0,
                           userId: userId,
                           stamp: true
                         });
    var StampStick = ncmb.DataStore('StampStick');
    var stampStick = new StampStick({stampName: stampName});

    stick.set("staticData", stampStick);

    stick.save()
         .then(function(result){
           res.status(200)
              .send("StampStick save success");
         })
         .catch(function(err){
           res.status(500)
              .send("StampStick save error : " + err);
         });
  }else{
    //日付計算で使う
    var moment = require('moment');

    //deleteDate作成
    var nowdate = moment();
    var deleteDate = nowdate.add(7, 'd');

    var Stick = ncmb.DataStore('Stick');
    var stick = new Stick({detail: detail,
                           good: 0,
                           numberOfViews: 0,
                           userId: userId,
                           stamp: false
                         });
    var stampArtName = req.body.stampArtName;
    var stampName = req.body.stampName;
    //var 空間データ = req.body.空間データ;

    var StampArtStick = ncmb.DataStore('StampArtStick');
    var stampArtStick = new StampArtStick({stampArtName: stampArtName,
                                           stampName: stampName,
                                           deleteDate: deleteDate,
                                           /*空間データ: 空間データ*/
                                         });

    stick.set("staticData", stampArtStick);

    stick.save()
         .then(function(result){
           res.status(200)
              .send("StampArtStick save success");
         })
         .catch(function(err){
           res.stauts(500)
              .send("StampArtStick save error : " + err);
         });
  }
}
