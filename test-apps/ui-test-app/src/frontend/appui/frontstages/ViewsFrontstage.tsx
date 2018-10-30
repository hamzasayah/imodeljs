/*---------------------------------------------------------------------------------------------
* Copyright (c) 2018 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";

import { Id64String, BeDuration } from "@bentley/bentleyjs-core";

import {
  IModelConnection,
  IModelApp,
  ActivityMessageDetails,
  ActivityMessageEndReason,
  NotifyMessageDetails,
  OutputMessagePriority,
  OutputMessageType,
  RelativePosition,
  SelectionTool,
  FitViewTool,
  PanViewTool,
  RotateViewTool,
  ViewToggleCameraTool,
  WindowAreaTool,
  ZoomViewTool,
  WalkViewTool,
  FlyViewTool,
} from "@bentley/imodeljs-frontend";

import {
  FrontstageProvider,
  GroupButton,
  ToolButton,
  ToolItemDef,
  CommandItemDef,
  ToolWidget,
  ZoneState,
  WidgetState,
  NavigationWidget,
  ContentLayoutDef,
  ContentLayoutProps,
  ContentGroup,
  ContentProps,
  ModalDialogManager,
  ViewSelector,
  ModelSelectorWidgetControl,
  Frontstage,
  Zone,
  Widget,
  GroupItemDef,
} from "@bentley/ui-framework";

import Toolbar from "@bentley/ui-ninezone/lib/toolbar/Toolbar";
import Direction from "@bentley/ui-ninezone/lib/utilities/Direction";
import SvgSprite from "@bentley/ui-ninezone/lib/base/SvgSprite";

import { AppUi } from "../AppUi";
import { TestRadialMenu } from "../dialogs/TestRadialMenu";

import { SampleAppIModelApp } from "../../../frontend/index";

import { IModelViewportControl } from "../contentviews/IModelViewport";
import { AppStatusBarWidgetControl } from "../statusbars/AppStatusBar";
import { VerticalPropertyGridWidgetControl, HorizontalPropertyGridWidgetControl } from "../widgets/PropertyGridDemoWidget";
import { NavigationTreeWidgetControl } from "../widgets/NavigationTreeWidget";
import { BreadcrumbDemoWidgetControl } from "../widgets/BreadcrumbDemoWidget";

import { MeasureByPointsButton } from "../tooluiproviders/MeasurePoints";

import rotateIcon from "../icons/rotate.svg";
import { FeedbackDemoWidget } from "../widgets/FeedbackWidget";
// import SvgPath from "@bentley/ui-ninezone/lib/base/SvgPath";

export class ViewsFrontstage extends FrontstageProvider {

  constructor(public viewIds: Id64String[], public iModelConnection: IModelConnection) {
    super();
  }

  public get frontstage() {
    // first find an appropriate layout
    const contentLayoutProps: ContentLayoutProps | undefined = AppUi.findLayoutFromContentCount(this.viewIds.length);
    if (!contentLayoutProps) {
      throw (Error("Could not find layout ContentLayoutProps from number of viewIds: " + this.viewIds.length));
    }

    const contentLayoutDef: ContentLayoutDef = new ContentLayoutDef(contentLayoutProps);

    // create the content props.
    const contentProps: ContentProps[] = [];
    for (const viewId of this.viewIds) {
      const thisContentProps: ContentProps = {
        classId: IModelViewportControl,
        applicationData: { viewId, iModelConnection: this.iModelConnection },
      };
      contentProps.push(thisContentProps);
    }
    const myContentGroup: ContentGroup = new ContentGroup({ contents: contentProps });

    return (
      <Frontstage id="ViewsFrontstage"
        defaultToolId="Select" defaultLayout={contentLayoutDef} contentGroup={myContentGroup}
        isInFooterMode={true} applicationData={{ key: "value" }}

        topLeft={
          <Zone
            widgets={[
              <Widget isFreeform={true} element={<FrontstageToolWidget />} />,
            ]}
          />
        }
        topCenter={
          <Zone
            widgets={[
              <Widget isToolSettings={true} />,
            ]}
          />
        }
        topRight={
          <Zone
            widgets={[
              <Widget isFreeform={true} element={<FrontstageNavigationWidget />} />,
            ]}
          />
        }
        centerRight={
          <Zone defaultState={ZoneState.Minimized} allowsMerging={true}
            widgets={[
              <Widget iconClass="icon-placeholder" labelKey="SampleApp:widgets.NavigationTree" control={NavigationTreeWidgetControl} />,
              <Widget iconClass="icon-placeholder" labelKey="SampleApp:widgets.BreadcrumbDemo" control={BreadcrumbDemoWidgetControl} />,
              <Widget iconClass="icon-placeholder" labelKey="SampleApp:widgets.ModelSelector" control={ModelSelectorWidgetControl}
                applicationData={{ iModel: SampleAppIModelApp.store.getState().sampleAppState!.currentIModelConnection }} />,
            ]}
          />
        }
        bottomLeft={
          <Zone defaultState={ZoneState.Minimized} allowsMerging={true}
            widgets={[
              <Widget defaultState={WidgetState.Open} iconClass="icon-placeholder" labelKey="SampleApp:widgets.NavigationTree" control={FeedbackDemoWidget} />,
            ]}
          />
        }
        bottomCenter={
          <Zone defaultState={ZoneState.Open}
            widgets={[
              <Widget isStatusBar={true} iconClass="icon-placeholder" labelKey="SampleApp:widgets.StatusBar" control={AppStatusBarWidgetControl} />,
            ]}
          />
        }
        bottomRight={
          <Zone allowsMerging={true}
            widgets={[
              <Widget id="VerticalPropertyGrid" defaultState={WidgetState.Off} iconClass="icon-placeholder" labelKey="SampleApp:widgets.VerticalPropertyGrid" control={VerticalPropertyGridWidgetControl} />,
              <Widget defaultState={WidgetState.Open} iconClass="icon-placeholder" labelKey="SampleApp:widgets.HorizontalPropertyGrid" control={HorizontalPropertyGridWidgetControl} />,
            ]}
          />
        }
      />
    );
  }
}

/** Define a ToolWidget with Buttons to display in the TopLeft zone.
 */
