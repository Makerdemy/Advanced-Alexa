// MAKERDEMY- without entity resolution skill
// This code sample demonstrates handling intents using Alexa Skills Kit SDK (v2).
// This is the beckend logic for without entity resolution skill
// Take the ask sdk core version package

const Alexa = require('ask-sdk-core');

//Handler for handling the launchrequest
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome, what is your name';
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
        const name = handlerInput.requestEnvelope.request.intent.slots.name.value;
        //Username is stored in the "name" constant
        const speechText = `hey hai ${name}! I can open any application for you to 
        write or read,just ask me open word or open google docs`
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
        const filetypereq = handlerInput.requestEnvelope.request.intent.slots.file.value;  //stores the user spoken value
        
        var speechText;
        if(filetypereq === "ms word" || filetypereq === "word" || filetypereq === "word document"
        || filetypereq === "word file" || filetypereq === "msword")
        {
            const filetyperes = "word document"; //we need to resolve to the main slot value,
            //here word document is the main slot value for all synonymns of microsoft word
            
            speechText = `Opening your ${filetyperes}`;
        }
        
        else if(filetypereq === "ppt" || filetypereq === "powerpoint" || filetypereq === "presentation" 
        || filetypereq === "slides" || filetypereq === "ms powerpoint")
        {
            const filetyperes = "ppt"; //we need to resolve to the main slot value,
            //here ppt is the main slot value for all synonymns of microsoft powerpoint
            
            speechText = `Opening your ${filetyperes}`;
        }
        
        else if(filetypereq === "google docs" || filetypereq === "doc" || filetypereq === "docs")
        {
            const filetyperes = "google doc"; //we need to resolve to the main slot value,
            //here google doc is the main slot value for all synonymns of google docs
            
            speechText = `Opening your ${filetyperes}`;
        }
        
        //else user asks to open other than these applications
        else
        {
            speechText = `Sorry I cannot open the ${filetypereq} file `;
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
        captureNameIntentHandler,
        openingintentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
