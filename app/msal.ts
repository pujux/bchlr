import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "d38e52e7-0e64-46ff-a0ee-4848daa391bb",
    authority: "https://login.microsoftonline.com/0154176d-b837-49c5-b37e-251968ad316e",
    redirectUri: "https://saltranslator.azurewebsites.net/", // Hier sollte die Umleitungs-URI deiner Anwendung stehen
  },
});

export { msalInstance };