class FrontstageToolWidget extends React.Component {

  /** Tool that will start a sample activity and display ActivityMessage.
   */
  private _tool3 = async () => {
    let isCancelled = false;
    let progress = 0;

    const details = new ActivityMessageDetails(true, true, true);
    details.onActivityCancelled = () => {
      isCancelled = true;
    };
    IModelApp.notifications.setupActivityMessage(details);

    while (!isCancelled && progress <= 100) {
      IModelApp.notifications.outputActivityMessage("This is a sample activity message", progress);
      await BeDuration.wait(100);
      progress++;
    }

    const endReason = isCancelled ? ActivityMessageEndReason.Cancelled : ActivityMessageEndReason.Completed;
    IModelApp.notifications.endActivityMessage(endReason);
  }

  /** Tool that will display a pointer message on keyboard presses.
   */
  private _tool4 = () => {
    const details = new NotifyMessageDetails(OutputMessagePriority.Info, "Press an arrow", "Press an arrow and move mouse to dismiss", OutputMessageType.Pointer);
    details.setPointerTypeDetails(IModelApp.viewManager.selectedView!.parentDiv,
      {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    IModelApp.notifications.outputMessage(details);
    document.addEventListener("keyup", this._handleTool4Keypress);
    document.addEventListener("mousemove", this._handleTool4Dismiss);
  }

  private _handleTool4Keypress = (event: any) => {
    const details = new NotifyMessageDetails(OutputMessagePriority.Info, "", "", OutputMessageType.Pointer);
    const viewport = IModelApp.viewManager.selectedView!.parentDiv;
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;
    switch (event.keyCode) {
      case 37:
        details.briefMessage = "Left pressed";
        details.setPointerTypeDetails(viewport, { x: midX, y: midY }, RelativePosition.Left);
        IModelApp.notifications.outputMessage(details);
        break;
      case 38:
        details.briefMessage = "Up pressed";
        details.setPointerTypeDetails(viewport, { x: midX, y: midY }, RelativePosition.Top);
        IModelApp.notifications.outputMessage(details);
        break;
      case 39:
        details.briefMessage = "Right pressed";
        details.setPointerTypeDetails(viewport, { x: midX, y: midY }, RelativePosition.Right);
        IModelApp.notifications.outputMessage(details);
        break;
      case 40:
        details.briefMessage = "Down pressed";
        details.setPointerTypeDetails(viewport, { x: midX, y: midY }, RelativePosition.Bottom);
        IModelApp.notifications.outputMessage(details);
        break;
    }
  }

  private _handleTool4Dismiss = () => {
    IModelApp.notifications.closePointerMessage();
    document.removeEventListener("keyup", this._handleTool4Keypress);
    document.removeEventListener("mousemove", this._handleTool4Dismiss);
  }

  private radialMenu(): React.ReactNode {
    return (
      <TestRadialMenu
        opened={true} />
    );
  }

  private _myToolItem1 = new ToolItemDef({
    toolId: "tool1",
    iconClass: "icon-placeholder",
    labelKey: "SampleApp:buttons.tool1",
    execute: AppUi.tool1,
    applicationData: { key: "value" },
  });

  private _myGroupItem1 = new GroupItemDef({
    groupId: "my-group1",
    labelKey: "SampleApp:buttons.toolGroup",
    iconClass: "icon-placeholder",
    items: [this._myToolItem1, "tool2", "item3", "item4", "item5", "item6", "item7", "item8"],
    direction: Direction.Bottom,
    itemsInColumn: 7,
  });

  private _setLengthFormatMetricCommand = new CommandItemDef({
    commandId: "setLengthFormatMetric",
    iconClass: "icon-info",
    labelKey: "SampleApp:buttons.setLengthFormatMetric",
    commandHandler: {
      execute: () => {
        IModelApp.quantityFormatter.useImperialFormats = false;
        IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, "Set Length Format to Metric"));
      },
    },
  });

