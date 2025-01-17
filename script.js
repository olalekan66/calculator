let inputfield = document.querySelector('#display');
let expression = '';

function handleInput(input, isKeyboard = false, event = null) {
  const validKeys = /[0-9+\-*/.]/;
  const calculatorKeys = new Set(['Enter', 'Backspace', 'Delete', '=']);

  if (isKeyboard && event) {
    // Explicitly ignore function keys
    if (event.key.startsWith('F')) {
      return;
    }

    // Only handle calculator-related keys
    if (!validKeys.test(event.key) && !calculatorKeys.has(event.key)) {
      return;
    }

    event.preventDefault();

    if (validKeys.test(input)) {
      expression += input === '*' ? 'x' : input;
    } else if (input === 'Delete') {
      expression = '';
    } else if (input === 'Backspace') {
      expression = expression.slice(0, -1);
    } else if ((input === 'Enter' || input === '=') && expression.trim() !== '') {
      expression = evaluate(expression);
    }
  } else {
    if (input === 'C') {
      expression = '';
    } else if (input === 'del') {
      expression = expression.slice(0, -1);
    } else {
      expression += input;
    }
  }

  inputfield.value = expression;
}

document.addEventListener('keydown', (event) => {
  handleInput(event.key, true, event);
});

const buttons = document.querySelectorAll('.button');
buttons.forEach(button =>
  button.addEventListener('click', () => {
    handleInput(button.textContent, false);
  })
);

function evaluate(expression) {
  try {
    const cleaned = expression.replace(/\s+/g, '').replace(/x/g, '*');
    const regex = /(\d*\.?\d+|\+|\-|\*|\/)/g;
    const tokens = cleaned.match(regex);

    if (!tokens) return 'Error';

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '-' && (i === 0 || ['*', '/', '+', '-'].includes(tokens[i - 1]))) {
        tokens[i] += tokens[i + 1];
        tokens.splice(i + 1, 1);
      }
    }

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '*' || tokens[i] === '/') {
        let x = parseFloat(tokens[i - 1]);
        let y = parseFloat(tokens[i + 1]);
        if (tokens[i] === '/' && y === 0) return 'Error: Division by zero';
        const result = tokens[i] === '*' ? x * y : x / y;
        tokens.splice(i - 1, 3, result.toString());
        i -= 1;
      }
    }

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '+' || tokens[i] === '-') {
        let x = parseFloat(tokens[i - 1]);
        let y = parseFloat(tokens[i + 1]);
        const result = tokens[i] === '+' ? x + y : x - y;
        tokens.splice(i - 1, 3, result.toString());
        i -= 1;
      }
    }

    return tokens[0];
  } catch {
    return 'Error';
  }
}

document.querySelector('.callback').addEventListener('click', () => {
  if (expression.trim() !== '') {
    expression = evaluate(expression);
    inputfield.value = expression;
  } else {
    expression = '';
  }
});
