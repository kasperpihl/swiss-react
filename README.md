- [] Describe why this library exists
- [] General syntax
- [] Show props concept (default, active etc)
- [] Selectors (&, :hover parent ref example)
- [] @media example
- [] @keyframes example
- [] Show mixins

Keep relevance to react and component based usage


 default : {
    'width': '100px',
    'height': '100px',
    'background': 'red',
    'animation': 'example 5s linear 2s infinite alternate',
    '@keyframes example': {
      'from': {
        'transform': 'rotate(0deg)'
      },
      'to': {
        'transform': 'rotate(360deg)'
      }
    },
    '& + &': {
      'background': 'green',
    },
    ':hover': {

    },
    '& ~ #{siblingRef}': {
      'background': 'purple',
    },
    '& > #{siblingRef}': {
      'background': 'yellow',
    },
    '& #{siblingRef}': {
      'background': 'pink',
    },
    '&:not(& + #{siblingRef})': {
      'color': 'darkblue',
    },
    '&::placeholder': {
      'color': 'green',
    }
  },
  small: {
    'width': '50px',
    'height': '50px',
    'background': 'green',

    '& ~ #{siblingRef}': {
      'background': 'gray',
    },
  }
});

<style>
  .view {
    width: 100px;
    height: 100px;
    background: red;
    animation: example 5s linear 2s infinite alternate;
  }

  .view + .view {
    background: green;
  }

  .view ~ .siblingRef {
    background: purple;
  }

  .view > .siblingRef {
    background: yellow;
  }

  .view .siblingRef {
    background: pink;
  }

  .view:not(.view + .siblingRef) {
    color: darkblue;
  }

  .view::placeholder {
    color: green;
  }

  @keyframes example {
   from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(360deg)
    }
  }

  @media (max-width: 600px) {
    .view {
      width: 600px;
    }
  }

  .view.small {
    width: 50px;
    height: 50px;
    background: green;
  }

  .view.small ~ .siblingRef {
    background: gray;
  }
</style>