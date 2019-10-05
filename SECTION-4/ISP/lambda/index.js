/* eslint-disable  func-names */
/* eslint-disable  no-console */
//This is the makerdemy in-skill purchasing skill
//INFO has the information about various cryptocurrencies

const INFO = [
["BTC","Bitcoin is a digital currency created in 2009 by a mysterious figure using the alias Satoshi Nakamoto. It can be used to buy or sell items from people and companies that accept bitcoin as payment"],
["ETH","Ether is used broadly for two purposes: it is traded as a digital currency exchange like other cryptocurrencies and is used inside Ethereum to run applications and even to monetize work"],
["XRP","Ripple is a peer-to-peer powered cryptocurrency designed to work seamlessly with the Internet to allow a fast, direct and secure way to send payments on the web. "],
["BCH","Bitcoin Cash is an altcoin version of the popular Bitcoin cryptocurrency. Bitcoin Cash is the result of a hard fork in blockchain technology "],
["LTC","Litecoin is a peer-to-peer cryptocurrency. Creation and transfer of coins is based on an open source cryptographic protocol and is not managed by any central authority"],
["USDT","Tether is a blockchain-based cryptocurrency whose cryptocoins in circulation are backed by an equivalent amount of traditional fiat currencies, like the dollar, the euro or the Japanese yen, which are held in a designated bank account "],
["EOS"," EOS.IO uses blockchain architecture that is built to enable vertical and horizontal scaling of decentralized applications. The EOS token is the cryptocurrency of the EOS network."],
["BNB","Binance coin is a digital currency issued by the cryptocurrency exchange Binance. The cryptocurrency is denoted by the symbol BNB. It is based on the Ethereum blockchain and similar to Ether"],
["BSV","BSV is a cryptocurrency created as a result of Bitcoin Cash hard fork, BSV currency is now supported by major cryptocurrency exchanges."],
["XMR","XMR is an open-source cryptocurrency created in April 2014 that focuses on fungibility, privacy and decentralization."],
["ADA","Cardano is home to the Ada cryptocurrency, which can be used to send and receive digital funds. This digital cash represents the future of money, making possible fast, direct transfers that are guaranteed to be secure through the use of cryptography. "],
["XLM","The cryptocurrency, originally known as stellar, was later called Lumens or XLM works as a decentralized payment network and protocol with a native currency "],
["LEO","LEOcoin is a well-known cryptocurrency that trades using the ticker symbol LEO . It uses the Scrypt algorithm and Proof of Work for mining new coins, similar to Bitcoin mining"],
["TRX","Tron (TRX) is a blockchain platform launched as the foundation for a decentralized entertainment ecosystem"],
["HT","Huobi is a Singapore-based cryptocurrency exchange"],
];

//TIPS array will contain the premium content of giving tips related to the cryptocurrency
const TIPS = [
               "Have a motive for entering each trade",
               "Set profit targets and make use of stop losses",
               "Manage Your Risks",
               "Underlying Assets Create Volatile Market Conditions"  ,
               "Don’t Buy Simply Because the Price is Low",
               "Ethereum is one of the best coin to trade"  
            ];

