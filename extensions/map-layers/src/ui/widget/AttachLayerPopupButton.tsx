/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { IModelApp, MapLayerSourceStatus, NotifyMessageDetails, OutputMessagePriority } from "@bentley/imodeljs-frontend";
import { RelativePosition } from "@bentley/ui-abstract";
import { Button, ButtonType, Input, Listbox, ListboxItem, LoadingSpinner, OutsideClickEvent, Popup, SpinnerSize, useOnOutsideClick, WebFontIcon } from "@bentley/ui-core";
import { ModalDialogManager } from "@bentley/ui-framework";
import { useSourceMapContext } from "./MapLayerManager";
import { MapUrlDialog } from "./MapUrlDialog";
import { MapLayersUiItemsProvider } from "../MapLayersUiItemsProvider";
import { MapLayerStatus } from "@bentley/imodeljs-common";

// cSpell:ignore droppable Sublayer

interface AttachLayerPanelProps {
  isOverlay: boolean;
  onLayerAttached: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function AttachLayerPanel({ isOverlay, onLayerAttached }: AttachLayerPanelProps) {
  const [layerNameToAdd, setLayerNameToAdd] = React.useState<string | undefined>();
  const [sourceFilterString, setSourceFilterString] = React.useState<string | undefined>();
  const [placeholderLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.SearchPlaceholder"));
  const [addCustomLayerLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.Custom"));
  const [addCustomLayerToolTip] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.AttachCustomLayer"));
  const [loadingMapSources] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:CustomAttach.LoadingMapSources"));
  const [loading, setLoading] = React.useState(false);

  const handleFilterTextChanged = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceFilterString(event.target.value);
  }, []);

  const { sources, activeViewport, backgroundLayers, overlayLayers, mapTypesOptions } = useSourceMapContext();

  const styleContainsLayer = React.useCallback((name: string) => {
    if (backgroundLayers) {
      if (-1 !== backgroundLayers.findIndex((layer) => layer.name === name))
        return true;
    }
    if (overlayLayers) {
      if (-1 !== overlayLayers.findIndex((layer) => layer.name === name))
        return true;
    }
    return false;
  }, [backgroundLayers, overlayLayers]);

  React.useEffect(() => {
    async function attemptToAddLayer(layerName: string) {
      if (layerName && activeViewport) {
        // if the layer is not in the style add it now.
        if (undefined === backgroundLayers?.find((layer) => layerName === layer.name) && undefined === overlayLayers?.find((layer) => layerName === layer.name)) {
          const mapLayerSettings = sources?.find((source) => source.name === layerName);
          if (mapLayerSettings) {
            try {
              setLoading(true);
              const { status, subLayers } = await mapLayerSettings.validateSource();
              if (status === MapLayerSourceStatus.Valid || status === MapLayerSourceStatus.RequireAuth) {

                const source = Object.assign({}, mapLayerSettings);  // shallow copy
                source.subLayers = subLayers;
                activeViewport.displayStyle.attachMapLayer(source, isOverlay);

                if (status === MapLayerSourceStatus.RequireAuth) {
                  IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Error, `Authentication required for Layer : ${source.name}`));

                  //Set layer status
                  const layerIdx = activeViewport.displayStyle.findMapLayerIndexByNameAndUrl(source.name, source.url, isOverlay);
                  if (-1 !== layerIdx) {
                    const layerSettings = activeViewport.displayStyle.mapLayerAtIndex(layerIdx, isOverlay);
                    if (layerSettings) {
                      layerSettings.status = MapLayerStatus.RequireAuth;
                    }
                  }
                }

                if (status === MapLayerSourceStatus.Valid) {
                  activeViewport.invalidateRenderPlan();
                  IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Info, `Map layer ${source.name} attached from URL: ${source.url}`));
                }

                setLoading(false);
                if (onLayerAttached)
                  onLayerAttached();
              } else {
                IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Error, `Invalid response from URL: ${mapLayerSettings.url}`));
                setLoading(false);
              }
            } catch (err) {
              setLoading(false);
              IModelApp.notifications.outputMessage(new NotifyMessageDetails(OutputMessagePriority.Error, "Error loading map layers", err.toString()));
            }
          }
        }
      }
      return;
    }

    if (layerNameToAdd) {
      attemptToAddLayer(layerNameToAdd); // eslint-disable-line @typescript-eslint/no-floating-promises
      setLayerNameToAdd(undefined);
    }
  }, [setLayerNameToAdd, layerNameToAdd, activeViewport, sources, backgroundLayers, isOverlay, overlayLayers, onLayerAttached]);

  const options = React.useMemo(() => sources?.filter((source) => !styleContainsLayer(source.name)).map((value) => value.name), [sources, styleContainsLayer]);
  const filteredOptions = React.useMemo(() => {
    if (undefined === sourceFilterString || 0 === sourceFilterString.length) {
      return options;
    } else {
      return options?.filter((option) => option.toLowerCase().includes(sourceFilterString?.toLowerCase()));
    }
  }, [options, sourceFilterString]);

  const handleModalUrlDialogOk = React.useCallback(() => {
    // close popop and refresh UI
    onLayerAttached();
  }, [onLayerAttached]);

  const handleAddNewMapSource = React.useCallback(() => {
    ModalDialogManager.openDialog(<MapUrlDialog isOverlay={isOverlay} onOkResult={handleModalUrlDialogOk} mapTypesOptions={mapTypesOptions} />);
    return;
  }, [handleModalUrlDialogOk, isOverlay, mapTypesOptions]);

  const handleAttach = React.useCallback((mapName: string) => {
    setLayerNameToAdd(mapName);
  }, []);

  const handleKeypressOnSourceList = React.useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
    const key = event.key;
    if (key === "Enter") {
      event.preventDefault();
      const mapName = event.currentTarget?.dataset?.value;
      if (mapName && mapName.length) {
        handleAttach(mapName);
      }
    }
  }, [handleAttach]);

  const onListboxValueChange = React.useCallback((mapName: string) => {
    setLayerNameToAdd(mapName);
  }, []);

  return (
    <div className="map-manager-header">
      {loading && <LoadingSpinner size={SpinnerSize.Medium} message={loadingMapSources} />}
      <div className="map-manager-source-listbox-header">
        <Input type="text" className="map-manager-source-list-filter"
          placeholder={placeholderLabel}
          value={sourceFilterString}
          onChange={handleFilterTextChanged} />
        <Button className="map-manager-add-source-button" buttonType={ButtonType.Hollow} title={addCustomLayerToolTip} onClick={handleAddNewMapSource}>
          {addCustomLayerLabel}</Button>
      </div>
      <div className="map-manager-sources">
        <Listbox id="map-sources" className="map-manager-source-list" onKeyPress={handleKeypressOnSourceList} onListboxValueChange={onListboxValueChange}  >
          {
            filteredOptions?.map((mapName) =>
              <ListboxItem key={mapName} className="map-source-list-entry" value={mapName}>
                <span className="map-source-list-entry-name" title={mapName}>{mapName}</span>
              </ListboxItem>)
          }
        </Listbox>
      </div>
    </div>

  );
}

