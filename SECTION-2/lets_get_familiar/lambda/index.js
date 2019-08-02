// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var username;
var job;
var place;
var experience;

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
const UserInformationIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'UserInformationIntent';
    },
    handle(handlerInput) {
        username = handlerInput.requestEnvelope.request.intent.slots.name.value;
        job = handlerInput.requestEnvelope.request.intent.slots.profession.value;
        place = handlerInput.requestEnvelope.request.intent.slots.companyname.value;
        experience = handlerInput.requestEnvelope.request.intent.slots.experience.value;
        if(username && !job &&!place && !experience)
        {
          const speechText = "Nice meeting you "+username;
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
        }
        else if(username && job &&!place && !experience)
        {
          const speechText = "Interesting! " +username+". Hope you are doing good as a " +job+ ". Now tell me what are your interests like which sport do you like, what is your favorite color, what are your hobbies";
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ 'Tell me more about yourself!' )
            .getResponse();
        }
        else if(username && job && place && !experience)
        {
          const speechText = "Working in "+place+". Woah, Think so you are enjoying your job as " +job+ ", " +username+ "! Now tell me what are your interests like which sport do you like, what is your favorite color, what are your hobbies";
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ ' Tell me more about yourself!' )
            .getResponse();
        }
        else if(username && job && place && experience)
        {
          const speechText = "You are a "+job+" in" +place+ " and have been working for " +experience+ "years, Cool "+username+ "! Now tell me what are your interests like which sport do you like, what is your favorite color, what are your hobbies" ;
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Hai ' +username+ ' Tell me more about yourself!' )
            .getResponse();
        }
        
    }
};

const StartedUserInterestIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'UserInterestIntent'
            && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
        const currentIntent = handlerInput.requestEnvelope.request.intent;
        let sport = handlerInput.requestEnvelope.request.intent.slots.sports.value;
        let hobby = handlerInput.requestEnvelope.request.intent.slots.hobby.value;
        let color = handlerInput.requestEnvelope.request.intent.slots.color.value;
        
        return handlerInput.responseBuilder
            .addDelegateDirective(currentIntent)
            .getResponse();
        
          
    }
};

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
            .speak(`Hey ${username}, which color do you like`)
            .reprompt('Hey which color do you like')
            .addElicitSlotDirective('color')
            .getResponse();
      
          
    }
};

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
        if(!color)
        {
          color = "white";
          
        }
        const speechText = "Woah you like " +sport+ ". "+username+"! your hobbies are looking good. and I too love " +color+ ". Great! Nice to meet you " +username+ " see you later.";
       
          return handlerInput.responseBuilder
                 .speak(speechText)
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
