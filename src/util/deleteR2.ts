import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2Client";
import dotenv from "dotenv";

dotenv.config();

export const deleteR2 = async (filename: string) => {
  const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;
  if (Bucket && r2Client) {
    const deleteObjectParams = {
      Bucket,
      Key: filename,
    };
    const command = new DeleteObjectCommand(deleteObjectParams);
    await r2Client.send(command);
  }
};
