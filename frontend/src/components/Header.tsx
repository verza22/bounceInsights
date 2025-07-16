import React from "react";
import { useState, useRef, useEffect } from "react";

import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { MenuComponent, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-react-navigations';

import { useTranslation } from "react-i18next";
import Icon from '@mdi/react';
import { mdiContentSave, mdiPencil, mdiFlare, mdiUfo, mdiSunWireless, mdiLightningBoltCircle, mdiWeatherCloudy, mdiCamera, mdiCheckboxMarkedCircleAutoOutline } from '@mdi/js';

import { useAppStore } from "../store/useAppStore";
import { useWidgetStore } from "../store/useWidgetStore";

import DateRangeSelector from "./DateRangeSelector";
import ErrorBoundary from "./ErrorBoundary";
import i18n from "../i18n";
import { getLanguagues } from "./../utils/utils";
const nasaLogo = new URL('./../assets/nasa.png', import.meta.url).href;

interface HeaderProps {
    addWidgetToLayout: (widget: Widget) => void,
    changeLayout: (widgets: Widget[]) => void
}

const Header: React.FC<HeaderProps> = ({ addWidgetToLayout, changeLayout }) => {

    const { editMode, updateEditMode } = useAppStore();
    const { widgets, addWidget } = useWidgetStore();
    const { t } = useTranslation();
    const { updateLang } = useAppStore();
    const currentLang = i18n.language;

    const lineObj = useRef<HTMLDivElement>(null);

    const [display, setDisplay] = useState<'none' | 'block'>(editMode ? 'block' : 'none');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    let menuItems: MenuItemModel[] = [
        {
            text: t('options'),
            iconCss: 'e-icons e-settings',
            items: [
                {
                    text: t('language'),
                    items: getLanguagues().map(l=> ({ text: t(l), id: 'lan_'+l, iconCss: currentLang === l ? 'e-icons e-check' : '' }))
                },
                {
                    text: t('layout'),
                    items: [
                        { text: t('small'), id: 'lay_sm'  },
                        { text: t('medium'), id: 'lay_md'  },
                        { text: t('large'), id: 'lay_lg'  },
                    ]
                },
            ]
        }
    ];

    const btnClick = () => {
        if (editMode) {
            setDisplay("none");
        } else {
            setDisplay("block");
        }
        updateEditMode(!editMode);
    };

    const dlgClick = () => {
        setIsVisible(true);
        if (lineObj.current) {
            lineObj.current.onclick = (e) => {
                const type: WidgetType = (e.srcElement as HTMLElement).getAttribute("data-type") as WidgetType ?? "apod";

                const maxId = widgets.reduce((max, w) => Math.max(max, w.id), -1);
                const maxRow = widgets.reduce((max, w) => Math.max(max, w.row), -1);

                const newWidget: Widget = {
                    id: maxId + 1,
                    type: type,
                    sizeX: 2,
                    sizeY: 2,
                    row: maxRow + 2,
                    col: 0,
                };

                addWidget(newWidget); //add to store
                addWidgetToLayout(newWidget);//add to layout
                setIsVisible(false);
            };
        }
    };

    const content = () => (
        <div id="dialogcontent">
            <div>
                <div id="apodtemplate" ref={lineObj}>
                    <p className="dialog-text" data-type="apod"><Icon path={mdiFlare} size={1} className="my-auto mr-2" />{t('apod')}</p>
                    <p className="dialog-text" data-type="neo"><Icon path={mdiUfo} size={1} className="my-auto mr-2" />{t('neo')}</p>
                    <p className="dialog-text" data-type="cme"><Icon path={mdiSunWireless} size={1} className="my-auto mr-2" />{t('cme')}</p>
                    <p className="dialog-text" data-type="gst"><Icon path={mdiLightningBoltCircle} size={1} className="my-auto mr-2" />{t('gst')}</p>
                    <p className="dialog-text" data-type="insight"><Icon path={mdiWeatherCloudy} size={1} className="my-auto mr-2" />{t('insight')}</p>
                    <p className="dialog-text" data-type="curiosity"><Icon path={mdiCamera} size={1} className="my-auto mr-2" />{t('curiosity')}</p>
                    <p className="dialog-text" data-type="quiz"><Icon path={mdiCheckboxMarkedCircleAutoOutline} size={1} className="my-auto mr-2" />{t('quiz')}</p>
                </div>
            </div>
        </div>
    );

    const selectOption = (e: MenuEventArgs) => {
        let id = e.item.id ?? "";
        if (id.startsWith("lan_")) {
            id = id.replace("lan_", "");
            updateLang(id);
        }else{
            let widgets: Widget[] = [];
            switch(e.item.id){
                case "lay_sm":
                    widgets = [
                        { id: 0, type: "apod", sizeX: 1, sizeY: 1, row: 1, col: 0 },
                        { id: 1, type: "quiz", sizeX: 1, sizeY: 1, row: 1, col: 1 },
                        { id: 2, type: "neo", sizeX: 1, sizeY: 1, row: 0, col: 2 },
                        { id: 3, type: "cme", sizeX: 1, sizeY: 1, row: 0, col: 0 },
                        { id: 4, type: "gst", sizeX: 1, sizeY: 1, row: 0, col: 3 },
                        { id: 5, type: "insight", sizeX: 1, sizeY: 1, row: 0, col: 1 },
                        { id: 6, type: "curiosity", sizeX: 2, sizeY: 1, row: 1, col: 2 }
                    ];
                    changeLayout(widgets);
                break;
                case "lay_md":
                    widgets = [
                        { id: 0, type: "apod", sizeX: 2, sizeY: 2, row: 0, col: 0 },
                        { id: 1, type: "quiz", sizeX: 2, sizeY: 2, row: 0, col: 2 },
                        { id: 2, type: "neo", sizeX: 2, sizeY: 1, row: 2, col: 0 },
                        { id: 3, type: "cme", sizeX: 2, sizeY: 1, row: 3, col: 0 },
                        { id: 4, type: "gst", sizeX: 2, sizeY: 1, row: 2, col: 2 },
                        { id: 5, type: "insight", sizeX: 2, sizeY: 1, row: 3, col: 2 },
                        { id: 6, type: "curiosity", sizeX: 4, sizeY: 2, row: 4, col: 0 }
                    ];
                    changeLayout(widgets);
                break;
                case "lay_lg":
                    widgets = [
                        { id: 0, type: "apod", sizeX: 2, sizeY: 2, row: 0, col: 0 },
                        { id: 1, type: "quiz", sizeX: 2, sizeY: 2, row: 0, col: 2 },
                        { id: 2, type: "neo", sizeX: 2, sizeY: 2, row: 2, col: 0 },
                        { id: 3, type: "cme", sizeX: 2, sizeY: 2, row: 2, col: 2 },
                        { id: 4, type: "gst", sizeX: 2, sizeY: 2, row: 4, col: 0 },
                        { id: 5, type: "insight", sizeX: 2, sizeY: 2, row: 4, col: 2 },
                        { id: 6, type: "curiosity", sizeX: 2, sizeY: 2, row: 6, col: 0 }
                    ];
                    changeLayout(widgets);
                break;
            }
        }

    }


    return <ErrorBoundary>
        <div>
            <div className="flex items-center justify-between px-6 bg-gradient-to-r from-black via-gray-900 to-black shadow-md">
                <div className="flex items-center">
                    <img
                        src={nasaLogo}
                        alt="NASA API"
                        className="h-20 w-auto"
                    />
                    <div className="ml-6">
                        <DateRangeSelector />
                    </div>
                </div>
                <div className="flex">
                    <button
                        onClick={btnClick}
                        className={`btn-base ${editMode ? '' : 'btn-outline'}`}
                    >
                        <Icon path={editMode ? mdiContentSave : mdiPencil} size={1} className="my-auto mr-2" /> {editMode ? t('save') : t('edit')}
                    </button>
                    <MenuComponent items={menuItems} className="btn-base btn-outline" select={selectOption}></MenuComponent>
                </div>
            </div>
            <div style={{ padding: "5px", marginBottom: "5px", textAlign: "end" }}>
                <div
                    id="dialogBtn"
                    className="add-widget-button e-control e-btn e-lib"
                    style={{ display: display }}
                    onClick={dlgClick}
                >
                    {t('addWidget')}
                </div>
            </div>
        </div>
        {
            isVisible &&
            <DialogComponent
                id="listdialog"
                width="500px"
                header={t('addWidget')}
                showCloseIcon={true}
                animationSettings={{ effect: 'Zoom' }}
                isModal={true}
                target='#edit_target'
                content={content}
                close={()=> setIsVisible(false)}
                locale={i18n.language.split('-')[0]}
            />
        }
    </ErrorBoundary>
}

export default Header;