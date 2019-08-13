// Makerdemy lets get familiar skill 
// This code sample demonstrates handling intents using Alexa Skills Kit SDK (v2).
// This is the beckend logic for lets get familiar
// Take the ask sdk core version package

const Alexa = require('ask-sdk-core');
var username;    //global variable to store the user name
var job;         //global variable to store the user's job
var place;       //global variable to store the user's work place
var experience;  //global variable to store the user's working experience

//Handler for handling the launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = "Hi there! I'm Alexa. Tell me about yourself, like What's your name?  what do you do? ";
        const repromptText = "Oh Oh! I'm Alexa. May I know your name please";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

//Handler for handling the UserInformation handler, this gives the user name and user's job information
const UserInformationIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'UserInformationIntent';
    },
    handle(handlerInput) {
        
        //store the user name using the "name" slot
        username = handlerInput.requestEnvelope.request.intent.slots.name.value;
        
         //store the user's job using the "profession" slot
        job = handlerInput.requestEnvelope.request.intent.slots.profession.value;
       
         //store the user's work place using the "companyname" slot
        place = handlerInput.requestEnvelope.request.intent.slots.companyname.value;
        
         //store the user's working experience using the "experience" slot
        experience = handlerInput.requestEnvelope.request.intent.slots.experience.value;
        
        //if only username is given
        if(username && !job &&!place && !experience)
        {
          const speechText = "Nice meeting you "+username;
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ ' Tell me more about yourself!' )
            .getResponse();
        }
        
        //if username and profession is given
        else if(username && job &&!place && !experience)
        {
          //if the user is not a student
          if(job != 'student')
          { 
             const speechText = `Interesting! ${username}. Hope you are doing good as a ${job}. 
             Now tell me what are your interests like which sport do you like, what is your favorite color,
             what are your hobbies`;
             return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
          }
          
          //if the user is a student
          else if(job == "student")
          {
              const speechText = `Make a good career ${username}, 
              Wish you have a great passion as a student in your education.
              You play sports right,so What's your favorite sport`;
             return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
          }
          
        }
        
        //if the user says his name, job, company name
        else if(username && job && place && !experience)
        {
          const speechText = `Working in ${place}. Woah,
          Think so you are enjoying your job as ${job},${username}! Now tell me what are your interests like
          which sport do you like, what is your favorite color, what are your hobbies`;
          
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
        }
        
         //if the user says his name, job, company name and experience
        else if(username && job && place && experience)
        {
          const speechText = `You are a ${job} in ${place} and have been working for ${experience} years,
          Cool ${username}! Now tell me what are your interests like which sport do you like, 
          what is your favorite color, what are your hobbies` ;
          
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
        }
        
    }
};

//Starting Dialog Mangement from Backend
//Checking whether the dialog state is not completed
//So that we can delegate dialog state 
//using addDelegateDirective
const StartedUserInterestIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'UserInterestIntent'
            && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';
    },handle(handlerInput) {
        //store the UserInterestIntent as current Intent
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        return handlerInput.responseBuilder
            .addDelegateDirective(currentIntent)
            .getResponse();
    }
};


//In the DialogState if the user gives information
//about sports,hobbies
//then we prompt for color slot from backend
//using addElicitSlotDirective
const sportshobbiesgivenInterestIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'UserInterestIntent'
            && handlerInput.requestEnvelope.request.intent.slots.sports.value
            && handlerInput.requestEnvelope.request.intent.slots.hobby.value
            && !handlerInput.requestEnvelope.request.intent.slots.color.value;
    },
    handle(handlerInput) {
            
       
          return handlerInput.responseBuilder
            .speak(`Hey ${username}, which color do you like`)//this will be the prompt for color slot
            .reprompt('Hey which color do you like')
            .addElicitSlotDirective('color') //This elicits the colot slot
            .getResponse();
    }
};




//if the dialog state is completed
//and we got all the values
//then give a final goodbye to the user
const CompletedinterestIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'UserInterestIntent'
            && handlerInput.requestEnvelope.request.dialogState === "COMPLETED";
    },
    handle(handlerInput) {
        let sport = handlerInput.requestEnvelope.request.intent.slots.sports.value;
        let hobby = handlerInput.requestEnvelope.request.intent.slots.hobby.value;
        let color = handlerInput.requestEnvelope.request.intent.slots.color.value;
        //Givivng the color slot a default value
        //this willbe used if the user doesn't give any value for color slot
        if(!color)
        {
          color = "white";
          
        }
        const speechText = `Woah you like ${sport}.${username}! your hobbies are looking good.
        and I too love ${color}. Great! Nice to meet you ${username}.See you later.`;
       
          return handlerInput.responseBuilder
                 .speak(speechText)
                 .reprompt(`You do ${hobby} and like ${color}, Nice meeting you ${username}`)
                 .getResponse();
     
    }
};

//Handler for helpIntent,if the user asks for help regarding this skill
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

//Handler for Cancel Intent or Stop Intent,if the user says exits, stop or cancel
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

//Handler for handling the Session Ended Intent, when the session ends
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will return the intent that is triggered for a utterance from the user
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        UserInformationIntentHandler,   //To get user name and job information
        StartedUserInterestIntentHandler, //To start the dialog management if anything about sports or hobbies is not given
        sportshobbiesgivenInterestIntentHandler, //To elicit for color slot
        CompletedinterestIntentHandler,  //To handle the case of dialog management is completed
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
