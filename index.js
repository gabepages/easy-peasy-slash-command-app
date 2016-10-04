/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______    ______    ______   __  __    __    ______
 /\  == \  /\  __ \  /\__  _\ /\ \/ /   /\ \  /\__  _\
 \ \  __<  \ \ \/\ \ \/_/\ \/ \ \  _"-. \ \ \ \/_/\ \/
 \ \_____\ \ \_____\   \ \_\  \ \_\ \_\ \ \_\   \ \_\
 \/_____/  \/_____/    \/_/   \/_/\/_/  \/_/    \/_/


 This is a sample Slack Button application that provides a custom
 Slash command.

 This bot demonstrates many of the core features of Botkit:

 *
 * Authenticate users with Slack using OAuth
 * Receive messages using the slash_command event
 * Reply to Slash command both publicly and privately

 # RUN THE BOT:

 Create a Slack app. Make sure to configure at least one Slash command!

 -> https://api.slack.com/applications/new

 Run your bot from the command line:

 clientId=<my client id> clientSecret=<my client secret> PORT=3000 node bot.js

 Note: you can test your oauth authentication locally, but to use Slash commands
 in Slack, the app must be hosted at a publicly reachable IP or host.


 # EXTEND THE BOT:

 Botkit is has many features for building cool and useful bots!

 Read all about it here:

 -> http://howdy.ai/botkit

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {}
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: './db_slackbutton_slash_command/',
    };
}

var controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
});


//
// BEGIN EDITING HERE!
//

controller.on('slash_command', function (slashCommand, message) {

    switch (message.command) {
        case "/cabinfo": //handle the `/echo` slash command. We might have others assigned to this app too!
            // The rules are simple: If there is no text following the command, treat it as though they had requested "help"
            // Otherwise just echo back to them what they sent us.

            // but first, let's make sure the token matches!
            if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

            // if no text was supplied, treat it as a help command
            if (message.text === "" || message.text === "help") {
                slashCommand.replyPrivate(message,
                    "I can help you learn about Cabinets.com. " +
                    "Try typing `/cabinfo address` to see.");
                return;
            }
            switch (message.text) {
              case "address":
                slashCommand.replyPrivate(message,'Recieving Info...');
                slashCommand.replyPublicDelayed(message, "The address is: 8906 Brittany Way Tampa, FL 33619");
                ;
                break;
              case "cs-number":
                slashCommand.replyPrivate(message,'Recieving Info...');
                slashCommand.replyPublicDelayed(message, "The customer service number is: 877-573-0088");
                ;
                break;
              case "ceo":
                slashCommand.replyPrivate(message,'Recieving Info...');
                slashCommand.replyPublicDelayed(message, "The CEO of Cabinets.com is Chris Larson...\n https://www.linkedin.com/in/chris-larsen-43248419?authType=name&authToken=YarC&locale=en_US&srchid=4294583491475510807984&srchindex=14&srchtotal=14&trk=vsrp_people_res_name&trkInfo=VSRPsearchId%3A4294583491475510807984%2CVSRPtargetId%3A63874406%2CVSRPcmpt%3Aprimary%2CVSRPnm%3Afalse%2CauthType%3Aname");
                ;
                break;
              case "cto":
                slashCommand.replyPrivate(message,'Recieving Info...');
                slashCommand.replyPublicDelayed(message, "The CTO of Cabinets.com is Benjamin Gordon...\n https://www.linkedin.com/in/benjamin-gordon-87481b11?authType=OPENLINK&authToken=Jniz&locale=en_US&srchid=4294583491475510862570&srchindex=6&srchtotal=14&trk=vsrp_people_res_name&trkInfo=VSRPsearchId%3A4294583491475510862570%2CVSRPtargetId%3A40849432%2CVSRPcmpt%3Aprimary%2CVSRPnm%3Afalse%2CauthType%3AOPENLINK");
                ;
                break;
              case "background":
                slashCommand.replyPrivate(message,'Recieving Info...');
                slashCommand.replyPublicDelayed(message, "Cabinets.com is one of the largest online retailers of assembled and RTA discount kitchen cabinets and a growing resource for all of your kitchen needs. Cabinets.com offers customers the unique opportunity to design their kitchen from the comfort of their home and purchase cabinets online. Kitchen design experts work one-on-one with customers to create custom solutions to their cabinet needs.\n" + "Founded: 2009\n" + "Employee Count: <50" );
                break;
              case "weather":
                slashCommand.replyPrivate(message,'Recieving Info...');

                //Recieveing Weather info
                var request = require('request');
                request('http://api.openweathermap.org/data/2.5/weather?zip=33609&APPID=3bce0babfe679d7492b4d03dbf2bfcf5&units=imperial', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      var data = JSON.parse(body);
                        slashCommand.replyPublicDelayed(message, "Weather Report at Cabinets.com: \n" + "\n" +  "Status: " + data.weather[0].description + "\n" + "Temp: " + data.main.temp + "\n" + "Cloudiness: " + data.clouds.all + "%");
                     }else{
                       slashCommand.replyPublicDelayed(message, "ERROR: " + error);
                     }
                })


                break;
              case 'should we walk?':
                var request = require('request');
                request('http://api.openweathermap.org/data/2.5/weather?zip=33609&APPID=3bce0babfe679d7492b4d03dbf2bfcf5&units=imperial', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      var data = JSON.parse(body);
                      if (data.weather.main == 'Rain'){
                        slashCommand.replyPublicDelayed(message, "NO...");
                      }else{
                        slashCommand.replyPublicDelayed(message, "Sure why not!");
                      }

                    }else{
                       slashCommand.replyPublicDelayed(message, "ERROR: " + error);
                    }
                })
                break;
              case "awesomeness level":
                slashCommand.replyPrivate(message,'Recieving Info...');
                slashCommand.replyPublicDelayed(message, "On a scale of 1-10\n" + "...10" );
                return;
                break;
              default:
                slashCommand.replyPrivate(message,
                  "I dont know that info yet. Try asking me one of the following"+
                  " `/cabinfo address`, `/cabinfo weather`, `/cabinfo should we walk?`, `/cabinfo cs-number` `/cabinfo ceo`, `/cabinfo cto`, `/cabinfo background`, `/cabinfo awesomeness level`");
                  ;
            }
            break;
        default:
            slashCommand.replyPrivate(message,'Recieving Info...');
            slashCommand.replyPublicDelayed(message, "I'm afraid I don't know how to " + message.command + " yet.");

    }

})
;