  private _setLengthFormatImperialCommand = new CommandItemDef({
    commandId: "setLengthFormatImperial",
    iconClass: "icon-info",
    labelKey: "SampleApp:buttons.setLengthFormatImperial",
    commandHandler: {
      execute: () => {
        IModelApp.quantityFormatter.useImperialFormats = true;
        IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, "Set Length Format to Imperial"));
      },
    },
  });

  private _horizontalToolbar =
    <Toolbar
      expandsTo={Direction.Bottom}
      items={
        <>
          <ToolButton toolId={SelectionTool.toolId} labelKey="SampleApp:tools.select" iconClass="icon-cursor" />
          <MeasureByPointsButton />
          <GroupButton
            labelKey="SampleApp:buttons.toolGroup"
            iconClass="icon-placeholder"
            items={[this._setLengthFormatMetricCommand, this._setLengthFormatImperialCommand]}
            direction={Direction.Bottom}
            itemsInColumn={4}
          />

        </>
      }
    />;

  private _verticalToolbar =
    <Toolbar
      expandsTo={Direction.Right}
      items={
        <>
          <ToolButton toolId="tool1" iconClass="icon-placeholder" labelKey="SampleApp:buttons.tool1" execute={AppUi.tool1} />
          <ToolButton toolId="tool2" iconClass="icon-placeholder" labelKey="SampleApp:buttons.tool2" execute={AppUi.tool2} />
          <ToolButton toolId="tool3" iconClass="icon-placeholder" labelKey="SampleApp:buttons.tool3" isEnabled={false} execute={this._tool3} />
          <ToolButton toolId="tool4" iconClass="icon-placeholder" labelKey="SampleApp:buttons.tool4" isVisible={false} execute={this._tool4} />
          <ToolButton toolId="item5" iconClass="icon-placeholder" labelKey="SampleApp:buttons.outputMessage" execute={() => IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, "Test"))} />
          <ToolButton toolId="openRadial" iconClass="icon-placeholder" labelKey="SampleApp:buttons.openRadial" execute={() => ModalDialogManager.openModalDialog(this.radialMenu())} />
          <GroupButton
            labelKey="SampleApp:buttons.anotherGroup"
            iconClass="icon-placeholder"
            items={[this._myToolItem1, "tool2", "item3", "item4", "item5", "item6", "item7", "item8", this._myGroupItem1]}
            direction={Direction.Right}
          />
        </>
      }
    />;

  public render() {
    return (
      <ToolWidget
        appButtonId="SampleApp.BackstageToggle"
        horizontalToolbar={this._horizontalToolbar}
        verticalToolbar={this._verticalToolbar}
      />
    );
  }
}

/** Define a NavigationWidget with Buttons to display in the TopRight zone.
 */
class FrontstageNavigationWidget extends React.Component {
  private _fitToViewTool = () => {
    IModelApp.tools.run(FitViewTool.toolId, IModelApp.viewManager.selectedView, true);
  }

  private _windowAreaTool = () => {
    IModelApp.tools.run(WindowAreaTool.toolId, IModelApp.viewManager.selectedView);
  }

  private _zoomViewTool = () => {
    IModelApp.tools.run(ZoomViewTool.toolId, IModelApp.viewManager.selectedView);
  }

  private _panViewTool = () => {
    IModelApp.tools.run(PanViewTool.toolId, IModelApp.viewManager.selectedView, true);
  }

  private _toggleCameraTool = () => {
    IModelApp.tools.run(ViewToggleCameraTool.toolId, IModelApp.viewManager.selectedView);
  }

  private _walkTool = () => {
    IModelApp.tools.run(WalkViewTool.toolId, IModelApp.viewManager.selectedView);
  }

  private _flyTool = () => {
    IModelApp.tools.run(FlyViewTool.toolId, IModelApp.viewManager.selectedView);
  }

  private _rotateTool = () => {
    IModelApp.tools.run(RotateViewTool.toolId, IModelApp.viewManager.selectedView);
  }

  private rotateSvgIcon(): React.ReactNode {
    return (
      <SvgSprite src={rotateIcon} />
    );
  }