/** @internal */
export enum AttachLayerButtonType {
  Primary,
  Blue,
  Icon
}
export interface AttachLayerPopupButtonProps {
  isOverlay: boolean;
  buttonType?: AttachLayerButtonType;
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function AttachLayerPopupButton(props: AttachLayerPopupButtonProps) {
  const [showAttachLayerLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:AttachLayerPopup.Attach"));
  const [hideAttachLayerLabel] = React.useState(MapLayersUiItemsProvider.i18n.translate("mapLayers:AttachLayerPopup.Close"));
  const [popupOpen, setPopupOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const togglePopup = React.useCallback(() => {
    setPopupOpen(!popupOpen);
  }, [popupOpen]);

  const handleClosePopup = React.useCallback(() => {
    setPopupOpen(false);
  }, []);

  const isOutsideEvent = React.useCallback((e: OutsideClickEvent) => {
    // if clicking on button that open panel - don't trigger outside click processing
    return !!buttonRef.current && (e.target instanceof Node) && !buttonRef.current.contains(e.target);
  }, []);

  const panelRef = useOnOutsideClick<HTMLDivElement>(handleClosePopup, isOutsideEvent);

  const { refreshFromStyle } = useSourceMapContext();

  const handleLayerAttached = React.useCallback(() => {
    setPopupOpen(false);
    refreshFromStyle();
  }, [refreshFromStyle]);

  function renderButton(): React.ReactNode {
    let button: React.ReactNode;

    if (props.buttonType === undefined || props.buttonType === AttachLayerButtonType.Icon) {
      button = (
        <button ref={buttonRef} className="map-manager-attach-layer-button" title={popupOpen ? hideAttachLayerLabel : showAttachLayerLabel}
          onClick={togglePopup}>
          <WebFontIcon iconName="icon-add" />
        </button>
      );
    } else {
      let typeClassName: string;
      switch (props.buttonType) {
        case AttachLayerButtonType.Blue:
          typeClassName = "uicore-buttons-blue";
          break;
        case AttachLayerButtonType.Primary:
        default:
          typeClassName = "uicore-buttons-primary";
          break;
      }
      button = (
        <button ref={buttonRef} className={typeClassName} title={popupOpen ? hideAttachLayerLabel : showAttachLayerLabel}
          onClick={togglePopup}>Add Layer</button>
      );
    }

    return button;
  }

  return (
    <>
      {renderButton()}
      <Popup
        isOpen={popupOpen}
        position={RelativePosition.BottomRight}
        onClose={handleClosePopup}
        target={buttonRef.current}
      >
        <div ref={panelRef} className="map-sources-popup-panel" >
          <AttachLayerPanel isOverlay={props.isOverlay} onLayerAttached={handleLayerAttached} />
        </div>
      </Popup >
    </>
  );
}
