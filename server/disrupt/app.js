//injections
var express = require('express');
var https = require('https');
var morgan = require('morgan');
var nexmo = require('nexmo');
var alarm = require('alarm');
var phone = '12035338282'; //9294351864
var bodyParser = require('body-parser');
var signup = require('./user');
var dateformat = require('dateformat');
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
            user: req.body.user,
            datetime: req.body.datetime,
            datee: req.body.datee,
            friend: req.body.friend,
            count: 0,
            stop: false,
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({
                    success: false
                    , msg: 'number exist.'
                });
            }
            scheduleMessages(req.body);
            res.json({
                success: true
                , msg: 'Successful'
            });
        });
    }
});

function detailsObjectWithAddedMinutes(details, minutesToAdd) {
    // const addedMinutes = minutesToAdd * 60 * 1000;
    const addedMinutes = minutesToAdd * 1000;
    const newTime = new Date(+new Date() + addedMinutes);
    return Object.assign({}, details, {
        datetime: newTime
    });
}
app.get('/', function (req, res) {
    call('19294351864');
});
function scheduleMessages(details) {
  const {user, datetime, datee, friend} = details;
  const prettyDate = dateformat(new Date(datetime), 'm/d H:MM')
  sendtxt(`1${user}`, `Hey! We\'re all set for your date at ${prettyDate}, text STOP at any time to disable these reminders!`);
  signup.findOne({
    user,
    datetime
  }, (err, signup) => {
    console.log(signup);
  });
  alarm(new Date(datetime), function() {
    console.log(`sending message to 1${user}`);
    sendtxt(`1${user}`, `Hey! Everything ok?\n(O)K - Text again in 30!\n(S)TOP - Everything is peachy!\n(E)SCAPE - Call me!\n(H)ELP - Call my SOS!`);

    const newAlert = detailsObjectWithAddedMinutes(details, 30);
    scheduleNoResponseReceived(newAlert, datetime);
  });
}

function scheduleNoResponseReceived(details, originalDateTime) {
    const {
        user, datetime, datee, friend
    } = details;
    console.log(`Notifying again at ${datetime}`);
    console.log(originalDateTime);
    alarm(new Date(datetime), () => {
      signup.findOne({
        user,
        datetime: originalDateTime
      }, (err, signup) => {
        if (err) throw err;
        console.log(signup);
        if (!signup) {
            return assignUserNotFoundToRes(res);
        }
        else {
          console.log(signup.count);

          if (signup.stop) {
            return;
          }
          if (signup.count > 1) {
            call(signup.friend);
          } else {
            signup.count += 1;
            const count = signup.count;
            sendtxt(`1${user}`, `Checking in again, we\'ll notify your friend if we don\'t hear back in ${mapCountToMinutesRemaining(signup.count)}! Reply STOP to disable!`);

            const newAlert = detailsObjectWithAddedMinutes(details, 30);
            scheduleNoResponseReceived(newAlert, originalDateTime);

            signup.save(function (err, signup) {
                if (err) {
                    console.log(err);
                }
            });
          }
        }
      });
    });
}

function mapCountToMinutesRemaining(count) {
  return 90 - count * 30;
}

app.post('/inbound', function (req, res) {
    recietex(req.body, res);
});

function recietex(params, res) {
    if (!params.to || !params.msisdn) {
        console.log('This is not a valid inbound SMS message!');
    }
    else {
        var text = params.text;
        var sender = params.msisdn;
        if (text.toLowerCase() === 'e' || text.toLowerCase() === 'escape') {
            console.log('call');
            call(sender);
        }
        else if (text.toLowerCase() === 'h' || text.toLowerCase() === 'help') {
            console.log('help');
            //call friend
            signup.findOne({
                user: sender
            }, function (err, signup) {
                if (err) throw err;
                if (!signup) {
                    return assignUserNotFoundToRes(res);
                }
                else {
                    console.log('calling friend')
                    callfriend(signup.friend, sender);
                }
            });
        }
        else if (text.toLowerCase() === 'ok' || text.toLowerCase() === 'o') {
            console.log('ok');
            signup.findOne({
                user: sender
            }, function (err, signup) {
                if (err) throw err;
                sendtxt(`1${sender}`, `✌️`);

                if (!signup) {
                    return assignUserNotFoundToRes(res);
                }
                else {
                    signup.count = 0;
                    signup.save(function (err, signup) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
        else if (text.toLowerCase() === 's' || text.toLowerCase() === 'stop') {
            console.log('stop');
            signup.findOne({
                user: sender
            }, function (err, signup) {
                if (err) throw err;
                if (!signup) {
                    return assignUserNotFoundToRes(res);
                }
                else {
                    signup.stop = true;
                    signup.save(function (err, signup) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    };
    res.send(200);
};

function assignUserNotFoundToRes(res) {
  return res.status(403).send({
      success: false
      , msg: 'number not found.'
  });
}

app.post('/voice', function (req, res) {
    console.log(req.body);
    if (req.body.dtmf == 1) {
        signup.findOne({
            uuid: req.body.uuid
        }, function (err, signup) {
            if (err) throw err;
            if (!signup) {
                return res.status(403).send({
                    success: false
                    , msg: 'number not found.'
                });
            }
            else {
                signup.count = 0;
                signup.save(function (err, signup) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
        const ncco = [
            {
                "action": "talk"
                , "text": "Cool, Enjoy Your Date"
                , "voiceName": "Amy"
                , "bargeIn": false
  }

    ]
        res.json(ncco);
    }
    else {
        console.log('in else')
        signup.findOne({
            uuid: req.body.uuid
        }, function (err, signup) {
            if (err) throw err;
            if (!signup) {
                console.log('in sign up erro')
                return res.status(403).send({
                    success: false
                    , msg: 'number not found.'
                });
            }
            else {
                var phonefriend = signup.friend;
                console.log(phonefriend);
                const ncco = [
                    {
                        "action": "talk"
                        , "text": "Ok, Give us one seccond, we will connect you."
                        , "voiceName": "Amy"
                        , "bargeIn": false
  }

    , {
                        "action": "connect"
                        , "endpoint": [{
                            "type": "phone"
                            , "number": phonefriend
    }]
  }
]
                res.json(ncco);
            }
        });
    }
});
<<<<<<< HEAD
var callfriend = function (reciever, contact) {
    
    Nex.calls.create({
        to: [{
            type: 'phone'
            , number: reciever
  }]
        , from: {
            type: 'phone'
            , number: phone // your virtual number
        }
        , answer_url: [
            {
                "action": "talk"
                , "text": "Hi, Your friend told us to call you. he or she needs your help. We will comunicate you with her shortly."
                , "voiceName": "Amy"
                , "bargeIn": false
  }

    , {
                "action": "connect"
                , "endpoint": [{
                    "type": "phone"
                    , "number": contact
    }]
  }
]
    });
};
=======

>>>>>>> f3474bf774daec2cbae6de5f16557dd335581f37
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
        , answer_url: ['https://raw.githubusercontent.com/vorpus/escapethedate/master/ncco/convo.json']
    }, function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            updateuuid(res.uuid, reciever);
        }
    });
};
var updateuuid = function (uuid1, reciever) {
    signup.findOne({
        user: reciever
    }, function (err, signup) {
        if (err) throw err;
        if (!signup) {
            return ({
                success: false
                , msg: 'number not found.'
            });
        }
        else {
            signup.uuid = uuid1;
            signup.save(function (err, signup) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}
var sendtxt = function (reciever, message) {
    Nex.message.sendSms(phone, reciever, message);
};
app.listen('3030');
