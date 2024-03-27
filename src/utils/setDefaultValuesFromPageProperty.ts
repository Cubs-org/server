import { PageProperty } from '../types/pagesTypes';
import { today } from './today';

export const setDefaultValuesFromPageProperty = (
    {type, data}:{ type: string, data: PageProperty['data'] } = { type: '', data: {loadOrder:0} }
) => {

    let title;

    switch (type) {
        case 'text':
            title = 'Texto';
            data.value = '';
            break;
        case 'number':
            title = 'Número';
            data.value = 0;
            break;
        case 'datetime':
            title = 'Data';
            data.start = today();
            data.end = today();
            break;
        case 'checkbox':
            title = 'Caixa de seleção';
            data.value = false;
            break;
        case 'selection':
            title = 'Seleção';
            data.value = '';
            data.items = [];
            break;
        case 'multi_selection':
            title = 'Multi-seleção';
            data.tags = [];
            data.items = [];
            break;
        case 'relation':
            title = 'Relação';
            break;
        case 'rollup':
            title = 'Herança';
            break;
        case 'formula':
            title = 'Fórmula';
            data.value = '';
            break;
        case 'assign':
            title = 'Membros';
            data.value = '';
            break;
        default:
            title = 'Text';
            data.value = '';
            break;
    }

    return {
        title: title,
        data: data ? data : {}
    }
};