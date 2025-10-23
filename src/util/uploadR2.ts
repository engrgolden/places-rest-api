import dotenv from "dotenv";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2Client";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const uploadR2 = async (file: any) => {
  const name = uuidv4() + "." + file.mimetype.split("/")[1];
  const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;
  if (Bucket && r2Client) {
    const params = {
      Bucket,
      Key: name,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await r2Client.send(command);
    return name;
  }
};
