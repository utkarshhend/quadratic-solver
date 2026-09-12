// ---------- Get Elements ----------

const aInput = document.getElementById("a");
const bInput = document.getElementById("b");
const cInput = document.getElementById("c");

const solveBtn = document.getElementById("solveBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const result = document.getElementById("result");
const error = document.getElementById("error");

const discriminant = document.getElementById("discriminant");

const root1 = document.getElementById("root1");
const root2 = document.getElementById("root2");

const rootType = document.getElementById("rootType");


// ---------- Format Number ----------

function formatNumber(number) {

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return Number(number.toFixed(6)).toString();
}


// ---------- Show Error ----------

function showError(message) {

    error.textContent = message;

    result.classList.remove("show");
}


// ---------- Solve Equation ----------

function solveQuadratic() {

    error.textContent = "";

    const a = Number(aInput.value);
    const b = Number(bInput.value);
    const c = Number(cInput.value);


    // Check empty inputs

    if (
        aInput.value === "" ||
        bInput.value === "" ||
        cInput.value === ""
    ) {
        showError("Please enter values for a, b and c.");
        return;
    }


    // Check if a = 0

    if (a === 0) {
        showError(
            "'a' cannot be 0. Please enter a quadratic equation."
        );

        return;
    }


    // Calculate discriminant

    const D = b * b - 4 * a * c;

    discriminant.textContent = formatNumber(D);


    // Two real roots

    if (D > 0) {

        const x1 =
            (-b + Math.sqrt(D)) / (2 * a);

        const x2 =
            (-b - Math.sqrt(D)) / (2 * a);


        root1.textContent = formatNumber(x1);

        root2.textContent = formatNumber(x2);

        rootType.textContent = "2 Real Roots";

    }


    // One repeated root

    else if (D === 0) {

        const x =
            -b / (2 * a);


        root1.textContent = formatNumber(x);

        root2.textContent = formatNumber(x);

        rootType.textContent = "1 Real Root";

    }


    // Complex roots

    else {

        const real =
            -b / (2 * a);

        const imaginary =
            Math.sqrt(-D) / Math.abs(2 * a);


        root1.textContent =
            `${formatNumber(real)} + ${formatNumber(imaginary)}i`;

        root2.textContent =
            `${formatNumber(real)} - ${formatNumber(imaginary)}i`;

        rootType.textContent = "Complex Roots";
    }


    // Show result

    result.classList.add("show");
}


// ---------- Clear ----------

function clearAll() {

    aInput.value = "";
    bInput.value = "";
    cInput.value = "";

    error.textContent = "";

    result.classList.remove("show");

    discriminant.textContent = "—";

    root1.textContent = "—";
    root2.textContent = "—";

    rootType.textContent = "";

    aInput.focus();
}


// ---------- Copy Results ----------

function copyResults() {

    const text = `
Quadratic Equation Solver

Equation:
${aInput.value}x² + ${bInput.value}x + ${cInput.value} = 0

Discriminant: ${discriminant.textContent}

x₁ = ${root1.textContent}
x₂ = ${root2.textContent}
`.trim();


    navigator.clipboard.writeText(text)
        .then(() => {

            const originalText =
                copyBtn.textContent;

            copyBtn.textContent =
                "✓ Copied!";

            setTimeout(() => {

                copyBtn.textContent =
                    originalText;

            }, 1500);

        })
        .catch(() => {

            copyBtn.textContent =
                "Copy failed";

        });
}


// ---------- Button Events ----------

solveBtn.addEventListener(
    "click",
    solveQuadratic
);


clearBtn.addEventListener(
    "click",
    clearAll
);


copyBtn.addEventListener(
    "click",
    copyResults
);


// ---------- Enter Key ----------

[aInput, bInput, cInput].forEach(input => {

    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                solveQuadratic();
            }

        }
    );

});