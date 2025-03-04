/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// Sets up a local backend to be used for testing within the iModel.js repo.

import * as path from "path";
import { Config } from "@bentley/bentleyjs-core";
import { loadEnv } from "@bentley/config-loader";
import { IModelJsExpressServer } from "@bentley/express-server";
import { IModelHost, IModelHostConfiguration } from "@bentley/imodeljs-backend";
import { BentleyCloudRpcManager, RpcConfiguration } from "@bentley/imodeljs-common";
import { getRpcInterfaces, Settings } from "../common/Settings";

loadEnv(path.join(__dirname, "..", "..", ".env"));
const settings = new Settings(process.env);
Config.App.set("imjs_buddi_resolve_url_using_region", settings.env);
void (async () => {
  RpcConfiguration.developmentMode = true;

  // Start the backend
  const hostConfig = new IModelHostConfiguration();
  hostConfig.concurrentQuery.concurrent = 2;
  hostConfig.concurrentQuery.pollInterval = 5;
  await IModelHost.startup(hostConfig);

  const rpcConfig = BentleyCloudRpcManager.initializeImpl({ info: { title: "schema-rpc-test", version: "v1.0" } }, getRpcInterfaces());

  // create a basic express web server
  const port = 5011;
  const server = new IModelJsExpressServer(rpcConfig.protocol);
  await server.initialize(port);
  console.log(`Web backend for schema-rpc-tests listening on port ${port}`); // eslint-disable-line
})();
