/*
 Inspired by https://soulwire.co.uk/
*/

const HyperText = el => {
	// Some configuration variables
  const START = 0;
  const END = 35;
  const STAGGER = 1.65;
  const RANDOM_CHAR = 0.25;
  const LINE_DELAY = 100;

	// Internal Text handler
  const _HyperText = el => {
    let frame = 0;

    const randomChar = () => {
      const chars = '!<>-_\\/[]{}—=+*^?#-----------------------------------------------------------------------------------------------';

      return chars[Math.floor(Math.random() * chars.length)]
    };

    const getScript = text => {
      return text.split('').reduce((arr, char, indx) => {
        const start = Math.floor(Math.random() * START) + (indx * STAGGER);
        const stop = start + Math.floor(Math.random() * END);

        arr.push({
          char,
          start,
          stop
        });

        return arr;
      }, []);
    };

    const animate = args => {
      let complete = 0;

      let {
        el,
        scripts,
        frame
      } = args;

      let output = scripts.reduce((html, script, indx) => {
        let {
          char,
          start,
          stop,
          currentChar
        } = script;

        if (frame >= stop) {
          complete++;
          html += char;
        } else if (frame >= start) {
          if (!currentChar || Math.random() < RANDOM_CHAR) {
            currentChar = randomChar();
            scripts[indx].currentChar = currentChar;
          }

          html += `<span class='d'>${currentChar}</span>`;
        } else {
          html += '';
        }

        return html;
      }, '');

      el.innerHTML = output;

      if (complete === scripts.length) {
        cancelAnimationFrame(raf);
      } else {
        frame++;
        raf = requestAnimationFrame(() => animate({
          el,
          scripts,
          frame
        }))
      }
    };

    const scripts = getScript(el.innerText);

    el.classList.add('active');

    let raf = requestAnimationFrame(() => animate({
      el,
      scripts,
      frame
    }));

    return true;
  }

  const getEachLine = text => {
    let newText = text.innerHTML.replace(/(\S+\s*)/g, '<span>$1</span>');
    text.innerHTML = newText;

    let spans = text.querySelectorAll('span');

    const consolidateWordsIntoLine = words => {
      let container = document.createElement('span');
      container.classList.add('text-wrap');

      return Array.from(words).reduce((line, span) => {
        line.innerText += span.innerText;

        return line;
      }, container);
    };

    const groupWordsByOffset = words => {
      return Array.from(words).reduce((map, word) => {
        let offset = word.offsetTop;

        if (!map.has(offset)) {
          map.set(offset, []);
        }

        map.get(offset).push(word);

        return map;
      }, new Map());
    };

    let wordMap = groupWordsByOffset(spans);

    text.innerHTML = '';

    wordMap.forEach(row => {
      let line = consolidateWordsIntoLine(row);

      text.appendChild(line)
    });

    return document.querySelectorAll('.text-wrap');
  };

  const eachLine = getEachLine(el);
  
  let delay = 0;
  
  return Array.from(eachLine).map(line => {
		delay += LINE_DELAY;
    return setTimeout(() => _HyperText(line), delay);
  });
}

let text = document.querySelector('.text');

HyperText(text);