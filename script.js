let fullOp = '';
let res = 0;

function handleClick(number){
    fullOp = fullOp + number;
    showNumber(fullOp);
}

function showNumber(n){
    const screen = document.getElementById("screen");
    if (screen) {
        screen.innerHTML = n;
    }
}

function erase(){
    const screen = document.getElementById("screen");
    if (screen) {
        screen.innerHTML = '';
    }
    fullOp = '';
}

function calculate(){
    console.log({fullOp});
    let expression = fullOp;
    let negativeStart = false;

    if (expression.startsWith('-')) {
        negativeStart = true;
        expression = expression.substring(1);
    }

    let a, op, b;
    const match = expression.match(/^([0-9.]+)([+\/x\^-])(-?[0-9.]+)$/);

    if (!match) {
        return;
    }

    a = match[1];
    op = match[2];
    b = match[3];

    let numA = Number(a);
    let numB = Number(b);

    if (negativeStart) {
        numA = -numA;
    }

    console.log({numA, op, numB});

    switch(op){
        case "+":
            res = numA + numB;
            break;
        case "-":
            res = numA - numB;
            break;
        case "/":
            res = numA / numB;
            break;
        case "x":
            res = numA * numB;
            break;
        case "^":
            res = numA ** numB;
            break;
        default:
            return;
    }

    saveToHistory(fullOp, res);

    showNumber(res);
    fullOp = res.toString();
}

function handleOperator(op) {
    const operators = ['+', '-', '/', 'x', '^'];

    if (fullOp === '' && op === '-') {
        fullOp += op;
        showNumber(fullOp);
        return;
    }

    if (fullOp === '-') {
        return;
    }

    if (op === '.') {
        if (fullOp === '') {
            return;
        }

        const lastChar = fullOp[fullOp.length - 1];
        if (operators.includes(lastChar)) {
            return;
        }

        let currentNumber = '';
        for (let i = fullOp.length - 1; i >= 0; i--) {
            if (operators.includes(fullOp[i])) {
                break;
            }
            currentNumber = fullOp[i] + currentNumber;
        }

        if (currentNumber.includes('.')) {
            return;
        }

        fullOp += '.';
        showNumber(fullOp);
        return;
    }

    const lastChar = fullOp[fullOp.length - 1];

    if (op === '-' && operators.includes(lastChar) && lastChar !== '-') {
        fullOp += op;
        showNumber(fullOp);
        return;
    }

    let expressionToCheck = fullOp;
    if (fullOp.startsWith('-')) {
        expressionToCheck = expressionToCheck.substring(1);
    }

    const match = expressionToCheck.match(/^([0-9.]+)([+\/x\^-])(-?[0-9.]*)$/);

    if (match) {
        return;
    }

    if (!operators.includes(lastChar) && fullOp !== '') {
        fullOp += op;
        showNumber(fullOp);
    }
}

function saveToHistory(expression, result){
    let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    const now = new Date();
    const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    history.unshift({
        time: time,
        title: getOperationTitle(expression),
        expression: expression,
        result: result
    });

    localStorage.setItem("calculatorHistory", JSON.stringify(history));
}

function getOperationTitle(expression){
    if (expression.includes("^")) return "Exponent Operation";
    if (expression.includes("x")) return "Multiplication Operation";
    if (expression.includes("/")) return "Division Operation";
    if (expression.includes("+")) return "Addition Operation";

    const cleanExpression = expression.startsWith('-') ? expression.substring(1) : expression;
    if (cleanExpression.includes("-")) return "Subtraction Operation";

    return "General Calculation";
}

function renderHistory(){
    const historyContainer = document.getElementById("historyContainer");
    if (!historyContainer) {
        return;
    }

    const history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                No operations saved yet.
            </div>
        `;
        return;
    }

    historyContainer.innerHTML = history.map(item => `
        <div class="history-card">
            <div class="history-meta">
                <span class="meta-dot"></span>
                <span>${item.time}</span>
                <span>•</span>
                <span>${item.title}</span>
            </div>

            <div class="history-result-line">
                <span class="history-expression">${item.expression}</span>
                <span class="history-equal">=</span>
                <span class="history-result">${item.result}</span>
            </div>
        </div>
    `).join('');
}

function clearHistory(){
    localStorage.removeItem("calculatorHistory");
    renderHistory();
}

document.addEventListener("DOMContentLoaded", function(){
    renderHistory();
});