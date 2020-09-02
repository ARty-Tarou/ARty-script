//Stickを投稿した時に動くスクリプト
/*
  渡してほしいもの：userのobjectId（userId）
  　　　　　　　　　userのuserName（userName）
                  stickのテキストデータ（detail）
                  stampかstampArtの判定に使う（detail）
*/
//返すもの：json型のデータ
module.exports = function(req, res){
  //送られてきたデータを取得
  var userId = req.body.userId;
  //var userName = req.body.userName;
  var detail = req.body.detail;
  var flag = req.body.flag;
  var fileName = req.body.fileName;

  //サブクラスの作成
  var NCMB = require('ncmb');

  //ARty用
  var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
  var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';

  //インスタンスの生成
  var ncmb = new NCMB(applicationKey, clientKey);

  if(flag == 0){
    var fileName = "s." + req.body.fileName;

    var Stick = ncmb.DataStore('Stick');
    var stick = new Stick({detail: detail,
                           good: 0,
                           numberOfViews: 0,
                           userId: userId,
                           stamp: true
                         });
    var StampStick = ncmb.DataStore('StampStick');
    var stampStick = new StampStick({fileName: fileName});

    /*
    var relation = new ncmb.Relation();
    relation.add(stampStick)
    .add(value[0])
    .add(value[1]);

    stick.set("data", relation);

    stick.set("userData", value[0]);
    stick.set("userDetails", value[1]);
    */

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
      //stampArt用
      var stampImageName = req.body.stampImageName;
      var stampImageNumber = req.body.stampImageNumber;
      var anchorName = req.body.anchorName;
      var stampNumber = req.body.stampNumber;
      var heightSize = req.body.heightSize;
      var widthSize = req.body.widthSize;

      var setStampData = [];
      var stampImageData = [];

      for(var i = 0; i < stampImageName.length; i++){
        stampImageData.push({
                              "stampImageName": stampImageName[i], 
                              "stampImageNumber": stampImageNumber[i]
                            });
      }

      for(var i = 0; i < anchorName.length; i++){
        setStampData.push({
                            "anchorName": anchorName[i], 
                            "stampNumber": stampNumber[i], 
                            "height": heightSize[i], 
                            "width": widthSize[i]
                          });
      }

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
      var fileName = "i." + req.body.fileName;
      var worldMap = "a." + req.body.fileName;

      var StampArtStick = ncmb.DataStore('StampArtStick');
      var stampArtStick = new StampArtStick({fileName: fileName,
                                             worldMap: worldMap,
                                             deleteDate: deleteDate,
                                             setStampData: setStampData, 
                                             stampImageData: stampImageData
                                             /*空間データ: 空間データ*/
                                           });

      /*
      var relation = new ncmb.Relation();
      relation.add(stampStick)
      .add(value[0])
      .add(value[1]);

      stick.set("data", relation);

      stick.set("userData", value[0]);
      stick.set("userDetails", value[1]);
      */

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
