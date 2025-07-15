import React from "react";
import { useState, useRef, useEffect } from "react";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useTranslation } from "react-i18next";

import { useAppStore } from "../store/useAppStore";
import { useWidgetStore } from "../store/useWidgetStore";

import DateRangeSelector from "./DateRangeSelector";
import LanguageSwitcher from "./LanguageSwitcher";
import ErrorBoundary from "./ErrorBoundary";
const nasaLogo = new URL('./../assets/nasa.png', import.meta.url).href;

interface HeaderProps {
    addWidgetToLayout: (widget: Widget) => void
}

const Header: React.FC<HeaderProps> = ({addWidgetToLayout}) => {

    const { editMode, updateEditMode } = useAppStore();
    const { widgets, addWidget } = useWidgetStore();
    const { t } = useTranslation();

    const lineObj = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isResizing, setResizing] = useState<boolean>(false);
    const [icon, setIcon] = useState<string>('edit');
    const [display, setDisplay] = useState<'none' | 'block'>('none');
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const btnClick = () => {
        if (editMode) {
            // setIsDragging(false);
            // setResizing(false);
            // setIcon("edit");
            setDisplay("none");
        } else {
            // setIsDragging(true);
            // setResizing(true);
            // setIcon("save");
            setDisplay("block");
        }
        updateEditMode(!editMode);
    };

    const getTitle = (type:WidgetType) => {
        return t(type);
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
                    title: getTitle(type),
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
                    <p className="dialog-text cursor-pointer" data-type="apod">{t('apod')}</p>
                    <p className="dialog-text cursor-pointer" data-type="neo">{t('neo')}</p>
                    <p className="dialog-text cursor-pointer" data-type="cme">{t('cme')}</p>
                    <p className="dialog-text cursor-pointer" data-type="gst">{t('gst')}</p>
                    <p className="dialog-text cursor-pointer" data-type="insight">{t('insight')}</p>
                    <p className="dialog-text cursor-pointer" data-type="curiosity">{t('curiosity')}</p>
                    <p className="dialog-text cursor-pointer" data-type="quiz">{t('quiz')}</p>
                </div>
            </div>
        </div>
    );


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
                <div>
                    <button
                        onClick={btnClick}
                        className={`btn-base ${editMode ? '' : 'btn-outline'}`}
                    >
                        {editMode ? t('save') : t('edit')}
                    </button>
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
        <DialogComponent
            id="listdialog"
            width="500px"
            visible={isVisible}
            header={t('addWidget')}
            showCloseIcon={true}
            animationSettings={{ effect: 'Zoom' }}
            isModal={true}
            target='#edit_target'
            content={content}
        />
    </ErrorBoundary>
}

export default Header;