//injections
var express = require('express');

var https = require('https');
var morgan = require('morgan');
var nexmo = require('nexmo');
var phone = '12035338282';
var bodyParser = require('body-parser');
var signup=require('./user');
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//mongo injection and connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/disrupt');
//nexmo configuration
var message = 'is everything ok?';
var privateKeyFile = './private.key';
//logger console
app.use(morgan('dev'));

//middleware cors
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//sms setup
const privateKey = require('fs').readFileSync(privateKeyFile);
var Nex = new nexmo({
    apiKey: 'cac81ed1'
    , apiSecret: '821df368c33cd7ea'
    , applicationId: 'b34e0aba-be11-4155-8e5b-9c80ff977ee6'
    , privateKey: privateKey
});
//alarm
app.post('/inbound', function (req, res) {
    recietex(req.body, res);
});
var apiRoutes = express.Router();
app.use('/api', apiRoutes);

apiRoutes.post('/signup', function (req, res) {
    console.log(req.body.user)
     if (!req.body.user) {
        res.json({
            success: false
            , msg: 'Please pass user fields'
        });
    }
    else {
        var newUser = new signup({
            user: req.body.user
            , datetime: req.body.datetime
            , datee: req.body.datee
            , friend: req.body.friend
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({
                    success: false
                    , msg: 'number exist.'
                });
            }
            res.json({
                success: true
                , msg: 'Successful'
            });
        });
    }
});
    
    

function recietex(params, res) {
    if (!params.to || !params.msisdn) {
        console.log('This is not a valid inbound SMS message!');
    }
    else {
        console.log('Success');
        console.log(params.text);
    }
    res.status(200).end();
};
app.get('/', function (req, res) {
    sendtxt('19294351864', 'hi');
});
var call = function (reciever) {
    Nex.calls.create({
        to: [{
            type: 'phone'
            , number: reciever
  }]
        , from: {
            type: 'phone'
            , number: phone // your virtual number
        }
        , answer_url: ['https://nexmo-community.github.io/ncco-examples/first_call_talk.json']
    }, function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(res);
        }
    });
};
var sendtxt = function (reciever, message) {
    Nex.message.sendSms(phone, reciever, message);
};
app.listen('3030');