//WorldMapを取得する
//渡してほしいもの：fileName
//返ってくるもの：json型のデータ
module.exports = function(req, res){
    //送られてきたデータを取得
    var fileName = req.body.fileName;
  
    //サブクラスの作成
    var NCMB = require('ncmb');
  
    //ARty用
    var applicationKey = 'a8b68d30b39077b903e6eb7f9496b55bc134b5b6718140d1bb3b0e1a323ec4a7';
    var clientKey = '437b274dfbd4347193a3e2e33828ca475c77e734288f2cd793da1397394b0fd6';
  
    //インスタンスの生成
    var ncmb = new NCMB(applicationKey, clientKey);
  
    ncmb.File.download(fileName)
        .then(function(fileData){

            //var encodeFileData = Buffer.from(fileData).toString('base64');

            res.status(200)
               .json({worldMap : fileData});
        })
        .catch(function(err){
            res.status(500)
               .send("error : " + err);
        });
  }
  