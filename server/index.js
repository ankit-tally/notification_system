
var admin = require("firebase-admin");
var serviceAccount = require("./notification-90bef-firebase-adminsdk-28xf6-28bd82ea4c.json");
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notification-90bef-default-rtdb.firebaseio.com"
});
var database = admin.database();

var title ="";
var body ="";
async function broadcast() {
    var tokenarray=[];
    const Tref=database.ref("/tokens")
    Tref.once("value", function(snapshot) {
    const data=snapshot.val()
    for(let i in data){
      tokenarray.push(data[i].token)
    }
    var message = {
      notification: {
        title: title,
        body: body,
        sound: 'enable',
      },
     
    };
    admin.messaging().sendToDevice(tokenarray, message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
  })
 }
 app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
 app.post('/',function(req,res){
   title = req.body.stack0;
   body = req.body.stack1;
  broadcast()
  res.redirect('C:\Users\dipes\Desktop\notification_server\public\index.html');
 
});

app.listen(port, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", port);
  }); 

//broadcast()

// var tokenarray=['ffi8daO2vmdhozFCqIAvBT:APA91bGRjEaQ9o0qmJkihQAbfJ93o388-FAafSZgDDstbAqSMtWC2ln6LU6rWnJUHCBTnwLKHX9dYAPDTuL9RkhuNyMqLb3TS20SIQh6dWVaps0FJwKvfNxb7aJA4JLm0mpcvsp5NIUA',
// 'cgh2YYtecpfkKQJ3DQSlna:APA91bETpsK-kkgnYcGXtYjll52GI5DNoE82OkgbUpaPwF6AGnC7GVDcfOQy0-jcfBFnHd1ZCg0tYqhuey1JEgAhScrbesijNf_30Y4Anxg4worejXTbGNJFL39RQ64nhykHhyXBciff',
// ' d0SdDw2jT8TTpPyo-fKn18:APA91bHYVqAKc3X2wEVL88hoCtDv69wQLvei6u0Nf1Obq3tVf2CtfNYpRd_o3UUy6YrsU1GuUromMJbO1ssns5L93DP553P4GLw3YUru2f4EJiGOPtoFX8zBEoFmJKnkNmnTXtzIBjGA'];
//     const Tref=database.ref("/tokens")
//     Tref.once("value", function(snapshot) {
//     const data=snapshot.val()
//     for(let i in data){
//       tokenarray.push(data[i].token)
//     }
//   })
//   console.log("HIII");
//   var message = {
//     notification: {
//         title: '850',
//         body: '2:45'
//     },
//     // token: registrationToken
// };

// admin.messaging().sendToDevice(tokenarray, message)
//     .then((response) => {
//         // Response is a message ID string.
//         console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//         console.log('Error sending message:', error);
//     });
// const Tref=database.ref("/tokens")
//       Tref.once("value", function(snapshot) {
//       const data=snapshot.val()
//       //  console.log(data);
//         let tokenarray=[];
//       for(let i in data){
//         tokenarray.push(data[i].token)
//       }
//       console.log(tokenarray);
//     })