//STORY array will contain the successful stories of people who made a good amount of money using cryptocurrency
const STORY = [
               "Charlie Shrem: As a college senior in 2011, Shrem started investing in bitcoin. Soon after, the bitcoin service Shrem was using crashed, and he lost his bitcoins. Shrem and Gareth Nelson, a friend he met online, had similar frustrations with the length of time it took to buy and sell bitcoin on exchange sites. They started BitInstant, a more user-friendly company that charged a fee for users to purchase and make purchases with bitcoins at over 700,000 locations, providing temporary credit to speed up transactions.",
               "Barry Silbert is the CEO and founder of the Digital Currency Group (DGC), one of the best-known companies operating in the crypto ecosystem. The company’s main mission is to help accelerate the digital currency revolution, in order to allow it to improve the current global financial system",
               "Roger Ver is renowned for his promotion of the cryptocurrency Bitcoin, and frequently goes by the moniker of “Bitcoin Jesus.” Introduced to the virtual currency in a podcast in 2011, he immediately began vociferously consuming as much information as possible on the subject.",
               "Although he is not the richest cryptocurrency holder, Finman is well-known for his small age, as he is only 19 years old. With this in mind, he began investing in bitcoin in 2011, after he received a $1,000 gift from his grandmother, back when he was 12 years old. Finman believes that investing in digital currencies represents one of the best and fastest ways for young people to raise large amounts of money."  ,
               "Yet another bitcoin millionaire known for his young age, Gardner is only 25 years old, yet holds enough coins to be referred to as a crypto millionaire. His story started back in 2013, when a friend offered to purchase Gardner bitcoin in exchange for some cash. His curiosity peaked, and he decided that he was up for the challenge. ",
               "Yet another bitcoin millionaire known for his young age, Gardner is only 25 years old, yet holds enough coins to be referred to as a crypto millionaire. His story started back in 2013, when a friend offered to purchase Gardner bitcoin in exchange for some cash. His curiosity peaked, and he decided that he was up for the challenge. "  
            ];

//To get all the products the user is entitiled to
function getAllEntitledProducts(inSkillProductList) {
  const entitledProductList = inSkillProductList.filter(record => record.entitled === 'ENTITLED');
  return entitledProductList;
}

function getSpeakableListOfProducts(entitleProductsList) {
  const productNameList = entitleProductsList.map(item => item.name);
  let productListSpeech = productNameList.join(', '); // Generate a single string with comma separated product names
  productListSpeech = productListSpeech.replace(/_([^_]*)$/, 'and $1'); // Replace last comma with an 'and '
  return productListSpeech;
}

//we use the ask-sdk standard version
const Alexa = require('ask-sdk');

//To get the market price changes of the top five cryptocurrencies
const checkmarketintenthandler = 
{
   canHandle(handlerInput) 
   {
       const request = handlerInput.requestEnvelope.request;
       return request.type === 'IntentRequest' && request.intent.name === 'checkmarketintent' ;
   },
   async handle(handlerInput) {
       const request = handlerInput.requestEnvelope.request;
       const responseBuilder = handlerInput.responseBuilder;
       const market = handlerInput.requestEnvelope.request.intent.slots.market.value;
       let say = market;

       //we call the function for checking whether there is a match from the dynamic entities
       let slotValues = getDynamicSlotValues(request.intent.slots);
       let marketid = slotValues.market.resolvedid;
       let resolvedmarket = slotValues.market.resolved;
       console.log(resolvedmarket);
       console.log(marketid);
       console.log(market);

        //No match in the dyanmic entities
       if( (slotValues.market.ERstatus === 'ER_SUCCESS_NO_MATCH') ||  (!slotValues.market.heardAs) )
       {
        say = "Please repeat for what cryptocurrency are you checking for, If not resolved ask me help";
         return responseBuilder
           .speak(say)
           .reprompt(say)
           .getResponse();
       }

       //match in the dynamic entities
       else
       {
           //make the api call to the coinmarket service
          await getRemoteData('https://api.coinmarketcap.com/v1/ticker/?limit=15')
      .then((response) => 
       {
        const data = JSON.parse(response);
        var newtest = [];
        var originaltest = [];
        var currencyname = [];
        for(var i=0;i<15;i++)
        {
           originaltest.push(parseFloat(data[i].percent_change_24h));

            //if the percent change is negative, replace "-" with " "
           if(data[i].percent_change_24h < 0) 
           {
            
             newtest.push(parseFloat(data[i].percent_change_24h.replace("-"," ")));
             currencyname.push(data[i].name);
           }

           //else just push into the data
           else
           {
             newtest.push(parseFloat(data[i].percent_change_24h));
             currencyname.push(data[i].name);
           }
           
        }

        //with the names and percent chanages, create a dictionary and store it in result
        var result = {};
        currencyname.forEach((key, i) => result[key] = newtest[i]);

        //sort the percent changes
        newtest.sort(function(a,b){return b-a});
        
        //sorting the dictionary
        var finalresult = Object.keys(result).map(function(key) {
            return [key, result[key]];
         });
         finalresult.sort(function(first, second) {
             return second[1] - first[1];
        });
        console.log(finalresult);
        for(var i2=0; i2<15;i2++)
        {
          
        }
         var value;
         var k;

          //checking the user requested crytocurrency with the top five market price changes
         for(k=0;k<15;k++)
         {
           if(resolvedmarket === finalresult[k][0])
           {
             console.log(finalresult[k][0]);
             console.log(finalresult[k][1]);
             var result1 = finalresult[k][1];
           }
         }
        
           for(k=0;k<15;k++)
           {
               //if percent change is positive value, up
               if(result1 === originaltest[k])
               {
                  value = "up";
               }
                //if the percent change is negative, then down
              else if(result1 === Math.abs(originaltest[k]))
              {
                 value = "down";
              }
           }
          
        
      
        say = `${resolvedmarket} is ${value} by ${result1}`;
        
      })
      //To catch the error
      .catch((err) => {
        
        say = err.message;
      });
    
    }
        
         return responseBuilder
           .speak(say)
           .reprompt(say)
           .getResponse();
  
   },
};

