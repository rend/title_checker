import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
    region: "eu-west-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4"
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "30mb"
        }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed"});
    }

    try {
        let { name, type } = req.body;

        const fileParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: name,
            Expires: 600,
            ContentType: type,
            ACL: "public-read"
        };

        const url = await s3.getSignedUrlPromise("putObject", fileParams);

        res.status(200).json({ url });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
}