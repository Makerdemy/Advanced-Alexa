/* eslint-disable  func-names */
/* eslint-disable  no-console */
//This is Makerdemy carry checker skill
//This code sample demonstrates handling intents using ALexa Skill Kit SDK (v2).
//This is backend logic for carry checker skill
//Take the standard ask-sdk version

const Alexa = require('ask-sdk');

//The speechprompts for different contexts 
//Built using dictionary
const DATA = {
  "office" :[
              "Did you carry your car or bike keys",
              "Did you carry your office keys",
              "Did you carry all the files and laptop",
              "Did you carry your purse",
              "Did you switch off the gas stove and all the lights"],
  
  "vacation":[
              "Did you carry your phone charger",
              "Did you carry the tickets to travel",
              "Did you take your brush",
              "Did you carry all the money required",
              "Did you swtiched off all the lights and closed the windows"
             ],

  "shopping":[
              "Did you get the list of what the things are you shopping",
              "Did you carry the required money",
              "Did you carry a bag",
              "Did you switch off all the lights",
              "Did you carry your bike or car keys"
              ]
  };
  
  
//Handler for handling the Launch Request
const LaunchRequestHandler = {
  
  async canHandle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    
    //getting persistent attributes
    const attributes = await attributesManager.getPersistentAttributes() || {};
    
    //if the user uses the skill for first time
    if((Object.keys(attributes).length === 0))
    {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    }
    
    //if the user uses the skill again
    else
    {
       let username = attributes.name.toString();
       //If already user name exists, then we will return the launch request and username
       return handlerInput.requestEnvelope.request.type === 'LaunchRequest' && username;
    }
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    let speechText = 'Hey Welcome to Carry Checker. What is your name?';
    const repromptText = 'Can you tell me your name?';
    
    //If user uses the skill for the first time
    if((Object.keys(attributes).length === 0))
    { 
       speechText = `Hey Hai! Welcome to Carry Checker.I can remember important things for you an
       also help you in checking whether you have carried all the essential things with you before
       you go to office or holiday or shopping.Now, can you tell me What is your name?`;
       console.log(speechText);
    }
    
    //If the user uses the skill again
    else
    {
       const attributesManager = handlerInput.attributesManager;
       //getting the name using the persistent attributes 
       const attributes = await attributesManager.getPersistentAttributes() || {};
       let username = attributes.name.toString();
      
      //A different reponse
       speechText = `Welcome back to carry checker ${username}, What you want to do, Tell me to remember 
       important thing or Start checking whether you have carried the essential things`;
      
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};


//Handler for capturing the user name
const UserNameHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    handlerInput.requestEnvelope.request.intent.name === "captureusername";
  },
  async handle(handlerInput) {
    const username = handlerInput.requestEnvelope.request.intent.slots.name.value;
    
    let speechText = `Nice meeting you ${username}, I want to know few things about you.
    Tell me whether you are working or not working`;
    
    const repromptText = 'Can you tell me are you working or not?';
    
    
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    
    //Getting the user name and storing it in the dynamoDB
    if (Object.keys(attributes).length === 0) {
      attributes.name = username;
      attributesManager.setPersistentAttributes(attributes);
      await attributesManager.savePersistentAttributes();
    }
   
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};