//Handles the launch request, gives different responses when the user uses the skill everytime
const LaunchRequestHandler = {
    async canHandle(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes() || {};
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
       //getting the name using the persistent attributes 
       const attributes = await attributesManager.getPersistentAttributes() || {};
       console.log(attributes);
    var speechText;
     if((Object.keys(attributes).length === 0))
    { 
       speechText = `Welcome to the Trading Helper, we help you in getting the latest information about 
    cryptocurrency. <break time="10ms"/>Before moving on,May I know your name?`;
       console.log(speechText);
       
    }
    
    //If the user uses the skill again
    else
    {
        
       
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
      
       //getting the name using the persistent attributes 
       if(attributes.count === 0)
      {
        let username = attributes.name.toString();
        await getRemoteData('https://api.coinmarketcap.com/v1/ticker/?limit=15')
        .then((response) => {
         const data = JSON.parse(response);
        console.log("The length of data is "+data.length+".");
        console.log("The intial is" + attributes.count);
        var newtest = [];
        var originaltest = [];
        var currencyname = [];
        for(var i=0;i<15;i++)
        {
           originaltest.push(parseFloat(data[i].percent_change_24h));
           if(data[i].percent_change_24h < 0) 
           {
            
             newtest.push(parseFloat(data[i].percent_change_24h.replace("-"," ")));
             currencyname.push(data[i].name);
           }
           else
           {
             newtest.push(parseFloat(data[i].percent_change_24h));
             currencyname.push(data[i].name);
           }
           
        }
        var result = {};
        currencyname.forEach((key, i) => result[key] = newtest[i]);
        newtest.sort(function(a,b){return b-a});
        console.log(newtest);
        var finalresult = Object.keys(result).map(function(key) {
            return [key, result[key]];
         });
         finalresult.sort(function(first, second) {
             return second[1] - first[1];
        });
      
        speechText = `Welcome back ${username}! Recently ${finalresult[0][0]}, ${finalresult[1][0]},
       ${finalresult[2][0]},${finalresult[3][0]},${finalresult[4][0]} have recorded the top market percent changes.
        If you want to know the clear infomation about these changes, 
        ask me "check, followed by the cryptocurrency name" `;
        
      })
      .catch((err) => {
        
        speechText = err.message;
      });

        attributes.count = 1;
        attributesManager.setPersistentAttributes(attributes);
        attributesManager.savePersistentAttributes();
         console.log("The later is" + attributes.count);
      
    
     }
     else if(attributes.count === 1)
     {
        let username = attributes.name.toString();
        var i;
        const monetisationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const locale = handlerInput.requestEnvelope.request.locale;
        const products = await monetisationService.getInSkillProducts(locale);
        console.log(products.inSkillProducts[0].name);
        console.log(products.inSkillProducts.length);
        const entitledProducts = getAllEntitledProducts(products.inSkillProducts);
        console.log(entitledProducts);
        if(entitledProducts && entitledProducts.length > 0)
        {
            speechText = `Hey ${username}, You currently own ${entitledProducts}`;
        }
      
        
        speechText = `Hey ${username}, Good to see you, you can check for the current cryptocurrency
        market price changes or ask for price and rank of various cryptocurrencies. Also we have recently 
        added Tips and successful stories packs as premium content in our skill, To hear more about premium 
        content ask me what can I buy`;
       
     }
    
   }
     let replaceEntityDirective = {
         type: 'Dialog.UpdateDynamicEntities',
         updateBehavior: 'REPLACE',
         types: [
           {
             name: 'cctype',
             values: [
               {
                 id: 'ADA',
                 name: {
                   value: 'Cardano',
                   synonyms: ['Cardano cryptocurrency', 'cardano currency']
                 }
               },
               {
                 id: 'XMR',
                 name: {
                   value: 'Monero',
                   synonyms: ['Monero', 'monero currency']
                 }
               },
               {
                 id: 'BTC',
                 name: {
                   value: 'Bitcoin',
                   synonyms: ['bitcoin', 'bitcoin currency']
                 }
               },
               {
                 id: 'ETH',
                 name: {
                   value: 'Ethereum',
                   synonyms: ['ethereum', 'ethereum currency']
                 }
               },
               {
                 id: 'XRP',
                 name: {
                   value: 'XRP',
                   synonyms: ['Ripple', 'xrp']
                 }
               },
               {
                 id: 'BNB',
                 name: {
                   value: 'Binance Coin',
                   synonyms: ['bitcoincash', 'bitcoin cash']
                 }
               },
               {
                 id: 'EOS',
                 name: {
                   value: 'EOS',
                   synonyms: ['eos', 'EOs']
                 }
               },
               {
                 id: 'BCH',
                 name: {
                   value: 'Bitcoin Cash',
                   synonyms: ['bitcoincash', 'bitcoin cash']
                 }
               },
                {
                 id: 'BSV',
                 name: {
                   value: 'Bitcoin SV',
                   synonyms: ['bitcoincash', 'bitcoin cash']
                 }
               },
               {
                 id: 'LTC',
                 name: {
                   value: 'Litecoin',
                   synonyms: ['Litecoin', 'Litecoin currency']
                 }
               },
               {
                 id: 'TRX',
                 name: {
                   value: 'TRON',
                   synonyms: ['TRON', 'Torn']
                 }
               },
               {
                 id: 'LEO',
                 name: {
                   value: 'UNUS SED LEO',
                   synonyms: ['Leo', 'sed leo']
                 }
               },
               {
                 id: 'XLM',
                 name: {
                   value: 'Stellar',
                   synonyms: ['steallr cryptocurrency', 'stellar']
                 }
               }
             ]
           }
         ]
       };



    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .addDirective(replaceEntityDirective)
      .getResponse();
  },
};