  /*
  private rotateSvgIcon(): React.ReactNode {
    return (
      <SvgPath viewBoxWidth={91} viewBoxHeight={91}
        paths={[
          "M86.734,49.492c-4.305,0.01-17.991,1.527-20.508,1.943c-1.589,0.261-3.454,0.267-4.732,1.335   c-1.173,0.98-0.649,2.788,0.453,3.52c1.182,0.78,17.18,0.641,19.686,0.645c-0.216,0.404-4.764,8.202-7.226,11.423   c-4.994,6.53-12.322,11.926-20.213,14.39c-9.906,3.093-21.47,0.982-30.055-4.716c-4.252-2.82-7.595-6.813-10.364-11.047   c-2.37-3.625-4.53-8.918-8.038-11.526c-0.238-0.18-0.687-0.002-0.732,0.298c-0.548,3.663,1.414,7.707,2.843,10.992   c1.7,3.904,4.146,7.539,6.933,10.755c5.891,6.799,14.97,10.758,23.738,12.057c15.313,2.272,30.362-4.708,39.961-16.643   c2.182-2.715,4.058-5.652,5.88-8.618c-0.04,4.63-0.08,9.262-0.109,13.891c-0.026,4.004,6.195,4.008,6.222,0   c0.054-8.303,0.122-16.604,0.122-24.907C90.594,51.061,87.978,49.49,86.734,49.492z",
          "M17.98,20.688c5.096-5.933,12.107-11.209,19.818-13.11c10.523-2.591,23.726,1.216,31.448,8.788   c3.523,3.45,6.227,7.538,8.734,11.751c2.084,3.496,4.084,8.505,7.364,11.009c0.244,0.187,0.678-0.004,0.731-0.296   c0.637-3.572-1.238-7.563-2.511-10.82c-1.516-3.889-3.713-7.637-6.163-11.013C72.166,9.786,64.534,5.113,56.037,2.605   C39.996-2.125,24.416,4.048,13.693,16.4c-2.328,2.684-4.36,5.616-6.345,8.567c0.256-3.586,0.517-7.172,0.765-10.759   c0.278-3.995-5.944-3.977-6.221,0c-0.492,7.064-1.519,21.896-1.484,22.229c0.013,0.612-0.002,3.301,2.793,3.301   c3.233,0.002,10.855-0.29,14.028-0.466c2.881-0.16,5.805-0.179,8.675-0.475c1.158-0.121,3.727-0.079,3.836-1.451   c0.175-2.197-3.893-3.01-4.988-3.118c-3.061-0.304-13.198-1.281-15.208-1.447c0.288-0.488,0.571-0.964,0.853-1.389   C12.798,27.753,15.135,24.001,17.98,20.688z",
        ]}
      />
    );
  }
  */

  private _horizontalToolbar =
    <Toolbar
      expandsTo={Direction.Bottom}
      items={
        <>
          <ToolButton toolId={FitViewTool.toolId} labelKey="SampleApp:tools.fitView" iconClass="icon-fit-to-view" execute={this._fitToViewTool} />
          <ToolButton toolId={WindowAreaTool.toolId} labelKey="SampleApp:tools.windowArea" iconClass="icon-window-area" execute={this._windowAreaTool} />
          <ToolButton toolId={ZoomViewTool.toolId} labelKey="SampleApp:tools.zoom" iconClass="icon-zoom" execute={this._zoomViewTool} />
          <ToolButton toolId={PanViewTool.toolId} labelKey="SampleApp:tools.pan" iconClass="icon-hand-2" execute={this._panViewTool} />
          <ToolButton toolId={RotateViewTool.toolId} labelKey="SampleApp:tools.rotate" iconElement={this.rotateSvgIcon()} execute={this._rotateTool} />
        </>
      }
    />;

  private _verticalToolbar =
    <Toolbar
      expandsTo={Direction.Left}
      items={
        <>
          <ToolButton toolId={WalkViewTool.toolId} labelKey="SampleApp:tools.walk" iconClass="icon-walk" execute={this._walkTool} />
          <ToolButton toolId={FlyViewTool.toolId} labelKey="SampleApp:tools.fly" iconClass="icon-airplane" execute={this._flyTool} />
          <ToolButton toolId={ViewToggleCameraTool.toolId} labelKey="SampleApp:tools.toggleCamera" iconClass="icon-camera" execute={this._toggleCameraTool} />
          <ViewSelector imodel={SampleAppIModelApp.store.getState().sampleAppState!.currentIModelConnection} />
        </>
      }
    />;

  public render() {
    return (
      <NavigationWidget
        navigationAidId="CubeNavigationAid"
        iModelConnection={SampleAppIModelApp.store.getState().sampleAppState!.currentIModelConnection!}
        horizontalToolbar={this._horizontalToolbar}
        verticalToolbar={this._verticalToolbar}
      />
    );
  }
}
