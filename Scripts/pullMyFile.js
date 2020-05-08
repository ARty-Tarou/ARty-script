//fileのfileNameを受け取りファイルのデータを受け取るもの
//渡してほしいもの：fileのfileName（fileName）
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

  new Promise((resolve, reject) => {
    ncmb.File.download(fileName)
             .then(function(fileData){
               const encodeData = Buffer.from(fileData);
               const base64Data = encodeData.toString('base64');
               resolve(base64Data);
             })
             .catch(function(err){
               res.status(500)
                  .send("file fetch error : " + err);
             });
  }).then((base64Data) => {
    res.status(200)
       .json({data: base64Data});
  }).catch((err) => {
    res.status(500)
       .send("file encode error : " + err);
  });

/*
  ncmb.File.equalTo("fileName", fileName)
           .fetch()
           .then(function(result){
             res.status(200)
                .json(result);
           })
           .catch(function(err){
             res.status(500)
                .send("File fetch error : " + err);
           });

   let data = {data : base64Data};
   let dataJson = JSON.stringify(data);

   new Promise((resolve, reject) => {
     let jsonData = {data : base64Data};
     let dataJson = JSON.stringify(jsonData);
     resolve(dataJson);
   }).then((dataJson) => {
     res.status(200)
        .json(dataJson);
   }).catch((err) => {
     res.status(500)
        .error("file encode error : " + err);
   });

   new Promise((resolve, reject) => {
     const encodeData = Buffer.from(fileData);
     const base64Data = encodeData.toString('base64');
     resolve(base64Data);
   }).then((base64Data) => {
     //res.send(base64Data)
     return res.status(200)
               .json({data: base64Data});
   }).catch((err) => {
     res.status(500)
        .error("file encode error : " + err);
   });
*/
}
