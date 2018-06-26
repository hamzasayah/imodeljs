/*---------------------------------------------------------------------------------------------
|  $Copyright: (c) 2018 Bentley Systems, Incorporated. All rights reserved. $
 *--------------------------------------------------------------------------------------------*/
import { expect } from "chai";
import { initialize, terminate } from "../IntegrationTests";
import "@helpers/Snapshots";
import { OpenMode, Id64, using } from "@bentley/bentleyjs-core";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import { InstanceKey, PresentationRuleSet } from "@bentley/ecpresentation-common";
import { ECPresentation } from "@bentley/ecpresentation-frontend";

before(() => {
  initialize();
});

after(() => {
  terminate();
});

describe("NodesPaths", () => {

  let imodel: IModelConnection;

  before(async () => {
    const testIModelName: string = "assets/datasets/1K.bim";
    imodel = await IModelConnection.openStandalone(testIModelName, OpenMode.Readonly);
    expect(imodel).is.not.null;
  });

  after(async () => {
    await imodel.closeStandalone();
  });

  it("gets filtered node paths", async () => {
    const ruleset: PresentationRuleSet = require("../../test-rulesets/NodePaths/getFilteredNodePaths");
    /* Hierarchy in the ruleset:
    filter r1
      filter ch1
      other ch2
      other ch3
        filter ch4
    other r2
    other r3
      other ch5
      filter ch6
    */
    await using(await ECPresentation.presentation.rulesets().add(ruleset), async () => {
      const result = await ECPresentation.presentation.getFilteredNodePaths({ imodel, rulesetId: ruleset.ruleSetId }, "filter");
      expect(result).to.matchSnapshot(true);
    });
  });

  it("gets node paths", async () => {
    const ruleset: PresentationRuleSet = require("../../test-rulesets/NodePaths/getNodePaths");
    await using(await ECPresentation.presentation.rulesets().add(ruleset), async () => {
      const key1: InstanceKey = { id: new Id64("0x1"), className: "BisCore:RepositoryModel" };
      const key2: InstanceKey = { id: new Id64("0x1"), className: "BisCore:Subject" };
      const key3: InstanceKey = { id: new Id64("0x12"), className: "BisCore:PhysicalPartition" };
      const key4: InstanceKey = { id: new Id64("0xe"), className: "BisCore:LinkPartition" };
      const keys: InstanceKey[][] = [[key1, key2, key3], [key1, key2, key4]];

      const result = await ECPresentation.presentation.getNodePaths({ imodel, rulesetId: ruleset.ruleSetId }, keys, 1);
      expect(result).to.matchSnapshot();
    });
  });

});
