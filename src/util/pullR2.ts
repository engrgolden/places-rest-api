import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2Client";
import dotenv from "dotenv";

dotenv.config();

export const pullR2 = async (items: any) => {
  const Bucket = process.env.CLOUDFLARE_BUCKET_NAME;
  if (Bucket && r2Client) {
    for (const item of items) {
      const getObjectParams = {
        Bucket,
        Key: item.fileName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
      item.imageUrl = url;
    }
  }
};
