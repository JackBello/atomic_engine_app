import { DateTime } from "luxon";

export const timeAgo = (message: string, dateString: string) => {
    const savedDate = DateTime.fromFormat(dateString, 'yyyy-LL-d HH:mm:ss');

    const now = DateTime.now();

    const diff = now.diff(savedDate, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject();

    if (diff.years && diff.years >= 1) {
        return `${message} ${Math.floor(diff.years)} year${diff.years >= 2 ? 's' : ''} ago`;
    }
    if (diff.months && diff.months >= 1) {
        return `${message} ${Math.floor(diff.months)} month${diff.months >= 2 ? 's' : ''} ago`;
    }
    if (diff.days && diff.days >= 1) {
        return `${message} ${Math.floor(diff.days)} day${diff.days >= 2 ? 's' : ''} ago`;
    }
    if (diff.hours && diff.hours >= 1) {
        return `${message} ${Math.floor(diff.hours)} hour${diff.hours >= 2 ? 's' : ''} ago`;
    }
    if (diff.minutes && diff.minutes >= 1) {
        return `${message} ${Math.floor(diff.minutes)} minute${diff.minutes >= 2 ? 's' : ''} ago`;
    }

    return `${message} just now`;
}

export const compareTime = (dateOneString: string, dateTwoString: string) => {
    const formatDateOne = DateTime.fromFormat(dateOneString, 'yyyy-LL-d HH:mm:ss');
    const formatDateTwo = DateTime.fromFormat(dateTwoString, 'yyyy-LL-d HH:mm:ss');

    return formatDateOne > formatDateTwo
}

export const getDateNow = () => {
    const now = DateTime.now();
    const format = `${now.year}-${now.month}-${now.day} ${now.hour}:${now.minute}:${now.second}`

    return format
}