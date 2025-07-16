import React from 'react';
import { DateRangePickerComponent, RangeEventArgs } from '@syncfusion/ej2-react-calendars';
import { useTranslation } from 'react-i18next';

import { useDateStore } from '../store/useDateStore';
import { formatDate, strFormatDate } from '../utils/utils';

const DateRangeSelector: React.FC = () => {
    const { dateFrom, dateTo, updateDateFrom, updateDateTo } = useDateStore();
    const { i18n, t } = useTranslation();
    const lang = i18n.language.split('-')[0]

    const handleDateChange = (e: RangeEventArgs) => {
        if (e.startDate && e.endDate) {
        updateDateFrom(formatDate(e.startDate));
        updateDateTo(formatDate(e.endDate));
        }
    };

    return <DateRangePickerComponent
        placeholder={t('dateRange')}
        change={handleDateChange}
        startDate={strFormatDate(dateFrom)}
        endDate={strFormatDate(dateTo)}
        locale={lang}
    />
};

export default DateRangeSelector;