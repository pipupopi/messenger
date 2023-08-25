import { format } from 'date-fns';
import { MAX_NAME_LENGTH } from './utils/const';

export function checkValidateName(name: string) {
    return name.length >= MAX_NAME_LENGTH;
}

export function convertDate(date: string) {
    return format(new Date(date), 'H:mm');
}