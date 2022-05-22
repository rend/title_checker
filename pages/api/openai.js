const OpenAI = require('openai-api');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async (req, res) => {
    
  let fullBody = req.body.name;
  let removePage1 = fullBody.replace("The electronic official copy of the register follows this message.\nPlease note that this is the only official copy we will issue. We will not issue a\npaper official copy.", "");

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
}