/*---------------------------------------------------------------------------------------------
* Copyright (c) 2018 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Utilities */

import * as React from "react";

export const getDisplayName = (component: React.ComponentType<any>): string => {
  if (component.displayName)
    return component.displayName;
  if (component.name)
    return component.name;
  return "Component";
};
