// server.js
// where your node app starts

// init project
const express = require('express');
// const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
const queue = [];

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/faliure', (request, response) => {
  response.sendFile(__dirname + '/views/faliure.html');
});

app.get('/success', (request, response) => {
  response.sendFile(__dirname + '/views/success.html');  
});
app.post('/success', (request, response) => {
  queue.push(request.body);
  response.sendFile(__dirname + '/views/success.html');
});

function sendEmail(data){
  const nodemailer = require('nodemailer')
  //for seeing the emails
  //https://ethereal.email/
  const transpoter = nodemailer.createTransport({
    service: 'SMTP',
      host: 'smtp.ethereal.email',
      port: '587',
     // secure: account.smtp.secure,
      auth: {
          user: 'luz37@ethereal.email',
          pass: 'DEQbWehc6qfPmqRXCk'
      }
  });
  let detail = {
    from: 'do_not_reply@northpole.com',
    to: 'santa@northpole.com',
    subject: 'Wishfull email for santa',
    text: `Name: ${data.name}\n Address: ${data.address}\n Wishes: ${data.wish}`
  };
  transpoter.sendMail(detail,(err, info)=>{    
    if(err){
        cconsole.log(err);
    }
  })
}

// listen for requests :)
// const listener = app.listen(process.env.PORT || 3000, function () {
//   console.log('Your app is listening on port ' + listener.address().port);
// });
app.listen(3000, () => {
  console.log('Express server started on port 3000');
});

setInterval(() => {
  if (queue.length > 0 ) {
    const request = queue.shift();
    // process request
    sendEmail(request)
  }
}, 15000);

 