//Captures the name of the user
const capturenameintenthandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'capturenameintent';
  },
  async handle(handlerInput) {
    var name = handlerInput.requestEnvelope.request.intent.slots.name.value;
    const speechText = `Hey ${name},Cryptocurrency is a digital asset designed to work as a medium of exchange.
    Now tell me, About which cryptocurrency would you like to know the information.
    <break time="10ms"/>You can say I want to know about Bitcoin or I would like to know more about Ethereum`;
    
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
   
    if (Object.keys(attributes).length === 0) {
      attributes.name = name;
      attributes.count = 0;
      attributesManager.setPersistentAttributes(attributes);
      await attributesManager.savePersistentAttributes();
    }
   
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};


//To capture the user requested cryptocurrency
const capturecryptocurrencytypeintenthandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'capturecryptocurrencytype';
  },
  handle(handlerInput) {
    var cryptocurrency = handlerInput.requestEnvelope.request.intent.slots.cryptocurrency.value;
    var resolvedcryptocurrency = handlerInput.requestEnvelope.request.intent.slots.cryptocurrency.resolutions.
      resolutionsPerAuthority[0].values[0].value.name;
    var cryptocurrencyid = handlerInput.requestEnvelope.request.intent.slots.cryptocurrency.resolutions.
      resolutionsPerAuthority[0].values[0].value.id;
    var i;
    var speechText;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.askedaboutone = true;
    sessionAttributes.cryptocurrency = cryptocurrency;
    sessionAttributes.cryptocurrencyid = cryptocurrencyid;
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    for(i=0;i<15;i++)
    {
      if(cryptocurrencyid === INFO[i][0])
      {
        speechText = `${INFO[i][1]}  <break time="10ms"/>. 
        If you want to know the present rank of ${resolvedcryptocurrency} ask me what is the rank `;
      }
    }
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};


