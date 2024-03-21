import { PageProperty } from '../types/pagesTypes';

export const setDefaultValuesFromPageProperty = (pageProperties: PageProperty) => {

    const { type, data } = pageProperties;

    let title;

    switch (type) {
        case 'text':
            title = 'Texto';
            break;
        case 'number':
            title = 'Número';
            break;
        case 'datetime':
            title = 'Data';
            break;
        case 'checkbox':
            title = 'Caixa de seleção';
            break;
        case 'selection':
            title = 'Seleção';
            break;
        case 'multi_selection':
            title = 'Multi-seleção';
            break;
        case 'relation':
            title = 'Relação';
            break;
        case 'rollup':
            title = 'Herança';
            break;
        case 'formula':
            title = 'Fórmula';
            break;
        case 'assign':
            title = 'Membros';
            break;
        default:
            title = 'Text';
            break;
    }

    return {
        ...pageProperties,
        title: title,
        data: data ? data : {}
    }
};