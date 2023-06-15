import jsonServerProvider from 'ra-data-json-server';

export const dataProvider = jsonServerProvider(
    'http://3.38.118.228:8080/api/home'
);
