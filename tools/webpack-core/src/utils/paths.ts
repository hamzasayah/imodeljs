/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import * as fs from "fs";
import * as path from "path";

const appDirectory = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

let _paths = {
  appPackageJson: resolveApp("package.json"),
  appNodeModules: resolveApp("node_modules"),
}

export function getPaths() {
  return _paths;
}

export function updatePaths(dir: string) {
  _paths.appPackageJson = path.resolve(dir, "package.json");
  _paths.appNodeModules = path.resolve(dir, "node_modules");
}

export function getAppRelativePath(p: string) {
  return path.relative(appDirectory, p);
}

export function getSourcePosition(module: any, loc: any) {
  return `${getAppRelativePath(module.resource)}:${loc.start.line}:${loc.start.column}`;
}