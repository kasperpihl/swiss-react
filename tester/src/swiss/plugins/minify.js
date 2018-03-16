import { addPlugin } from 'react-swiss';
import stylis from 'stylis';

addPlugin('parseRawCss', rawCss => stylis('', rawCss));