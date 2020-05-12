Promise.resolve()
       .then(function(){
         return new Promise(function(resolve, reject){
           setTimeout(function(){
             resolve(value)
           }, 1000);
         });
       })
       .then(function(value){

       })


       Promise.resolve()
              .then(function(){
                return new Promise(function(resolve, reject){
                  setTimeout(function(){
                    ncmb.User.equalTo("objectId", userId)
                             .fetch()
                             .then(function(result){
                               var userData = result;
                               resolve(userData);
                             })
                             .catch(function(err){
                               res.status(500)
                               .send("userData fetch error : " + err);
                             });
                  }, 100);
                });
              })
              .then(function(userData){
                return new Promise(function(resolve, reject){
                  setTimeout(function(){
                    var UserDetails = ncmb.DataStore("UserDetails");
                    UserDetails.equalTo("userId", userId)
                               .fetch()
                               .then(function(result){
                                 var userDetails = result;
                                 resolve([userData, userDetails]);
                               })
                               .catch(function(result){
                                 res.status(500)
                                    .send("userDetails fetch error : " + err);
                               });
                  }, 100);
                });
              })
              .then(function(value){
                return new Promise(function(resolve, reject){
                  resolve();
                  });
                  });
