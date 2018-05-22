import { addGlobalStyles } from 'swiss-react';

addGlobalStyles({
  '@import': 'url(\'https://fonts.googleapis.com/css?family=Anton|Overpass+Mono:700\')',
  '*,*:after,*:before,a,button,canvas,g,h1,h2,h3,h4,h5,h6,image,img,input,li,p,path,svg,ul,textarea,blockquote': {
    backgroundColor: 'transparent',
    border: 'none',
    boxSizing: 'border-box',
    cursor: 'default',
    fontFamily: '\'Aktiv-Grotesk\', Helvetica, Arial, sans-serif',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    textDecoration: 'none',
    position: 'relative',
  },
  'textarea::-webkit-input-placeholder, input::-webkit-input-placeholder': {
    fontFamily: 'inherit',
  },
  'button:focus,input:focus,textarea:focus,button:active,input:active,textarea:active': {
    border: 0,
    outline: 0,
    outlineOffset: 0,
  },
  'img': {
    display: 'block',
  },
  'html, body, #content': {
    height: '100%',
  },
  '@font-face': [
    {
      src: 'url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/170179/Aktiv-Grotesk-Regular.woff\') format(\'woff\')',
      fontFamily: 'Aktiv-Grotesk',
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      src: 'url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/170179/Aktiv-Grotesk-Italic.woff\') format(\'woff\')',
      fontFamily: 'Aktiv-Grotesk',
      fontWeight: 400,
      fontStyle: 'italic',
    },
    {
      src: 'url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/170179/Aktiv-Grotesk-Medium.woff\') format(\'woff\')',
      fontFamily: 'Aktiv-Grotesk',
      fontWeight: 500,
      fontStyle: 'normal',
    },
    {
      src: 'url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/170179/Aktiv-Grotesk-MediumItalic.woff\') format(\'woff\')',
      fontFamily: 'Aktiv-Grotesk',
      fontWeight: 500,
      fontStyle: 'italic',
    },
    {
      src: 'url(\'https://s3-us-west-2.amazonaws.com/s.cdpn.io/170179/Aktiv-Grotesk-Bold.woff\') format(\'woff\')',
      fontFamily: 'Aktiv-Grotesk',
      fontWeight: 700,
      fontStyle: 'regular',
    },
  ]
});
