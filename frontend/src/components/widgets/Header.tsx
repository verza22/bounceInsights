import React from "react";
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';
import { useTranslation } from "react-i18next";

interface HeaderProps {
    type: WidgetType,
    id: number,
    onClick: (id: number) => void
}

const Header: React.FC<HeaderProps> = ({type, id, onClick}) => {

    const { t } = useTranslation();

    return <div className="flex">
        <div className="text-center flex-1">{t(type)}</div>
        <div className="header-icons">
            <div title="Refresh" onClick={()=> onClick(id)}>
                <Icon path={mdiRefresh} className="cursor-pointer" size={1.4} />
            </div>
        </div>
    </div>
}

export default Header;