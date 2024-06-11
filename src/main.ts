import express from "express";
import { IncomingMessage, ServerResponse } from "http";
import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { AvaliableServers } from "./serversToRedirect";

const app = express();
const PORT = process.env.PORT || 3000;

function getServersFromEnv() {
  const servers = process.env.SERVERS?.split(",");
  if (!servers?.length) throw new Error("No servers in process.env.servers");
  return servers;
}
const avaliableServers = new AvaliableServers(getServersFromEnv());

const loadBalancer = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  next: ((err?: any) => void) | undefined
) => {
  const target = avaliableServers.next();
  console.log(`redirecting to ${target}${req.url}`);

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          const exchange = `${req.url} -> ${res.statusCode}`;
          console.log(exchange);
          return responseBuffer;
        }
      ),
    },
  });

  proxy(req, res, next);
};

app.use("/", loadBalancer);

app.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