//Handler for handling the workintent to get to know whether the user is working or not
const workintentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      &&   handlerInput.requestEnvelope.request.intent.name === 'workintent';
  },
  async handle(handlerInput) {
      const attributesManager = handlerInput.attributesManager;
      const attributes = await attributesManager.getPersistentAttributes() || {};
     
    //We will ask the user about the office keys
     var speechText = `Ok! Where do you keep your office keys in the home. 
     You can say me I keep Office keys near bedroom or in the keys holders`;
   
       
    //if the user says anything about the work slot and save the information using persistent attribute
     if(handlerInput.requestEnvelope.request.intent.slots.job.value);
    {
      var work = handlerInput.requestEnvelope.request.intent.slots.work.value;
      var rwork = handlerInput.requestEnvelope.request.intent.slots.work.resolutions.
      resolutionsPerAuthority[0].values[0].value.name;
      attributes.work = work;
      attributesManager.setPersistentAttributes(attributes);
      await attributesManager.savePersistentAttributes();
      if(rwork === "not working" )
      {
        speechText = "Where do you keep your house keys, You can say I keep my house keys near the bedroom";
      }
    }
    
    //if the user says anything about the job slot and save the information using persistent attribute
    if(handlerInput.requestEnvelope.request.intent.slots.job.value)
    {
      var job = handlerInput.requestEnvelope.request.intent.slots.job.value;
      attributes.job = job;
      attributesManager.setPersistentAttributes(attributes);
      await attributesManager.savePersistentAttributes();
    }
    
    

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler for handling the officekeys intent to get to know where the user keeps his office keys
const officekeysintentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      &&   handlerInput.requestEnvelope.request.intent.name === 'officekeys';
  },
  async handle(handlerInput) {
    
     //Get the place where the user places his office keys and save the information
     const attributesManager = handlerInput.attributesManager;
     const attributes = await attributesManager.getPersistentAttributes() || {};
     var place = handlerInput.requestEnvelope.request.intent.slots.position.value;
     attributes.officekeys = place;
     attributesManager.setPersistentAttributes(attributes);
     await attributesManager.savePersistentAttributes();
    
     const speechText = `Tell me at which place, you keep your House Keys in the House.
     You can say House keys are placed near livingroom`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler for handling the Housekeys intent to get to know where the user keeps his House keys
const HousekeysintentHandler = {
  canHandle(handlerInput) {
    
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      &&   handlerInput.requestEnvelope.request.intent.name === 'Housekeys';
    
  },
  async handle(handlerInput) {
    
    //Get the place where the user places his House keys and save the information
     const attributesManager = handlerInput.attributesManager;
     const attributes = await attributesManager.getPersistentAttributes() || {};
     var houseplace = handlerInput.requestEnvelope.request.intent.slots.hposition.value;
     
     attributes.housekeys = houseplace;
     attributesManager.setPersistentAttributes(attributes);
     await attributesManager.savePersistentAttributes();
     const speechText = `Tell me where you usually keep your purse or wallet, 
     you can say I keep the purse on the table `;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler for handling the purseintent to get to know where the user keeps his Purse/wallet
const PurseIntentHandler = {
  canHandle(handlerInput) {
    
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      &&   handlerInput.requestEnvelope.request.intent.name === 'PurseIntent';
    
  },
  async handle(handlerInput) {
     //Get the place where the user places his purse and save the information
     const attributesManager = handlerInput.attributesManager;
     const attributes = await attributesManager.getPersistentAttributes() || {};
     var purseplace = handlerInput.requestEnvelope.request.intent.slots.pposition.value;
     
     attributes.purse = purseplace;
     attributesManager.setPersistentAttributes(attributes);
     await attributesManager.savePersistentAttributes();
     const speechText = `I will remember all the information you have told so far,
    You want me to remember anything else or start checking for essential things `;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler to handle the starting of the checking , and Ask the user for what context he want to get checked
const startcheckingHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'startchecking';
  },
  handle(handlerInput) {
    const speechText = 'Are you leaving to office or on a holiday or to shopping';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler to get the context and to ask the questions about that context
const contextHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'capturecontext';
  },
  handle(handlerInput) {
    //Get the context information and save it using session attributes
    const placeofgoing = handlerInput.requestEnvelope.request.intent.slots.context.value;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.placeofgoing = placeofgoing;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    
    //For office
    if(sessionAttributes.placeofgoing === "office")
    {
    var speechText = `You are leaving to ${placeofgoing} right! ${DATA.office[0]}.`;
    }
    
    //For vacation
    else if(sessionAttributes.placeofgoing === "vacation")
    {
      speechText = `Woah you are going on a ${placeofgoing}!.${DATA.vacation[0]}.`;
    }
    
    //For shopping
    else if(sessionAttributes.placeofgoing === "shopping")
    {
      speechText = `Its a good day for ${placeofgoing}!.${DATA.shopping[0]}.`;
    }
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//For handling yes and no for office context
const YesNoIntentHandler1 = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' || 
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent' )
      && sessionAttributes.placeofgoing === "office";
  },
  handle(handlerInput) {
   
      var speechText = 'good';
      //assign the 2nd question to speechText initailly
      speechText = `${DATA.office[1]}`;
      //Get the session attributes
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      
      //if the 2nd question is answered, Goto 3rd question marking 3rd question is asked
      if(sessionAttributes.ans1 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent"
      && !sessionAttributes.goto3)
      {
        speechText = `${DATA.office[2]}`;
        sessionAttributes.goto3 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //if we get NO for 2nd question
      else if(sessionAttributes.ans1 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
      && !sessionAttributes.goto3)
      {
        speechText = `Please carry it, if you required and tell me ${DATA.office[2]}`;
        sessionAttributes.goto3 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
       //if we get NO for 3rd question
      else if(sessionAttributes.goto3 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent" && 
      !sessionAttributes.goto4)
      { 
        speechText = `Please carry it, if you required and tell me ${DATA.office[3]}`;
        sessionAttributes.goto4 = true;
      }
      
        //if we get NO for 4th question
      else if(sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent" && 
      !sessionAttributes.goto5)
      {
        speechText = `carry them if you require and tell me ${DATA.office[4]}`;
        sessionAttributes.goto5 = true;
      }
      //To mark that 2nd question is answered
      else if(!sessionAttributes.ans1)
      {
        sessionAttributes.ans1 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //if the 3rd question is answered, Goto 4th question marking 4th question is asked
      else if(sessionAttributes.goto3 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" && 
      !sessionAttributes.goto4)
      { 
        speechText = `${DATA.office[3]}`;
        sessionAttributes.goto4 = true;
      }
      
      
      
      //if the 4th question is answered, Goto 5th question marking 5th question is asked
      else if(sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" && 
      !sessionAttributes.goto5)
      {
        speechText = `${DATA.office[4]}`;
        sessionAttributes.goto5 = true;
      }
      
     
      
      //If the 5th question is answered, then we have a final response
      else if(sessionAttributes.goto5 && 
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent"
      )
      {
        speechText = `You are good to go!. Have a nice day.`;
      }
      
      //If the 5th question has No as a reply, then this will be the response
      else if(sessionAttributes.goto5 && 
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
      )
      {
        speechText = `Please switch them off and You have almost all the things to go!. Have a nice day at office.`;
      }
      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};



//For handling yes and no for vacation context
const YesNoIntentHandler2 = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' || 
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent' )
      && sessionAttributes.placeofgoing === "vacation";
  },
  handle(handlerInput) {
   
      var speechText = 'good';
      //assign the 2nd question of vacation context to speechText initailly
      speechText = `${DATA.vacation[1]}`;
      
      //Get the session attributes
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      
       //if the 2nd question is answered, Goto 3rd question marking 3rd question is asked
      if(sessionAttributes.ans1 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent"
      && !sessionAttributes.goto3)
      {
        speechText = `${DATA.vacation[2]}`;
        sessionAttributes.goto3 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //if we get NO for 2nd question
      else if(sessionAttributes.ans1 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
      && !sessionAttributes.goto3)
      {
        speechText = `Please carry it, if you required and tell me ${DATA.vacation[2]}`;
        sessionAttributes.goto3 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //To mark that 2nd question is answered
      else if(!sessionAttributes.ans1)
      {
        sessionAttributes.ans1 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //if the 3rd question is answered, Goto 4th question marking 4th question is asked
      else if(sessionAttributes.goto3 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" && 
      !sessionAttributes.goto4)
      { 
        speechText = `${DATA.vacation[3]}`;
        sessionAttributes.goto4 = true;
      }
      
      //if we get NO for 3rd question
      else if(sessionAttributes.goto3 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent" && 
      !sessionAttributes.goto4)
      { 
        speechText = `Please carry it, if you required and tell me ${DATA.vacation[3]}`;
        sessionAttributes.goto4 = true;
      }
      
      //if the 4th question is answered, Goto 5th question marking 5th question is asked
      else if(sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" && 
      !sessionAttributes.goto5)
      {
        speechText = `${DATA.vacation[4]}`;
        sessionAttributes.goto5 = true;
      }
      
      //if we get NO for 4th question
      else if(sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent" && 
      !sessionAttributes.goto5)
      {
        speechText = `Carry them if you required and tell me ${DATA.vacation[4]}`;
        sessionAttributes.goto5 = true;
      }
      
      //If the 5th question is answered, then we have a final response
      else if(sessionAttributes.goto5 && 
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent"
      )
      {
        speechText = `You are all prefect and good to go!. Have a nice day.`;
      }
      
      //If the 5th question has No as a reply, then this will be the response
      else if(sessionAttributes.goto5 && 
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
      )
      {
        speechText = `Please switch them off and You have almost all the things to go!. Have a nice vacation.`;
      }
      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};


//For handling yes and no for shopping context
const YesNoIntentHandler3 = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' || 
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent' )
      && sessionAttributes.placeofgoing === "shopping";
  },
  handle(handlerInput) {
   
      var speechText = 'good';
      //assign the 2nd question of shopping context to speechText initailly
      speechText = `${DATA.shopping[1]}`;
      
       //Get the session attributes
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      
      //if the 2nd question is answered, Goto 3rd question marking 3rd question is asked
      if(sessionAttributes.ans1 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent"
      && !sessionAttributes.goto3)
      {
        speechText = `${DATA.shopping[2]}`;
        sessionAttributes.goto3 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //if we get NO for 2nd question
      else if(sessionAttributes.ans1 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
      && !sessionAttributes.goto3)
      {
        speechText = `Please carry it, if you required and tell me ${DATA.shopping[2]}`;
        sessionAttributes.goto3 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //To mark that 2nd question is answered
      else if(!sessionAttributes.ans1)
      {
        sessionAttributes.ans1 = true;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      }
      
      //if the 3rd question is answered, Goto 4th question marking 4th question is asked
      else if(sessionAttributes.goto3 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" && 
      !sessionAttributes.goto4)
      { 
        speechText = `${DATA.shopping[3]}`;
        sessionAttributes.goto4 = true;
      }
      
      //if we get NO for 3rd question
      else if(sessionAttributes.goto3 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent" && 
      !sessionAttributes.goto4)
      { 
        speechText = `Please carry it, if you required and tell me ${DATA.shopping[3]}`;
        sessionAttributes.goto4 = true;
      }
      
      //if the 4th question is answered, Goto 5th question marking 5th question is asked
      else if(sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" && 
      !sessionAttributes.goto5)
      {
        speechText = `${DATA.shopping[4]}`;
        sessionAttributes.goto5 = true;
      }
      
       //if we get NO for 4th question
      else if(sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent" && 
      !sessionAttributes.goto5)
      {
        speechText = `Please switch off them if no one stays at home and tell me ${DATA.shopping[4]}`;
        sessionAttributes.goto5 = true;
      }
      
      //if the 5th question is answered, We will have a final response
      else if(sessionAttributes.goto5 && sessionAttributes.goto4 &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.YesIntent" )
      {
        speechText = `You are good to go!. Have a nice shopping day.`;
      }
      
      //if we get NO for 5th question, We will have this has a response
      else if(sessionAttributes.goto5 && 
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.NoIntent"
      )
      {
        speechText = `Please carry them if you forget and with that You have almost all the things to go!. Have a nice shopping day.`;
      }
      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler for hadling the information asked by the user about where he placed his officekeys/ housekeys/ purse
const questionintentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'questionintent';
  },
  async handle(handlerInput) {
    
    //We will get the user requested things
    //And check in our database where he kept the particular
    var thing = handlerInput.requestEnvelope.request.intent.slots.things.resolutions.
    resolutionsPerAuthority[0].values[0].value.name;
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if(attributes.officekeys && thing === "officekeys")
    {
      if(sessionAttributes.ans1)
      {
      speechText = `You said your Office keys are in the ${attributes.officekeys}. Now tell me ${DATA.office[2]}`;
      sessionAttributes.goto3 = true;
      }
      else
      {
        speechText = `You said your Office keys are in the ${attributes.officekeys}`;
      }
    }
    else if(attributes.housekeys && thing === "housekeys")
    {
            var speechText = `You said your House keys are in the ${attributes.housekeys}`;
    }
    
    else if(attributes.purse && thing === "wallet")
    {
      if(sessionAttributes.goto3)
      {
      speechText = `You said your Purse is in the ${attributes.purse}. Now tell me ${DATA.office[4]}`;
      sessionAttributes.goto5 = true;
      }
      else
      {
        speechText = `You said your Purse is in the ${attributes.purse} `;
      }
      
    }
    

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDelegateDirective()
      .getResponse();
  },
};


//Handler for helping the user
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can get checked whether you have carried certain things before you leave';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

//Handler for handling the cancel and stop dialogs
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
  },
};

//Handler for session ended intent
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

//Handler for handling the errors
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

//Standard skill Builder
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler, //Handles the requestintent
    UserNameHandler,      //To capture user name
    workintentHandler,    //To capture whether user is working or not
    officekeysintentHandler,  //To capture where user keeps his office keys
    HousekeysintentHandler,   //To capture where user keeps his House keys
    PurseIntentHandler,       //To capture where user keeps his Purse keys
    startcheckingHandler,     //To start checking for essential things
    contextHandler,           //To capture the user requested context
    YesNoIntentHandler1,      //To handle yes or no intents for office context
    YesNoIntentHandler2,      //To handle yes or no intents for Vacation context
    YesNoIntentHandler3,      //To handle yes or no intents for Holiday context
    questionintentHandler,    //To retrieve the user requested thing
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('checker-skill') //The name of the database table
  .withAutoCreateTable(true) //Automatically creates the table
  .lambda();
