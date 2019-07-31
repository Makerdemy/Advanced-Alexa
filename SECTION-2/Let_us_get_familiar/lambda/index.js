// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var username;
var job;
var place;
var experience;
var sport;
var hobby;

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
const NameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NameIntent';
    },
    handle(handlerInput) {
        username = handlerInput.requestEnvelope.request.intent.slots.name.value;
        const speechText = "Nice meeting you "+username+ "!. Can I know more about your, like what are you doing , studying or doing any job";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
    }
};
const WorkIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'WorkIntent';
    },
    handle(handlerInput) {
      if(handlerInput.requestEnvelope.request.intent.slots.job.value && !handlerInput.requestEnvelope.request.intent.slots.place.value && !handlerInput.requestEnvelope.request.intent.slots.year.value )
       {
        job = handlerInput.requestEnvelope.request.intent.slots.job.value;
        const speechText = "Great "+username+ "!. Hope you are enjoying your role as a " +job+".Tell me which sport do you like or play more";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
       }
    
     else if(handlerInput.requestEnvelope.request.intent.slots.job.value && handlerInput.requestEnvelope.request.intent.slots.place.value && !handlerInput.requestEnvelope.request.intent.slots.year.value )
     {
         job = handlerInput.requestEnvelope.request.intent.slots.job.value;
         place = handlerInput.requestEnvelope.request.intent.slots.place.value;
        const speechText = "Great "+username+ "!.Hopeyou are doing well in your "+job+" in "+place+" . which sport do you like or play more";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
         
     }
     else{
     
         job = handlerInput.requestEnvelope.request.intent.slots.job.value;
         place = handlerInput.requestEnvelope.request.intent.slots.place.value;
         experience = handlerInput.requestEnvelope.request.intent.slots.year.value;
        const speechText = "Thats so cool "+username+ "!.You are a "+job+" in "+place+" from "+experience+ " years That sounds great . which sport do you like or play more";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
         
     }
    }  
    
};
const FavoriteSportIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FavoriteSportIntent';
    },
    handle(handlerInput) {
       sport = handlerInput.requestEnvelope.request.intent.slots.sport.value;
        const speechText = "Thats on point! I too like " +sport+ " mate. Hey " +username+" ,tell me what are your hobbies";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
    }
};

const HobbyIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HobbyIntent';
    },
    handle(handlerInput) {
       hobby = handlerInput.requestEnvelope.request.intent.slots.hobby.value;
        const speechText = "Your hobbies are looking cool,Thanks " +username+ " It is nice talking with you, See you later ";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
    }
};
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
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
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
        NameIntentHandler,
        WorkIntentHandler,
        FavoriteSportIntentHandler,
        HobbyIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
