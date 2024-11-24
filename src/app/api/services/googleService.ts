import { OAuth2Client } from "google-auth-library";

const clientId = process.env.GOOGLE_ID;
const client = new OAuth2Client(clientId);
export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });
  return ticket.getPayload();
};