//Gives the price of the cryptocurrency
const priceintenthandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'priceintent';
  },
  async handle(handlerInput) {
    let outputSpeech = 'Hai';
    var i;
    if(handlerInput.requestEnvelope.request.intent.slots.price.value)
    {
       const price = handlerInput.requestEnvelope.request.intent.slots.price.value;
       var priceid = handlerInput.requestEnvelope.request.intent.slots.price.resolutions.
           resolutionsPerAuthority[0].values[0].value.id;
       await getRemoteData('https://api.coinmarketcap.com/v1/ticker/?limit=10')
      .then((response) => {
        const data = JSON.parse(response);
          for(i=0;i<10;i++)
          {
            if(priceid === data[i].symbol)
              {
              outputSpeech = `The price of ${price} is ${Math.round(data[i].price_usd)} US Dollars.
              If you want more information, ask me more information or 
              If you are done using the skill for now, tell me stop`;
              }
          }
      })
     .catch((err) => {
        outputSpeech = err.message;
      });
    }
    else
    {
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
         await getRemoteData('https://api.coinmarketcap.com/v1/ticker/?limit=10')
         .then((response) => {
         const data = JSON.parse(response);
          for(i=0;i<10;i++)
          {
            if(sessionAttributes.cryptocurrencyid === data[i].symbol)
              {
                outputSpeech = `The price of ${sessionAttributes.cryptocurrency} is ${Math.round(data[i].price_usd)} US Dollars.
                If you want more information, ask me more information or 
              If you are done using the skill for now, tell me stop  `;
              }
              }
         })
        .catch((err) => {
         outputSpeech = err.message;
      });
    }
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.toldprice = true;
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
   return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();

  },
};

//If the user asks what can the user buy, then this handler handles
const WhatCanIBuyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhatCanIBuyIntent';
  },
  async handle(handlerInput) {
        const monetisationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const locale = handlerInput.requestEnvelope.request.locale;
        const products = await monetisationService.getInSkillProducts(locale);
        console.log(products.inSkillProducts[0].name);
        console.log(products.inSkillProducts.length);
        const entitledProducts = getAllEntitledProducts(products.inSkillProducts);
        console.log(entitledProducts);
    
    const speechText = `You can buy ${products.inSkillProducts[0].name} pack to get successful stories
    about cryptocurrencies and also you can buy ${products.inSkillProducts[1].name} pack to get tips 
    about various cryptocurrencies. Now tell me what you want to buy`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

//Handles the buy requests
const BuyIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'BuyIntent';
  },
  async handle(handlerInput) {
        var i;
        const monetisationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const locale = handlerInput.requestEnvelope.request.locale;
        const products = await monetisationService.getInSkillProducts(locale);
        const entitledProducts = getAllEntitledProducts(products.inSkillProducts);
        const productname = handlerInput.requestEnvelope.request.intent.slots.ProductName.value;
        const resolvedproductname = handlerInput.requestEnvelope.request.intent.slots.ProductName.resolutions.
        resolutionsPerAuthority[0].values[0].value.name;
        console.log(resolvedproductname);
     
    if(resolvedproductname === "Story")
    {
      
    return handlerInput.responseBuilder
       .addDirective({
            type: "Connections.SendRequest",
            name: "Buy",
            payload: {
                InSkillProduct: {
                    productId: products.inSkillProducts[0].productId,
                },
            },
            token: "correlationToken"
        })
      .getResponse();
    }
    else if(resolvedproductname === "Tips")
    {
       return handlerInput.responseBuilder
       .addDirective({
            type: "Connections.SendRequest",
            name: "Buy",
            payload: {
                InSkillProduct: {
                    productId: products.inSkillProducts[1].productId,
                },
            },
            token: "correlationToken"
        })
      .getResponse();

    }

  },
};

