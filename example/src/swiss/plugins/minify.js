import { addPlugin } from 'swiss-react';
import stylis from 'stylis';

addPlugin('parseRawCss', rawCss => stylis('', rawCss));