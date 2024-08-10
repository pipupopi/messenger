import { format } from 'date-fns';
import { FORMAT_DATE_PARAMETRES, MAX_NAME_LENGTH } from './utils/const';

export function checkValidateName(name: string) {
    return name.length >= MAX_NAME_LENGTH;
}

export function convertDate(date: string) {
    return format(new Date(date), FORMAT_DATE_PARAMETRES);
}
