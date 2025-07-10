import React from "react";
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';

interface HeaderProps {
    title: string,
    id: number,
    onClick: (id: number) => void
}

const Header: React.FC<HeaderProps> = ({title, id, onClick}) => {

    return <div className="flex">
        <div className="text-center flex-1">{title}</div>
        <div className="header-icons">
            <div title="Refresh" onClick={()=> onClick(id)}>
                <Icon path={mdiRefresh} className="cursor-pointer" size={1.4} />
            </div>
        </div>
    </div>
}

export default Header;