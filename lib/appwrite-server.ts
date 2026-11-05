import { Account, Client, Databases } from "node-appwrite";

function getAppwriteClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint || !projectId) {
    throw new Error("Appwrite endpoint and project ID are not configured.");
  }

  return new Client().setEndpoint(endpoint).setProject(projectId);
}

export async function getAuthenticatedUserId(jwt: string) {
  const user = await new Account(getAppwriteClient().setJWT(jwt)).get();
  return user.$id;
}

export function getDatabases() {
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) {
    throw new Error("Appwrite server API key is not configured.");
  }

  return new Databases(getAppwriteClient().setKey(apiKey));
}