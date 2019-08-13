// Makerdemy let us get familiar skill 
// This code sample demonstrates handling intents using Alexa Skills Kit SDK (v2).
// This is the beckend logic for let us get familiar
// Take the ask sdk core version package

const Alexa = require('ask-sdk-core');
var username;   //global variable to store the user name
var job;        //global variable to store the user's job
var place;      //global variable to store the user's work place
var experience; //global variable to store the user's working experience
var sport;      //global variable to store the user's favorite sport
var hobby;      //global variable to store the user's hobbies

//Handler for handling the launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = "Hi there! I'm Alexa. What's your name? ";
        const repromptText = "Oh Oh! I'm Alexa. May I know your name please";
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

//Handler for handling the NameIntent, through which the user name is known
const NameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NameIntent';
    },
    handle(handlerInput) {
        //store the user name using the "name" slot
        username = handlerInput.requestEnvelope.request.intent.slots.name.value;
        const speechText = `Nice meeting you ${username}!. Can I know more about your, 
        like what are you doing , studying or doing any job`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me what do you do for living!' )
            .getResponse();
    }
};

//Handler for handling the WorkIntent, this gives us the user's job
const WorkIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.
        request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.
            request.intent.name === 'WorkIntent';
    },
    handle(handlerInput) {
      //if only job slot value is given by the user,this condition will be used
      if(handlerInput.requestEnvelope.request.intent.slots.job.value &&
      !handlerInput.requestEnvelope.request.intent.slots.place.value &&
      !handlerInput.requestEnvelope.request.intent.slots.year.value )
       {
        //store the user's job using the "job" slot  
        job = handlerInput.requestEnvelope.request.intent.slots.job.value;
        const speechText = `Great ${username}!. Hope you are enjoying your role as a ${job}.
        Tell me which sport do you like or play more`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me what is your favorite sport' )
            .getResponse();
       }
    
      //if job slot value and work place slot values are given by the user,this condition will be used
     else if(handlerInput.requestEnvelope.request.intent.slots.job.value && 
     handlerInput.requestEnvelope.request.intent.slots.place.value && 
     !handlerInput.requestEnvelope.request.intent.slots.year.value )
     {
         //store the user's job using the "job" slot 
         job = handlerInput.requestEnvelope.request.intent.slots.job.value;
         
         //store the user's work place using the "place" slot 
         place = handlerInput.requestEnvelope.request.intent.slots.place.value;
        const speechText = `Great ${username}!.Hopeyou are doing well in your ${job} in ${place}.
        which sport do you like or play more`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me what is your favorite sport' )
            .getResponse();
         
     }
     
     //if job slot value, work place slot,work experience values are given by the user,this condition will be used 
     else{
         //store the user's job using the "job" slot 
         job = handlerInput.requestEnvelope.request.intent.slots.job.value;
         
         //store the user's job or work place using the "place" slot 
         place = handlerInput.requestEnvelope.request.intent.slots.place.value;
         
         //store the user's exprerience in that job using the "expereience" slot 
         experience = handlerInput.requestEnvelope.request.intent.slots.year.value;
         
        const speechText = `Thats so cool ${username}!.You are a ${job} in ${place} from ${experience} years 
        That sounds great . which sport do you like or play more`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me what is your favorite sport' )
            .getResponse();
         
     }
    }  
    
};

//Handler for handling the Favoritesportshandler, this gives us the user's favorite sport
const FavoriteSportIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FavoriteSportIntent';
    },
    handle(handlerInput) {
       //store the user's favorite sport using the "sport" slot 
       sport = handlerInput.requestEnvelope.request.intent.slots.sport.value;
        const speechText = `Thats on point! I too like ${sport} mate. Hey ${username} ,
        tell me what are your hobbies`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me what are your hobbies' )
            .getResponse();
    }
};

//Handler for handling the HobbyIntentHandler, this gives us the user's hobbies
const HobbyIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HobbyIntent';
    },
    handle(handlerInput) {
       //store the user's hobbies using the "hobby" slot 
       hobby = handlerInput.requestEnvelope.request.intent.slots.hobby.value;
        const speechText = `Your hobbies are looking cool,Thanks ${username}+
        It is nice talking with you, See you later`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hey ' +username+ '.You do ' +hobby+ ' Cool!. Nice talking to you, see you' )
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
        NameIntentHandler,    //To store name
        WorkIntentHandler,    //To know and store the user's working information
        FavoriteSportIntentHandler, //To know and store the user's favorite sport
        HobbyIntentHandler,   //To know the and store the user's hobbies
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
