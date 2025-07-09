import React from 'react';
import { DateRangePickerComponent, RangeEventArgs } from '@syncfusion/ej2-react-calendars';
import { useDateStore } from './store/useDateStore';
import { formatDate, strFormatDate } from '../utils/utils';

const DateRangeSelector: React.FC = () => {
    const { dateFrom, dateTo, updateDateFrom, updateDateTo } = useDateStore();

    const handleDateChange = (e: RangeEventArgs) => {
        if (e.startDate && e.endDate) {
        updateDateFrom(formatDate(e.startDate));
        updateDateTo(formatDate(e.endDate));
        }
    };

    return (
        <div className="max-w-md mx-auto mt-4">
        <label className="block mb-2 font-semibold">Select Date Range:</label>
        <DateRangePickerComponent
            placeholder="Select a range"
            change={handleDateChange}
            startDate={strFormatDate(dateFrom)}
            endDate={strFormatDate(dateTo)}
        />
        </div>
    );
};

export default DateRangeSelector;