/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { mount, shallow } from "enzyme";
import * as React from "react";
import { FooterSeparator } from "../../ui-ninezone";

describe("<FooterSeparator />", () => {
  it("should render", () => {
    mount(<FooterSeparator />);
  });

  it("renders correctly", () => {
    shallow(<FooterSeparator />).should.matchSnapshot();
  });
});
