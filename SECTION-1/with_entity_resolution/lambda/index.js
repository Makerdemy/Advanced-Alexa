// MAKERDEMY- with entity resolution skill
//Uses Entity Resolution
// This code sample demonstrates handling intents using Alexa Skills Kit SDK (v2).
// This is the beckend logic for with entity resolution skill
// Take the ask sdk core version package

const Alexa = require('ask-sdk-core');

//Handler for handling the launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome, what is your name'; //Welcome message to the user
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

//Handler for capturing the username
const captureNameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'captureusername';
    },
    handle(handlerInput) {
        const name = handlerInput.requestEnvelope.request.intent.slots.name.value; //Username is stored in the "name" constant
        const speechText = `hey hai ${name}! I can open any application for you to write or read,just ask me open word or open google docs`
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


//Intent handler for opening the respective application
const openingintentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'OpenApplicationIntent';
    },
    handle(handlerInput) {
        const filetypereq = handlerInput.requestEnvelope.request.intent.slots.file.value;
        //stores the user spoken value
        const file = handlerInput.requestEnvelope.request.intent.slots.file.value;
      
        var speechText = "Opening";
        if(file)
        {
            
              const status = handlerInput.requestEnvelope.request.intent.slots.file.resolutions.
              resolutionsPerAuthority[0].status.code;
              //stores the status value of the slot match
                  if(status === 'ER_SUCCESS_MATCH')
                   {
                    
                       const filetyperes = handlerInput.requestEnvelope.request.intent.slots.file.resolutions.
                       resolutionsPerAuthority[0].values[0].value.name;
                        //stores the resolved value 
                        speechText =  `Opening your ${filetyperes} `;
            
                     }
                     
                //If there is no match
                   else
                   {
                          speechText = 'I am not sure what that means';
                   }
            
        }
         return handlerInput.responseBuilder
            .speak(speechText)
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
        const speechText = 'You can open any editor application,you can just say open word docs or open google docs';

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
        const speechText = 'See you';
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
        LaunchRequestHandler,  //First launch request handler is registered
        captureNameIntentHandler, //Then capture user name intent handler
        openingintentHandler,  //After this, the opening application intent handler 
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
