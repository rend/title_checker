import { isResSent } from 'next/dist/shared/lib/utils';

const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async (req, res) => {

  if (req.body.mode == false) {
    let fullRegister = req.body.register;
    let removePage1 = fullRegister.replace("The electronic official copy of the register follows this message.\nPlease note that this is the only official copy we will issue. We will not issue a\npaper official copy.", "");
  
    let prompt_1 = removePage1.substring(0, removePage1.indexOf("B: Proprietorship Register"));
  
    let prompt_2 = removePage1.substring(removePage1.indexOf("B: Proprietorship Register"), removePage1.indexOf("C: Charges Register"))
  
    let prompt_3 = removePage1.substring(removePage1.indexOf("C: Charges Register"), removePage1.length);
  
    let prompt = `${prompt_1}\n\nComplete all 4 of the following tasks, if there is no answer then put 'None' \n1. Extract the name of the Unicorn\n2. List the sections names\n3. What is the type of land\n4. What is the Title number\n\n1. \nNone\n2.\n- Property Register\n3.`;
  
    let prompt2 = `${prompt_2}\n\nComplete all 13 of the following tasks, if there is no answer then put 'None'  and if it's a list bullet point them\n1. Extract the name of the Unicorn\n2. List the sections names\n3. List the names of the Proprietors, not the address\n4. List all Restrictions, except Leasehold\n5. What was the full date of when the property was bought by the proprietors\n6. What is the class of title\n7. List any management companies named in the restrictions\n8. List any Housing Act 1985 Restrictions\n9. List any Proceeds of Crime Act Restrictions\n10. List any Creditor's Notices\n11. List any Bankruptcy Inhibitions\n12. List any trustees\n13. List any Cautions\n\n1. \nNone\n2.\n- Proprietorship Register\n3.`;
  
    let prompt3 = `${prompt_3}\n\nComplete all 13 of the following tasks, if there is no answer then put 'None' \n1. Extract the name of the Unicorn\n2. List the name of the register\n3. Extract the lender names and dates of any registered charges\n4. Extract the lender names and dates of rights of pre-emption\n5. List any Housing Act 1985 Charges\n6. List any Leases mentioned in the charges section\n7. List any Equitable charges\n8. List any charges that involve Legal Aid\n9. List any charges that mention 'rent charges'\n10. List any Notices of Deposit\n11. List any proprietors that include 'Shared Appreciation Mortgages'\n12. List any Unilateral Notices\n13. List any Matrimonial notices that involve a spouse\n\n1. \nNone\n2.\n- Charges Register\n3.`;
  
    const gptResponse = await openai.complete({
      engine: 'text-davinci-002',
      prompt: prompt,
      maxTokens: 640,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });
  
    setTimeout(function(){ 
      console.log("Ready")
    }, 2000);
  
    const gptResponse2 = await openai.complete({
      engine: 'text-davinci-002',
      prompt: prompt2,
      maxTokens: 640,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });
  
    const gptResponse3 = await openai.complete({
      engine: 'text-davinci-002',
      prompt: prompt3,
      maxTokens: 640,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });
  
    let result = gptResponse.data.choices[0].text;
    let tenure = "<table><tr><td style='padding:15px'><strong>Tenure</strong></td><td style='padding:15px'>";
    result = tenure.concat(result);
    result = result.replace("\n4. ", "</td></tr><tr><td style='padding:15px'><strong>Title Number</strong></td><td style='padding:15px'>");
  
    let result2 = gptResponse2.data.choices[0].text;
    let proprietors = "</td></tr><tr><td style='padding:15px'><strong>Proprietors</strong></td><td style='padding:15px'>";
    result2 = proprietors.concat(result2);
    result2 = result2.replace("\n4.\n", "</td></tr><tr><td style='padding:15px'><strong>Restrictions</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n5.\n", "</td></tr><tr><td style='padding:15px'><strong>Property Bought Date</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n6.\n", "</td></tr><tr><td style='padding:15px'><strong>Class of Title</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n7.\n", "</td></tr><tr><td style='padding:15px'><strong>Management Company Restrictions</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n8.\n", "</td></tr><tr><td style='padding:15px'><strong>Housing Act 1985 Restrictions</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n9.\n", "</td></tr><tr><td style='padding:15px'><strong>Proceeds of Crime Act Restrictions</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n10.\n", "</td></tr><tr><td style='padding:15px'><strong>Creditor's Notices</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n11.\n", "</td></tr><tr><td style='padding:15px'><strong>Bankruptcy Inhibitions</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n12.\n", "</td></tr><tr><td style='padding:15px'><strong>Trustees</strong></td><td style='padding:15px'>");
    result2 = result2.replace("\n13.\n", "</td></tr><tr><td style='padding:15px'><strong>Cautions</strong></td><td style='padding:15px'>");
    result = result.concat(result2);
  
    let result3 = gptResponse3.data.choices[0].text;
    let registeredCharges = "</td></tr><tr><td style='padding:15px'><strong>Registered Charges</strong></td><td style='padding:15px'>";
    result3 = registeredCharges.concat(result3);
    result3 = result3.replace("\n4.\n", "</td></tr><tr><td style='padding:15px'><strong>Rights of Pre-emption</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n5.\n", "</td></tr><tr><td style='padding:15px'><strong>Housing Act Charges</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n6.\n", "</td></tr><tr><td style='padding:15px'><strong>Leases</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n7.\n", "</td></tr><tr><td style='padding:15px'><strong>Equitable Charges</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n8.\n", "</td></tr><tr><td style='padding:15px'><strong>Legal Aid</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n9.\n", "</td></tr><tr><td style='padding:15px'><strong>Rent Charges</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n10.\n", "</td></tr><tr><td style='padding:15px'><strong>Notices of Deposit</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n11.\n", "</td></tr><tr><td style='padding:15px'><strong>Shared Appreciation Mortgages</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n12.\n", "</td></tr><tr><td style='padding:15px'><strong>Unilateral Notices</strong></td><td style='padding:15px'>");
    result3 = result3.replace("\n13.\n", "</td></tr><tr><td style='padding:15px'><strong>Matrimonial Notices</strong></td><td style='padding:15px'>");
    
    result = result.concat(result3);
    result = result.concat("</td></tr></table>");
  
  
    res.status(200).json({text: result});
  } else {
    // 1. Prepare the register
    let register = req.body.register;

    // remove the header from page 1.
    register = register.replace("The electronic official copy of the register follows this message.\nPlease note that this is the only official copy we will issue. We will not issue a\npaper official copy.", "");

    // remove the blurb under the title number
    let blurbToRemove = register.substring(register.indexOf("– This official copy shows the entries on the register of title on"), register.indexOf("A: Property Register"));
    register = register.replace(blurbToRemove, "");

    // remove the register descriptions
    register = register.replace("This register describes the land and estate comprised in the title.", "");
    register = register.replace("This register specifies the class of title and identifies the owner. It contains", "");
    register = register.replace("any entries that affect the right of disposal.", "");
    register = register.replace("This register contains any charges and other matters that affect the land.", "");

    // remove the end of register blurb
    blurbToRemove = register.substring(register.indexOf("End of register"), register.length);
    register = register.replace(blurbToRemove, "");

    // TODO - remove the page number bits

    // Split into the 4 respective sections
    // A: Property Register
    let property_register = register.substring(0, register.indexOf("B: Proprietorship Register"));

    // B: Proprietorship Register
    let proprietorship_register = register.substring(register.indexOf("B: Proprietorship Register"), register.indexOf("C: Charges Register"));

    // C: Charges Register
    let charges_register = "";
    let schedule_covenants = "";
    if(register.indexOf("Schedule of restrictive covenants") > 0){
      charges_register = register.substring(register.indexOf("C: Charges Register"), register.indexOf("Schedule of restrictive covenants"));
      // while we're here...
      schedule_covenants = register.substring(register.indexOf("Schedule of restrictive covenants"), register.length)
    } else {
      charges_register = register.substring(register.indexOf("C: Charges Register"), register.length);
    }

    // Title Number / Price Paid / Year Bought (if available)
    // PROMPT: "\n\nCreate a JSON object with the following keys titleNumber, pricePaidInPounds, yearPricePaid from the above text, if there is none then put 'null':\n{"
    
    let detailsPrompt = property_register.concat(proprietorship_register.concat("\n\nCreate a JSON object with the following keys titleNumber, pricePaidInPounds, yearPricePaid from the above text, if there is none then put 'null':\n{"));

    const details = await openai.complete({
      engine: 'text-davinci-002',
      prompt: detailsPrompt,
      maxTokens: 500,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });

    setTimeout(function(){ 
      console.log("Property Details Extracted...");
    }, 2000);

    console.log(details.data.choices[0].text);
    let detailsJSON = JSON.parse("{".concat(details.data.choices[0].text
      .replace(/\\n/g, "\\n")  
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
    ));

    // Get the Rights - ask this question of sections A and C and then join into one array
    // PROMPT: "Create a JSON Object that contains the following keys right (string), beneficialRight (bool), entryNo (int) with the values coming from the above text, if no value is found put 'null':\n[{"right": "the right "

    let property_registerRightsPrompt = property_register.concat("\n\nCreate a JSON Object that contains the following keys theRight (string), beneficialToPurchaserRight (bool), entryNo (int) with the values coming from each entry in the above text, if no right is found put 'null':\n[{\"theRight\": \"the right");

    const property_registerRights = await openai.complete({
      engine: 'text-davinci-002',
      prompt: property_registerRightsPrompt,
      maxTokens: 1500,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });

    setTimeout(function(){ 
      console.log("Searched Property Register for Rights...");
    }, 2000);

    console.log("[{\"theRight\": \"the right".concat(property_registerRights.data.choices[0].text));
    let property_registerRightsJSON = JSON.parse("[{\"theRight\": \"the right".concat(property_registerRights.data.choices[0].text));

    let charges_registerPrompt = charges_register.concat("\n\nCreate a JSON Object that contains the following keys theRight (string), beneficialToPurchaserRight (bool), entryNo (int) with the values coming from each entry in the above text, if no right is found put 'null':[{\"theRight\": \"the right");

    const charges_registerRights = await openai.complete({
      engine: 'text-davinci-002',
      prompt: charges_registerPrompt,
      maxTokens: 1500,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });

    setTimeout(function(){ 
      console.log("Searched Charges Register for Rights...");
    }, 2000);

    console.log("[{\"theRight\": \"the right".concat(charges_registerRights.data.choices[0].text));
    let charges_registerRightsJSON = JSON.parse("[{\"theRight\": \"the right".concat(charges_registerRights.data.choices[0].text
      .replace(/\\n/g, "\\n")  
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
    ));

    let registerRightsJSON = property_registerRightsJSON.concat(charges_registerRightsJSON);

    console.log("RIGHTS JSON:" + registerRightsJSON);

    // Get the Covenants from Section C and the Schedule of restricted covenants
    // PROMPT: "Create a JSON Object that contains the following keys restrictions (string), entryNo (int) with the values coming from the above text, if no value is found put 'null':\n[{"
   
    let charges_registerRestrictionsPrompt = charges_register.concat("\n\nCreate a JSON object that has the following keys: restrictiveCovenant (string), entryNo (int) where there are restrictive covenants, not rights, in the text, if there are none just return 'None'?\n[{\"restrictiveCovenant\":\"");

    const charges_registerRestrictions = await openai.complete({
      engine: 'text-davinci-002',
      prompt: charges_registerRestrictionsPrompt,
      maxTokens: 1500,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });

    setTimeout(function(){ 
      console.log("Searched Charges Register for Restrictions...");
    }, 2000);

    console.log(charges_registerRestrictions.data.choices[0].text);
    let chargesRegisterRestrictionsJSON = JSON.parse("[{\"restrictiveCovenant\":\"".concat(charges_registerRestrictions.data.choices[0].text));
    let schedule_covenantsRestrictionsJSON = {};

    if(schedule_covenants.length > 0){
      let schedule_covenantsRestrictionsPrompt = schedule_covenants.concat("\n\nCreate a JSON object that has the following keys: restrictiveCovenant (string), entryNo (int) where there are restrictive covenants, not rights, in the text, if there are none just return 'None'?\n[{\"restrictiveCovenant\":\"");

      const schedule_covenantsRestrictions = await openai.complete({
        engine: 'text-davinci-002',
        prompt: schedule_covenantsRestrictionsPrompt,
        maxTokens: 1500,
        temperature: 0.0,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0.0,
        bestOf: 1,
        n: 1
      });
  
      setTimeout(function(){ 
        console.log("Searched Schedule of Covenants for Restrictions...");
      }, 2000);

      console.log(schedule_covenantsRestrictions.data.choices[0].text);
      schedule_covenantsRestrictionsJSON = JSON.parse("[{\"restrictiveCovenant\":\"".concat(schedule_covenantsRestrictions.data.choices[0].text));
    }

    let registerRestrictionsJSON = chargesRegisterRestrictionsJSON;
    if(schedule_covenantsRestrictionsJSON.length > 0){
      registerRestrictionsJSON = registerRestrictionsJSON.concat(schedule_covenantsRestrictionsJSON);
    }
    
    //clean up the 'additional' text
    let additional = req.body.additional;
    let additionalPrompt = additional.concat("\n\nRewrite all of the above, keeping the spacing and new lines, by correcting all of the spelling mistakes so that it reads as proper English:\n\n")
    
    // has the property been passed out?
    // we need an address from the original title + the address in the additional text - not always possible
    // get the address from Entry A1

    // possibly need to break this down into smaller chunks?
  

    const cleanAdditional = await openai.complete({
      engine: 'text-davinci-002',
      prompt: additionalPrompt,
      maxTokens: 2040,
      temperature: 0.0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0.0,
      bestOf: 1,
      n: 1
    });

    setTimeout(function(){ 
      console.log("Cleaned up the OCR'd text...");
    }, 2000);

    additional = cleanAdditional.data.choices[0].text;
    // remove "This official copy is incomplete without the preceding notes page."
    additional = additional.replaceAll("This official copy is incomplete without the preceding notes page.", "");

    console.log(additional);

    // let's slide...
    let additionalSplit = additional.split('\n\n');
    let splitText = [];
    var runningTotal = 0;
    var currentText = "";
    for(var i = 0; i < additionalSplit.length; i++){
      if(currentText != ""){
        currentText = currentText.concat("\n\n");
      }
      currentText = currentText.concat(additionalSplit[i]);
      runningTotal += additionalSplit[i].split(' ').length;
      if(runningTotal > 300){
        splitText.push(currentText);
        runningTotal = 0;
        currentText = "";
      }
    }

    // Get the rights (anything that doesn't start with 'the right' is a covenant)
    // PROMPT: "Create a JSON Object that contains the following keys theRight (string), beneficialRight (bool), entryNo (int) with the values coming from the above text, if no value is found put 'null':\n[{"

    let additionalRightsJSON = [];

    for(var i = 0; i < splitText.length; i++) {
      console.log("SPLIT TEXT: " + splitText[i]);
      let additionalRightsPrompt = splitText[i].concat("\n\nCreate a JSON object using the above text, listing the type of right (\"type\"), the right itself (\"theRight\"), and a true/false if it benefits the purchaser or not (\"beneficialToPurchaserRight\") if any exist, otherwise just put 'None':\n[{");

      const additionalRights = await openai.complete({
        engine: 'text-davinci-002',
        prompt: additionalRightsPrompt,
        maxTokens: 750,
        temperature: 0.0,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0.0,
        bestOf: 1,
        n: 1
      });

      setTimeout(function(){ 
        console.log("Searched the additional text, sliding window: " + i.toString() + " for rights and covenants...");
      }, 2000);

      console.log(additionalRights.data.choices[0].text);
      if(additionalRights.data.choices[0].text != "\n\nNone"){
        additionalRightsJSON = additionalRightsJSON.concat(JSON.parse("[{" + additionalRights.data.choices[0].text));
      }
    }

    console.log("\n\nADDITIONAL RIGHTS FOUND: \n\n");
    console.log(additionalRightsJSON);

    // TODO loop through each right against the Searches and General Info reports e.g. mains water
    // create the response document

    let response = "<h3>The Deeds to your Property</h3>";
    response = response.concat("<br />");
    response = response.concat("<h4>1. The Property</h4>");
    response = response.concat("<br />");
    response = response.concat("<p>The Property is registered at the Land Registry under title number ");
    response = response.concat(detailsJSON.titleNumber);
    response = response.concat(" (“the Deeds”).  Only electronic copies of the Deeds are kept by the Land Registry to prove ownership.");
    if (detailsJSON.pricePaidInPounds != null){
      response = response.concat(" The current owners purchased the Property in ");
      response = response.concat(detailsJSON.yearPricePaid); 
      response = response.concat(" for ");
      response = response.concat(detailsJSON.pricePaidInPounds);
      response = response.concat(".");
    }
    response = response.concat("</p>");
    response = response.concat("<br />");
    response = response.concat("<h4>2. Identity of the Property</h4>");
    response = response.concat("<p>The extent of the Property which you are buying is shown edged red on the enclosed Land Registry plan for title number ");
    response = response.concat(detailsJSON.titleNumber);
    response = response.concat(".  Please check this plan very carefully to ensure that it correctly identifies the extent of the Property you are buying and advise me if there is any inaccuracy as soon as possible and certainly before we exchange contracts.")
    response = response.concat("</p>");
    response = response.concat("<br />");
    response = response.concat("<h4>3. Rights and Covenants</h4>");
    response = response.concat("<br />");
    response = response.concat("<br /><strong>3.1 Rights</strong><br />");
    response = response.concat("<br />");
    // TODO add in the blurb about which docs contain the rights
    let rightsJSON = registerRightsJSON.concat(additionalRightsJSON);

    // Let's remove the repeated rights!
    function getDuplicateValues(arr){
      var theRightValues = arr.map(a => a.theRight);
      var uniqueValues = theRightValues.filter((v, i) => theRightValues.indexOf(v) === i);
      var output = [];
      for (var i = 0; i < uniqueValues.length; i++){
          var count = 0;
          for (var j = 0; j < theRightValues.length; j++){
              if (uniqueValues[i] == theRightValues[j]){
                  count++;
              }
          }
          if (count > 1){
              output.push(uniqueValues[i]);
          }
      }
      return output;
    }

    let itemsToRemove = getDuplicateValues(rightsJSON);

    let finalRightsJSON = [];
    
    rightsJSON.forEach(function(obj){
      if(itemsToRemove.indexOf(obj["theRight"]) == -1) {
        finalRightsJSON.push(obj);
      }
    });


    console.log("\n\nALL THE RIGHTS CONCATENATED: \n\n");
    console.log(finalRightsJSON);

    let subjectedRightFlag = false;
    finalRightsJSON.forEach(function(right) { 
      if(right.theRight != null) {
        if(right.beneficialToPurchaserRight == true && right.theRight.toLowerCase().startsWith("the right")){
          response = response.concat("<ul>");
          response = response.concat(right.theRight.charAt(0).toUpperCase() + right.theRight.slice(1));
          response = response.concat("</ul>");
          response = response.concat("</p>");
          response = response.concat("<br />");
        }
        if(right.beneficialToPurchaserRight == false && right.theRight.toLowerCase().startsWith("the right")){
          subjectedRightFlag = true;
        }
      }
    });
    
    if(subjectedRightFlag == false){
      response = response.concat("The Property is not subject to any rights. Please let me know prior to exchange of Contracts if you believe that any third parties exercise any rights over the Property");
    } else {
      response = response.concat("The property is subjected to the following rights: <br />");
      finalRightsJSON.forEach(function(right) { 
        if(right.theRight != null) {
          if(right.beneficialToPurchaserRight == false && right.theRight.toLowerCase().startsWith("the right")){
            response = response.concat("<ul>");
            response = response.concat(right.theRight.charAt(0).toUpperCase() + right.theRight.slice(1));
            response = response.concat("</ul>");
            response = response.concat("</p>");
            response = response.concat("<br />");
          }
        }
      });
    }

    response = response.concat("<br />");
    response = response.concat("<br /><strong>3.2 Covenants</strong><br />");
    response = response.concat("<br />");
    response = response.concat("<p>");

    // TODO - where are the restrictions coming from - e.g. Entry no etc.

    registerRestrictionsJSON.forEach(function(restriction) { 
      if(restriction.restrictiveCovenant != "None"){
        response = response.concat("<ul>");
        response = response.concat(restriction.restrictiveCovenant[0].toUpperCase() + restriction.restrictiveCovenant.slice(1));
        response = response.concat("</ul>");
        response = response.concat("</p>");
        response = response.concat("<br />");
      }
    });

    additionalRightsJSON.forEach(function(restriction) { 
      if(restriction.beneficialToPurchaserRight == false && !restriction.theRight.toLowerCase().startsWith("the right")){
        response = response.concat("<ul>");
        response = response.concat(restriction.theRight[0].toUpperCase() + restriction.theRight.slice(1));
        response = response.concat("</ul>");
        response = response.concat("</p>");
        response = response.concat("<br />");
      }
    });

    response = response.concat("<p>Please read through all these clauses very carefully to ensure that you fully understand them as they are legally enforceable.  If you need clarification on any particular point, then please do not hesitate to contact me. </p>");
    response = response.concat("<br />");
    response = response.concat("<p>The issue of restrictive covenants and who can enforce them is a complicated technical area of law in itself. For example if you are purchasing a property on an estate, sometimes it may be possible for you to take action against your neighbours if they breach their own covenants (and vice versa if you breach your own) but this is not always the case and will depend on various legal factors including the way the estate was set up originally.  If you need some further guidance on this please do let me know.</p>");
    response = response.concat("<br />");

    // clean up the 'additional' text
    // let additional = req.body.additional;
    // let additionalPrompt = additional.concat("\n\nRewrite all of the above, keeping the spacing and new lines, by correcting all of the spelling mistakes so that it reads as proper English:\n\n")
    
    // const gptResponse = await openai.complete({
    //   engine: 'text-davinci-002',
    //   prompt: additionalPrompt,
    //   maxTokens: 2040,
    //   temperature: 0.0,
    //   topP: 1,
    //   presencePenalty: 0,
    //   frequencyPenalty: 0.0,
    //   bestOf: 1,
    //   n: 1
    // });

    // let cleanTextResult = gptResponse.data.choices[0].text;

    // let restrictionPrompt = cleanTextResult.concat("\n\nExtract and summarise each restriction from the above text and where there are none found put 'None':\n1.")

    // setTimeout(function(){ 
    //   console.log("Ready")
    // }, 2000);
    
    // const gptResponse2 = await openai.complete({
    //   engine: 'text-davinci-002',
    //   prompt: restrictionPrompt,
    //   maxTokens: 920,
    //   temperature: 0.0,
    //   topP: 1,
    //   presencePenalty: 0,
    //   frequencyPenalty: 0.0,
    //   bestOf: 1,
    //   n: 1
    // });

    // let restrictionTextResult = gptResponse2.data.choices[0].text;

    // let register = req.body.register;
    // let registerPrompt = register.concat("\n\nCreate a JSON object in the format of {titleNumber:'',  pricePaidString:'', yearBought: '', documentsReferredTo:[{ type: '', date:'', copyFiled: true, titleNumber: ''}]} as a JSON string:\n");
    // let registerRestrictions = register.concat("\n\nCreate a JSON object that lists any rights in the format of {right:'', entryNumber:, registerCharacter:'', rightIsBenefit:} as a JSON string:\n")

    // setTimeout(function(){ 
    //   console.log("Ready")
    // }, 2000);

    // const gptResponse3 = await openai.complete({
    //   engine: 'text-davinci-002',
    //   prompt: registerPrompt,
    //   maxTokens: 920,
    //   temperature: 0.0,
    //   topP: 1,
    //   presencePenalty: 0,
    //   frequencyPenalty: 0.0,
    //   bestOf: 1,
    //   n: 1
    // });

    // setTimeout(function(){ 
    //   console.log("Ready")
    // }, 2000);

    // const gptResponse4 = await openai.complete({
    //   engine: 'text-davinci-002',
    //   prompt: registerRestrictions,
    //   maxTokens: 920,
    //   temperature: 0.0,
    //   topP: 1,
    //   presencePenalty: 0,
    //   frequencyPenalty: 0.0,
    //   bestOf: 1,
    //   n: 1
    // });
    // console.log(gptResponse3.data.choices[0].text);
    // console.log(gptResponse4.data.choices[0].text);
    // const titleObj = JSON.parse(gptResponse3.data.choices[0].text);
    // const restrictionsObj = JSON.parse(gptResponse4.data.choices[0].text);

    // let response = "<h3>The Deeds to your Property</h3>";
    // response = response.concat("<br />");
    // response = response.concat("<h4>1. The Property</h4>");
    // response = response.concat("<br />");
    // response = response.concat("<p>The Property is registered at the Land Registry under title number ");
    // response = response.concat(titleObj.titleNumber);
    // response = response.concat(" (“the Deeds”).  Only electronic copies of the Deeds are kept by the Land Registry to prove ownership.  The current owners purchased the Property in ")
    // response = response.concat(titleObj.yearBought); 
    // response = response.concat(" for ");
    // response = response.concat(titleObj.pricePaidString);
    // response = response.concat(".</p>");
    // response = response.concat("<br />");
    // response = response.concat("<h4>2. Identity of the Property</h4>");
    // response = response.concat("<p>The extent of the Property which you are buying is shown edged red on the enclosed Land Registry plan for title number ");
    // response = response.concat(titleObj.titleNumber);
    // response = response.concat(".  Please check this plan very carefully to ensure that it correctly identifies the extent of the Property you are buying and advise me if there is any inaccuracy as soon as possible and certainly before we exchange contracts.")
    // response = response.concat("</p>");
    // response = response.concat("<br />");
    // response = response.concat("<h4>3. Rights and Covenants</h4>");
    // response = response.concat("<br />");
    // response = response.concat("<br /><strong>3.1 Rights</strong><br />");
    // response = response.concat("<br />");
    // restrictionsObj.forEach(function(obj) { 
    //   response = response.concat("<p>I refer you to Entry Number ");
    //   response = response.concat(obj.entryNumber);
    //   response = response.concat(" of the Property Register for Title Number ")
    //   response = response.concat(titleObj.titleNumber);
    //   response = response.concat(" from which you will see that the Property benefits from the following rights:");
    //   response = response.concat("<ul>");
    //   response = response.concat(obj.right);
    //   response = response.concat("</ul>");
    //   response = response.concat("</p>");
    //   response = response.concat("<br />");
    // });

    // response = response.concat("The Property is not subject to any rights. Please let me know prior to exchange of Contracts if you believe that any third parties exercise any rights over the Property");
    // response = response.concat("<br />");
    // response = response.concat("<br /><strong>3.2 Covenants</strong><br />");
    // response = response.concat("<br />");
    // response = response.concat("<p>");
    // response = response.concat(restrictionTextResult.replaceAll('\n', '<br />'));
    // response = response.concat("</p>");
    // //Extract and summarise each restriction from the above text and where there are none found put 'None':
    
    // response = response.concat("<p>Please read through all these clauses very carefully to ensure that you fully understand them as they are legally enforceable.  If you need clarification on any particular point, then please do not hesitate to contact me. </p>");
    // response = response.concat("<br />");
    // response = response.concat("<p>The issue of restrictive covenants and who can enforce them is a complicated technical area of law in itself. For example if you are purchasing a property on an estate, sometimes it may be possible for you to take action against your neighbours if they breach their own covenants (and vice versa if you breach your own) but this is not always the case and will depend on various legal factors including the way the estate was set up originally.  If you need some further guidance on this please do let me know.</p>");
    // response = response.concat("<br />");

    // response = response.concat("<h4>4. 4.	Enclosures</h4>");
    // response = response.concat("<br /><p>I enclose copies of the following documents which I refer to above.</p>")
    // response = response.concat("<ul>Official Copy Register of Title.</ul>");
    // response = response.concat("<ul>Title Plan. </ul>");
    // titleObj.documentsReferredTo.forEach(function(obj) {
    //   if(obj.copyFiled == true){
    //     response = response.concat("<ul>");
    //     response = response.concat(obj.type);
    //     response = response.concat(" dated ");
    //     response = response.concat(obj.date);
    //     response = response.concat("</ul>");
    //   }
    // });
    // response = response.concat("</p>");

    res.status(200).json({text: response});
  }
    
  
}