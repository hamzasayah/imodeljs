/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as fs from "fs-extra";
import * as path from "path";
import { Compiler } from "webpack";
import { getPaths, resolveApp } from "../utils/paths";

abstract class AbstractAsyncStartupPlugin {
  private _name: string;
  private _promise!: Promise<any>;
  _logger: any;

  constructor(name: string) {
    this._name = name;
  }

  public apply(compiler: Compiler) {
    compiler.hooks.beforeRun.tap(this._name, () => {
      this._promise = this.runAsync(compiler);
    });

    compiler.hooks.compilation.tap(this._name, (compilation) => {
      this._logger = compilation.getLogger(this._name);
    });

    compiler.hooks.afterEmit.tapPromise(this._name, async () => {
      await this._promise;
    });
  }

  public abstract runAsync(compiler: Compiler): Promise<any>;
}

async function isDirectory(directoryName: string) {
  return (await fs.stat(directoryName)).isDirectory();
}

async function tryCopyDirectoryContents(source: string, target: string) {
  if (!fs.existsSync(source))
    return;

  const copyOptions = { dereference: true, preserveTimestamps: true, overwrite: false, errorOnExist: false };
  try {
    if (await isDirectory(source) && fs.existsSync(target) && await isDirectory(target)) {
      for (const name of await fs.readdir(source)) {
        await tryCopyDirectoryContents(path.join(source, name), path.join(target, name));
      }
    } else {
      await fs.copy(source, target, copyOptions);
    }
  } catch (err) {
    console.log(`Error trying to copy '${source}' to '${target}': ${err.toString()}`);
  }
}

export class CopyBentleyStaticResourcesPlugin extends AbstractAsyncStartupPlugin {
  private _directoryNames: string[];
  private _useDirectoryName: boolean;

  constructor(directoryNames: string[], useDirectoryName?: boolean) {
    super("CopyBentleyStaticResourcesPlugin");
    this._directoryNames = directoryNames;
    this._useDirectoryName = undefined === useDirectoryName ? false : useDirectoryName;
  }

  public async runAsync(compiler: Compiler) {
    const paths = getPaths();
    const bentleyDir = path.resolve(paths.appNodeModules, "@bentley");
    let subDirectoryNames: string[];
    try {
      subDirectoryNames = await fs.readdir(bentleyDir);
    } catch (err) {
      this._logger.error(`Can't locate ${err.path}`);
      return;
    }
    for (const thisSubDir of subDirectoryNames) {
      if (!(await isDirectory(path.resolve(bentleyDir, thisSubDir))))
        continue;

      const fullDirName = path.resolve(bentleyDir, thisSubDir);
      for (const staticAssetsDirectoryName of this._directoryNames) {
        await tryCopyDirectoryContents(
          path.join(fullDirName, "lib", staticAssetsDirectoryName),
          this._useDirectoryName ? compiler.outputPath : path.join(compiler.outputPath, staticAssetsDirectoryName),
        );
      }
    }
    return;
  }
}

export class CopyAppAssetsPlugin extends AbstractAsyncStartupPlugin {
  constructor(private _assetsDir: string = "assets") {
    super("CopyAppAssetsPlugin");
  }

  public async runAsync(compiler: Compiler) {
    const outAssetsDir = path.resolve(compiler.outputPath, "assets");
    await tryCopyDirectoryContents(resolveApp(this._assetsDir), outAssetsDir);
  }
}
