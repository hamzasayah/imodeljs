/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module HubAccess
 */

import { join } from "path";
import { AzureFileHandler } from "@bentley/backend-itwin-client";
import { BriefcaseStatus, GuidString, IModelStatus, Logger } from "@bentley/bentleyjs-core";
import {
  BriefcaseQuery, ChangeSet, ChangeSetQuery, ChangesType, CodeQuery, IModelBankClient, IModelClient, IModelHubClient, IModelQuery, Lock, LockQuery,
  VersionQuery,
} from "@bentley/imodelhub-client";
import { CodeProps, IModelError, IModelVersion } from "@bentley/imodeljs-common";
import { AuthorizedClientRequestContext } from "@bentley/itwin-client";
import { AuthorizedBackendRequestContext } from "./BackendRequestContext";
import { BriefcaseManager } from "./BriefcaseManager";
import { BriefcaseIdArg, ChangeSetFileProps, ChangeSetProps, ChangeSetRange, IModelIdArg, LockProps } from "./HubAccess";

/** @internal */
export class IModelHubAccess {

  private static _imodelClient?: IModelClient;
  private static _isIModelBankClient = false;

  public static setIModelClient(client?: IModelClient) {
    this._imodelClient = client;
    this._isIModelBankClient = client instanceof IModelBankClient;
  }

  public static get isUsingIModelBankClient(): boolean {
    return this._isIModelBankClient;
  }

  public static get iModelClient(): IModelClient {
    if (!this._imodelClient)
      this._imodelClient = new IModelHubClient(new AzureFileHandler());

    return this._imodelClient;
  }

