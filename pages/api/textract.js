import  { TextractClient, StartDocumentTextDetectionCommand, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand, GetDocumentTextDetectionCommand, DocumentMetadata } from "@aws-sdk/client-textract";
import { isNull, forEach } from "lodash";


export default async (req, res) => {

  let { name } = req.body;

  const client = new TextractClient(
    {   region: "eu-west-2",
        credentials: {
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID
        } 
    }
  );

  const params = {
      DocumentLocation: {
          S3Object: {
              Bucket: "novex-documents",
              Name: name
          }
      }
  };

  console.log(params);

  const request = client.send(new StartDocumentTextDetectionCommand(params), 
  async (err, data) => {
      if (err) {
          console.log("error:" + err.message);
      }
      if (data) {
          console.log(data.JobId);
          const result = await getAllJobs(data.JobId);
          res.status(200).json({ textract: result });
      }
  });
}

async function getJobsFromTextract (JobId, NextToken) {
  const textract = new TextractClient(
    {   region: "eu-west-2",
        credentials: {
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID
        } 
    }
  );
  
  const params = { JobId };
  
  if (NextToken) params.NextToken = NextToken;

  const command = new GetDocumentTextDetectionCommand(params);

  try {    
    return await textract.send(command);
  } catch (err) {
    // Handle error
    console.log('ERR', err);
    return err;
  }
}

async function getAllJobs(jobId) {
  let response = await getJobsFromTextract(jobId, null); // Get the first call
  
  // if (response.JobStatus === "IN_PROGRESS") {
  //   return { message: "Job not finished yet." }
  // }
  // if (response.JobStatus === "FAILED") {
  //   return { message: "Job failed." }
  // }
  
  //console.log(response);
  //saveResponse(response); // Handle the way to save the response

  var resultString = "";

  while(!response.JobStatus === "SUCCEEDED" || response.JobStatus === "IN_PROGRESS") {
    await timeout(1000);
    response = await getJobsFromTextract(jobId, response.NextToken);
    //console.log(response);

    if (response.JobStatus === "SUCCEEDED"){
      const blocks = response.Blocks;

      blocks.forEach(function(block){
        if(block.BlockType === "LINE")
        resultString = resultString.concat(block.Text) + "\n";
      })

    }
    //saveResponse(response);
  }

  console.log(resultString);

  return resultString; // Get all responses saved and return it.
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}