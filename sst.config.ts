// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "splitwise-ai",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    
    const secrets = {
      OPENAI_API_KEY: new sst.Secret("OPENAI_API_KEY"),
      AUTH_USERNAME: new sst.Secret("AUTH_USERNAME"),
      AUTH_PASSWORD: new sst.Secret("AUTH_PASSWORD"),
    }

    const allSecrets = Object.values(secrets);

    const domainName = $app.stage == "production" ? "splitwise-ai.preetnagda.com" : "localhost:3000";

    new sst.aws.Nextjs("splitwise-ai", {
      link: [...allSecrets],
      domain: {
        name: domainName
      },
      environment: {
        OPENAI_API_KEY: secrets.OPENAI_API_KEY.value,
        AUTH_USERNAME: secrets.AUTH_USERNAME.value,
        AUTH_PASSWORD: secrets.AUTH_PASSWORD.value,
      }
    });
  },
});
