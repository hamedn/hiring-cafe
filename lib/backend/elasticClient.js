import { Client } from "@elastic/elasticsearch";

const elasticClient = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    apiKey: process.env.NEXT_PRIVATE_ELASTIC_API_KEY,
  },
});

export default elasticClient;