  public static async getLatestChangeSetId(arg: IModelIdArg): Promise<string> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const changeSets: ChangeSet[] = await this.iModelClient.changeSets.get(requestContext, arg.iModelId, new ChangeSetQuery().top(1).latest());
    return (changeSets.length === 0) ? "" : changeSets[changeSets.length - 1].wsgId;
  }

  public static async getChangeSetIdFromNamedVersion(arg: IModelIdArg & { versionName: string }): Promise<string> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const versions = await this.iModelClient.versions.get(requestContext, arg.iModelId, new VersionQuery().select("ChangeSetId").byName(arg.versionName));
    if (!versions[0] || !versions[0].changeSetId)
      throw new IModelError(IModelStatus.NotFound, `Named version ${arg.versionName} not found`);
    return versions[0].changeSetId;
  }

  public static async getChangeSetIdFromVersion(arg: IModelIdArg & { version: IModelVersion }): Promise<string> {
    const version = arg.version;
    if (version.isFirst)
      return "";

    const asOf = version.getAsOfChangeSet();
    if (asOf)
      return asOf;

    const versionName = version.getName();
    if (versionName)
      return this.getChangeSetIdFromNamedVersion({ ...arg, versionName });

    return this.getLatestChangeSetId(arg);
  }

  public static async createIModel(arg: { requestContext?: AuthorizedClientRequestContext, contextId: GuidString, iModelName: string, description?: string }): Promise<GuidString> {
    if (this.isUsingIModelBankClient)
      throw new IModelError(IModelStatus.BadRequest, "This is a iModelHub only operation");

    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const hubIModel = await this.iModelClient.iModels.create(requestContext, arg.contextId, arg.iModelName, { description: arg.description });
    requestContext.enter();
    return hubIModel.wsgId;
  }

  public static async deleteIModel(arg: IModelIdArg & { contextId: GuidString }): Promise<void> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    return this.iModelClient.iModels.delete(requestContext, arg.contextId, arg.iModelId);
  }
  public static async queryIModelByName(arg: { requestContext?: AuthorizedClientRequestContext, contextId: GuidString, iModelName: string }): Promise<GuidString | undefined> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const iModels = await this.iModelClient.iModels.get(requestContext, arg.contextId, new IModelQuery().byName(arg.iModelName));
    return iModels.length === 0 ? undefined : iModels[0].id!;
  }

  public static async pushChangeSet(arg: IModelIdArg & { changesetProps: ChangeSetFileProps, releaseLocks: boolean }) {
    const changeset = new ChangeSet();
    const changesetProps = arg.changesetProps;
    changeset.id = changesetProps.id;
    changeset.parentId = changesetProps.parentId;
    changeset.changesType = changesetProps.changesType;
    changeset.fileSize = changesetProps.size!.toString();
    changeset.description = changesetProps.description;
    if (changeset.description.length >= 255) {
      Logger.logWarning("imodelhub-access", `pushChanges - Truncating description to 255 characters. ${changeset.description}`);
      changeset.description = changeset.description.slice(0, 254);
    }

    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    requestContext.enter();
    await this.iModelClient.changeSets.create(requestContext, arg.iModelId, changeset, changesetProps.pathname);
    if (arg.releaseLocks)
      return this.iModelClient.locks.deleteAll(requestContext, arg.iModelId, arg.changesetProps.briefcaseId!);

  }

  /** Releases a briefcaseId from iModelHub. After this call it is illegal to generate changesets for the released briefcaseId.
   * @note generally, this method should not be called directly. Instead use [[deleteBriefcaseFiles]].
   * @see deleteBriefcaseFiles
   */
  public static async releaseBriefcase(arg: BriefcaseIdArg): Promise<void> {
    const { briefcaseId, iModelId } = arg;
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    try {
      await this.iModelClient.briefcases.get(requestContext, iModelId, new BriefcaseQuery().byId(briefcaseId));
      requestContext.enter();
    } catch (error) {
      requestContext.enter();
      throw error;
    }

    await this.iModelClient.briefcases.delete(requestContext, iModelId, briefcaseId);
    requestContext.enter();
  }

  public static async getMyBriefcaseIds(arg: IModelIdArg): Promise<number[]> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const myHubBriefcases = await this.iModelClient.briefcases.get(requestContext, arg.iModelId, new BriefcaseQuery().ownedByMe().selectDownloadUrl());
    const myBriefcaseIds: number[] = [];
    for (const hubBc of myHubBriefcases)
      myBriefcaseIds.push(hubBc.briefcaseId!); // save the list of briefcaseIds we already own.
    return myBriefcaseIds;
  }

  public static async acquireNewBriefcaseId(arg: { requestContext?: AuthorizedClientRequestContext, iModelId: GuidString }): Promise<number> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const briefcase = await this.iModelClient.briefcases.create(requestContext, arg.iModelId);
    requestContext.enter();

    if (!briefcase)
      throw new IModelError(BriefcaseStatus.CannotAcquire, "Could not acquire briefcase");

    return briefcase.briefcaseId!;
  }

  public static async getChangeSetIndexFromId(arg: IModelIdArg & { changeSetId: string }): Promise<number> {
    if (arg.changeSetId === "")
      return 0; // the first version

    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const changeSet = (await this.iModelClient.changeSets.get(requestContext, arg.iModelId, new ChangeSetQuery().byId(arg.changeSetId)))[0];
    requestContext.enter();
    return +changeSet.index!;
  }

  public static async queryChangeSetProps(arg: IModelIdArg & { changesetId: string }): Promise<ChangeSetProps> {
    const query = new ChangeSetQuery();
    query.byId(arg.changesetId);

    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const changeSets = await this.iModelClient.changeSets.get(requestContext, arg.iModelId, query);
    if (changeSets.length === 0)
      throw new Error(`Unable to find change set ${arg.changesetId} for iModel ${arg.iModelId}`);

    const cs = changeSets[0];
    return { id: cs.id!, changesType: cs.changesType!, parentId: cs.parentId ?? "", description: cs.description ?? "", pushDate: cs.pushDate, userCreated: cs.userCreated };
  }

  private static toChangeSetProps(cs: ChangeSet): ChangeSetProps {
    return {
      id: cs.wsgId, parentId: cs.parentId ? cs.parentId : "",
      description: cs.description ?? "", changesType: cs.changesType ?? ChangesType.Regular, userCreated: cs.userCreated,
    };
  }

  private static toChangeSetFileProps(cs: ChangeSet, basePath: string): ChangeSetFileProps {
    const csProps = this.toChangeSetProps(cs) as ChangeSetFileProps;
    csProps.pathname = join(basePath, cs.fileName!);
    return csProps;
  }

  public static async queryChangeSet(arg: IModelIdArg & { id: string }): Promise<ChangeSetProps> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const changeSets = await this.iModelClient.changeSets.get(requestContext, arg.iModelId, new ChangeSetQuery().byId(arg.id));
    if (undefined === changeSets)
      throw new IModelError(IModelStatus.NotFound, `ChangeSet ${arg.id} not found`);

    return this.toChangeSetProps(changeSets[0]);
  }

  public static async downloadChangeSet(arg: IModelIdArg & { id: string }): Promise<ChangeSetFileProps> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const changeSetsPath = BriefcaseManager.getChangeSetsPath(arg.iModelId);

    const changeSets = await this.iModelClient.changeSets.download(requestContext, arg.iModelId, new ChangeSetQuery().byId(arg.id), changeSetsPath);
    if (undefined === changeSets)
      throw new IModelError(IModelStatus.NotFound, `ChangeSet ${arg.id} not found`);

    return this.toChangeSetFileProps(changeSets[0], BriefcaseManager.getChangeSetsPath(arg.iModelId));
  }

  /** queries for change sets in the specified range. */
  public static async queryChangeSets(arg: IModelIdArg & { range?: ChangeSetRange }): Promise<ChangeSetProps[]> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const range = arg.range ?? { first: "" };
    const after = range.after ?? (await this.queryChangeSetProps({ ...arg, changesetId: range.first })).parentId;
    if (range.end === "" || after === range.end)
      return [];

    const query = new ChangeSetQuery();
    query.betweenChangeSets(after, range.end);

    let changeSets: ChangeSet[];
    try {
      changeSets = await this.iModelClient.changeSets.get(requestContext, arg.iModelId, query);
      requestContext.enter();
    } catch (error) {
      requestContext.enter();
      throw error;
    }

    const val: ChangeSetProps[] = [];
    for (const cs of changeSets)
      val.push(this.toChangeSetProps(cs));

    return val;
  }

  /** Downloads change sets in the specified range. */
  public static async downloadChangeSets(arg: IModelIdArg & { range?: ChangeSetRange }): Promise<ChangeSetFileProps[]> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const range = arg.range ?? { first: "" };
    const after = range.after ?? (await this.queryChangeSetProps({ ...arg, changesetId: range.first })).parentId;
    if (range.end === "" || after === range.end)
      return [];

    const query = new ChangeSetQuery();
    query.betweenChangeSets(after, range.end);

    const changeSetsPath = BriefcaseManager.getChangeSetsPath(arg.iModelId);
    let changeSets: ChangeSet[];
    try {
      changeSets = await this.iModelClient.changeSets.download(requestContext, arg.iModelId, query, changeSetsPath);
      requestContext.enter();
    } catch (error) {
      requestContext.enter();
      throw error;
    }

    const val: ChangeSetFileProps[] = [];
    for (const cs of changeSets)
      val.push(this.toChangeSetFileProps(cs, changeSetsPath));

    return val;
  }

  public static async releaseAllLocks(arg: BriefcaseIdArg) {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    return this.iModelClient.locks.deleteAll(requestContext, arg.iModelId, arg.briefcaseId);

  }
  public static async releaseAllCodes(arg: BriefcaseIdArg) {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    return this.iModelClient.codes.deleteAll(requestContext, arg.iModelId, arg.briefcaseId);

  }

  public static async getAllLocks(arg: BriefcaseIdArg): Promise<LockProps[]> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const heldLocks = await this.iModelClient.locks.get(requestContext, arg.iModelId, new LockQuery().byBriefcaseId(arg.briefcaseId));
    return heldLocks.map((lock) => ({ type: lock.lockType!, objectId: lock.objectId!, level: lock.lockLevel! }));
  }

  public static async getAllCodes(arg: BriefcaseIdArg): Promise<CodeProps[]> {
    const requestContext = arg.requestContext ?? await AuthorizedBackendRequestContext.create();
    const reservedCodes = await this.iModelClient.codes.get(requestContext, arg.iModelId, new CodeQuery().byBriefcaseId(arg.briefcaseId));
    return reservedCodes.map((code) => ({ spec: code.codeSpecId!, scope: code.codeScope!, value: code.value! }));
  }

  public static toHubLock(arg: BriefcaseIdArg & { changesetId?: string }, reqLock: LockProps): Lock {
    const lock = new Lock();
    lock.briefcaseId = arg.briefcaseId;
    lock.lockLevel = reqLock.level;
    lock.lockType = reqLock.type;
    lock.objectId = reqLock.objectId;
    lock.releasedWithChangeSet = arg.changesetId;
    lock.seedFileId = arg.iModelId;
    return lock;
  }

  public static toHubLocks(arg: BriefcaseIdArg & { changesetId?: string, locks: LockProps[] }): Lock[] {
    return arg.locks.map((lock) => this.toHubLock(arg, lock));
  }
}

