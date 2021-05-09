import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import React from 'react';

const parseKatex = latexRaw => {
  if (Object.prototype.toString.call(latexRaw) !== '[object String]') {
    return <div></div>;
  }
  var stringSegments = [];
  for (var i = 0; i < latexRaw.length; i++) {
    var currChar = latexRaw[i];
    if (currChar !== '$') {
      stringSegments.push(currChar);
    } else {
      var currString = '';
      var complete = false;
      while (i + 1 < latexRaw.length) {
        i = i + 1;
        currChar = latexRaw[i];
        if (currChar === '$') {
          stringSegments.push(<InlineMath key={i}>{currString}</InlineMath>);
          complete = true;
          i = i + 1;
          break;
        } else {
          currString += currChar;
        }
      }
      if (!complete) {
        stringSegments.push('$' + currString);
      }
    }
  }
  return stringSegments;
};

export { parseKatex };
