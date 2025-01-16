let inputfield = document.querySelector('#display');
let expression = ''; 

const buttons = document.querySelectorAll('.button');
buttons.forEach(button => button.addEventListener('click', () => {
    let input = button.textContent;
    if (input === 'C'){
        expression = '';
    }
    else if(input === 'del'){
        expression = expression.slice(0, -1);
    }
    else {
            expression += input;
        }
    inputfield.value = expression;
})
);

function evaluate(expression) {
    const cleaned = expression.replace(/\s+/g, '');
    const regex = /(\d*\.?\d+|\+|\-|\x|\/)/g;
    const tokens = cleaned.match(regex);
    for (let i = 0; i < tokens.length; i++){
        if (tokens[i] === '-' && ( i === 0 || ['x', '/', '+', '-'].includes(tokens[i - 1]))) {
            tokens[i] += tokens[i + 1];
            tokens.splice(i + 1, 1);
        }
    }
    for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === 'x' || tokens[i] === '/') {
            let x = parseFloat(tokens[i - 1]);
            let y = parseFloat(tokens[i + 1]);
            if (tokens[i] === '/' && y === 0) { return 'Error: Division by zero'; }
            const result = tokens[i] === 'x' ? x * y : x / y;
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
};

const eqaulizer = document.querySelector('.callback').addEventListener('click', () => {
    if (expression.trim() !== '') {
        expression = evaluate(expression);
        inputfield.value = expression;
    } else {
        expression = '';
    }
});