//This handler handles the cancel requests
const CancelSubscriptionHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'cancelintent';
  },
  handle(handlerInput) {
    console.log('IN: CancelSubscriptionHandler.handle');
    const monetisationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const locale = handlerInput.requestEnvelope.request.locale;
        const products = await monetisationService.getInSkillProducts(locale);
        const entitledProducts = getAllEntitledProducts(products.inSkillProducts);
        const productname = handlerInput.requestEnvelope.request.intent.slots.ProductName.value;
        const resolvedproductname = handlerInput.requestEnvelope.request.intent.slots.ProductName.resolutions.
        resolutionsPerAuthority[0].values[0].value.name;
        console.log(resolvedproductname);
     
    if(resolvedproductname === "Story")
    {
    return handlerInput.responseBuilder
       .addDirective({
            type: "Connections.SendRequest",
            name: "Cancel",
            payload: {
                InSkillProduct: {
                    productId: products.inSkillProducts[0].productId,
                },
            },
            token: "correlationToken"
        })
      .getResponse();
    }
    else if(resolvedproductname === "Tips")
    {
       return handlerInput.responseBuilder
       .addDirective({
            type: "Connections.SendRequest",
            name: "Cancel",
            payload: {
                InSkillProduct: {
                    productId: products.inSkillProducts[1].productId,
                },
            },
            token: "correlationToken"
        })
      .getResponse();

    }
  },
};


// THIS HANDLES THE CONNECTIONS.RESPONSE EVENT AFTER A BUY or UPSELL OCCURS.
const BuyResponseHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Connections.Response' &&
      (handlerInput.requestEnvelope.request.name === 'Buy' ||
        handlerInput.requestEnvelope.request.name === 'Upsell');
  },
  async handle(handlerInput) {
    var speechText;
     console.log('IN: BuyResponseHandler.handle');
     const monetisationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();
     const locale = handlerInput.requestEnvelope.request.locale;
     const products = await monetisationService.getInSkillProducts(locale);
     const entitledProducts = getAllEntitledProducts(products.inSkillProducts);
     const productId = handlerInput.requestEnvelope.request.payload.productId;
     if(productId === products.inSkillProducts[0].productId)
     {
      speechText = "You have unlocked successful stories, Now ask tell me a successful story";
     }
     else if(productId === products.inSkillProducts[1].productId)
     {
       speechText = "You have unlocked tips pack, Now ask tell me a tip";
     }
     return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
  },
};


const NoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  async handle(handlerInput) {
    await handlerInput.attributesManager.getSessionAttributes();
    
    const speechText = `Ok! So I think I have given the rightful information till now, See you soon John. But do comeback because we have much more
    information like the top market price changes, tips and successful stories`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const TipIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TipIntent';
  },
  async handle(handlerInput) {
    await handlerInput.attributesManager.getSessionAttributes();
    var question = TIPS[Math.floor(Math.random() * TIPS.length)];
    const speechText = `Here's your tip : ${question}`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const StoryIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StoryIntent';
  },
  async handle(handlerInput) {
    await handlerInput.attributesManager.getSessionAttributes();
    var story = STORY[Math.floor(Math.random() * STORY.length)];
    const speechText = `Here's a story for you : ${story}`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};



const rankintenthandler = {
  canHandle(handlerInput) {
       return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'rankintent';
    
  },
  async handle(handlerInput) {
    var speechText = 'You can say hello to me!';
    var i;
    if(handlerInput.requestEnvelope.request.intent.slots.rank.value)
    {
       const rank = handlerInput.requestEnvelope.request.intent.slots.rank.value;
       var rankid = handlerInput.requestEnvelope.request.intent.slots.rank.resolutions.
           resolutionsPerAuthority[0].values[0].value.id;
       await getRemoteData('https://api.coinmarketcap.com/v1/ticker/?limit=10')
      .then((response) => {
        const data = JSON.parse(response);
          for(i=0;i<10;i++)
          {
            if(rankid === data[i].symbol)
              {
              speechText = `The rank of ${rank} is ${Math.round(data[i].rank)}. 
              If you want to know the price of ${rank}, ask me what is the price`;
              }
          }
      })
     .catch((err) => {
        speechText = err.message;
      });
    }
    else
    {
         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
         await getRemoteData('https://api.coinmarketcap.com/v1/ticker/?limit=10')
         .then
         ((response) => {
         const data = JSON.parse(response);
          for(i=0;i<10;i++)
          {
            if(sessionAttributes.cryptocurrencyid === data[i].symbol)
              {
                speechText = `The rank of ${sessionAttributes.cryptocurrency} is ${Math.round(data[i].rank)}.
                If you want to know the price of ${sessionAttributes.cryptocurrency}, ask me what is the price `;
              }
              }
         })
        .catch((err) => {
         speechText = err.message;
      });
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Thanks for using Trading Helper John!. Do visit us daily because we update you about the top market price changes and give you tips and many successful stories of cryptocurrency';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

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

function getDynamicSlotValues(filledSlots) {
 const slotValues = {};
 Object.keys(filledSlots).forEach((item) => {
     const name  = filledSlots[item].name;
     if (filledSlots[item] &&
         filledSlots[item].resolutions &&
         filledSlots[item].resolutions.resolutionsPerAuthority[1] &&
         filledSlots[item].resolutions.resolutionsPerAuthority[1].status &&
         filledSlots[item].resolutions.resolutionsPerAuthority[1].status.code) {
         switch (filledSlots[item].resolutions.resolutionsPerAuthority[1].status.code) {
             case 'ER_SUCCESS_MATCH':
                 slotValues[name] = {
                     heardAs: filledSlots[item].value,
                     resolved: filledSlots[item].resolutions.resolutionsPerAuthority[1].values[0].value.name,
                     resolvedid: filledSlots[item].resolutions.resolutionsPerAuthority[1].values[0].value.id,
                     ERstatus: 'ER_SUCCESS_MATCH'
                 };
                 break;
             case 'ER_SUCCESS_NO_MATCH':
                 slotValues[name] = {
                     heardAs: filledSlots[item].value,
                     resolved: '',
                     resolvedid: '',
                     ERstatus: 'ER_SUCCESS_NO_MATCH'
                 };
                 break;
             default:
                 break;
         }
     } else {
         slotValues[name] = {
             heardAs: filledSlots[item].value,
             resolved: '',
             ERstatus: ''
         };
     }
 }, this);
 return slotValues;
}


const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
  });
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    
   
    
    capturenameintenthandler,
    capturecryptocurrencytypeintenthandler,
    priceintenthandler,
    rankintenthandler,
    WhatCanIBuyIntentHandler,
    BuyIntentHandler,
    BuyResponseHandler,
    TipIntentHandler,
    StoryIntentHandler,
    NoIntentHandler,
    checkmarketintenthandler,
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('isp-ta') //The name of the database table
  .withAutoCreateTable(true) //Automatically creates the table
  .lambda();
