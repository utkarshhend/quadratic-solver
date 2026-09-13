let lastSolution = "";

function solve() {

    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);
    const c = Number(document.getElementById("c").value);

    const result = document.getElementById("result");
    const rootResult = document.getElementById("rootResult");
    const steps = document.getElementById("steps");

    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
        alert("Please enter values for a, b and c.");
        return;
    }

    if (a === 0) {
        alert("a cannot be 0 because then the equation is not quadratic.");
        return;
    }

    const D = b * b - 4 * a * c;

    steps.innerHTML = "";

    addStep(
        "Step 1 — Identify the coefficients",
        `a = ${format(a)}<br>
         b = ${format(b)}<br>
         c = ${format(c)}`
    );

    addStep(
        "Step 2 — Calculate the discriminant",
        `D = b² − 4ac<br>
         D = (${format(b)})² − 4(${format(a)})(${format(c)})<br>
         D = ${format(D)}`
    );

    if (D > 0) {

        const sqrtD = Math.sqrt(D);

        const x1 = (-b + sqrtD) / (2 * a);
        const x2 = (-b - sqrtD) / (2 * a);

        addStep(
            "Step 3 — Use the quadratic formula",
            `x = (−b ± √D) / 2a<br>
             x = (${format(-b)} ± √${format(D)}) / ${format(2 * a)}`
        );

        addStep(
            "Step 4 — Calculate the two roots",
            `x₁ = ${format(x1)}<br>
             x₂ = ${format(x2)}`
        );

        rootResult.innerHTML =
            `x₁ = <strong>${format(x1)}</strong> &nbsp;&nbsp; 
             x₂ = <strong>${format(x2)}</strong>`;

        lastSolution =
            `Quadratic Equation: ${format(a)}x² + ${format(b)}x + ${format(c)} = 0\n\n` +
            `Discriminant: ${format(D)}\n\n` +
            `x₁ = ${format(x1)}\nx₂ = ${format(x2)}`;

    }

    else if (D === 0) {

        const x = -b / (2 * a);

        addStep(
            "Step 3 — Since D = 0",
            "The equation has one repeated real root."
        );

        addStep(
            "Step 4 — Calculate the root",
            `x = −b / 2a<br>
             x = ${format(x)}`
        );

        rootResult.innerHTML =
            `x = <strong>${format(x)}</strong> (repeated root)`;

        lastSolution =
            `Quadratic Equation: ${format(a)}x² + ${format(b)}x + ${format(c)} = 0\n\n` +
            `Discriminant: 0\n\n` +
            `x = ${format(x)}`;

    }

    else {

        const real = -b / (2 * a);
        const imaginary = Math.sqrt(-D) / Math.abs(2 * a);

        addStep(
            "Step 3 — Since D < 0",
            "The equation has two complex roots."
        );

        addStep(
            "Step 4 — Calculate the complex roots",
            `x = (−b ± √D) / 2a<br>
             √D = i√(${format(-D)})`
        );

        addStep(
            "Step 5 — Final answer",
            `x₁ = ${format(real)} + ${format(imaginary)}i<br>
             x₂ = ${format(real)} − ${format(imaginary)}i`
        );

        rootResult.innerHTML =
            `x₁ = <strong>${format(real)} + ${format(imaginary)}i</strong><br>
             x₂ = <strong>${format(real)} − ${format(imaginary)}i</strong>`;

        lastSolution =
            `Quadratic Equation: ${format(a)}x² + ${format(b)}x + ${format(c)} = 0\n\n` +
            `Discriminant: ${format(D)}\n\n` +
            `x₁ = ${format(real)} + ${format(imaginary)}i\n` +
            `x₂ = ${format(real)} − ${format(imaginary)}i`;
    }

    result.classList.remove("hidden");

    drawGraph(a, b, c);

    setTimeout(() => {
        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}


function addStep(title, content) {

    const steps = document.getElementById("steps");

    const div = document.createElement("div");

    div.className = "step";

    div.innerHTML = `
        <div class="step-title">${title}</div>
        <div class="formula">${content}</div>
    `;

    steps.appendChild(div);
}


function format(number) {

    if (Math.abs(number) < 1e-10) {
        return "0";
    }

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return Number(number.toFixed(8)).toString();
}


/* GRAPH */

function drawGraph(a, b, c) {

    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    /*
       Find a sensible x range.
    */

    const vertexX = -b / (2 * a);

    let range = 10;

    if (Math.abs(vertexX) > 5) {
        range = Math.abs(vertexX) + 5;
    }

    const roots = [];

    const D = b * b - 4 * a * c;

    if (D >= 0) {
        roots.push(
            (-b + Math.sqrt(D)) / (2 * a)
        );

        roots.push(
            (-b - Math.sqrt(D)) / (2 * a)
        );
    }

    for (const root of roots) {
        if (Math.abs(root) > range * .7) {
            range = Math.abs(root) + 3;
        }
    }

    range = Math.min(range, 50);

    const xMin = vertexX - range;
    const xMax = vertexX + range;

    const values = [];

    for (let i = 0; i <= 100; i++) {

        const x = xMin + (xMax - xMin) * i / 100;

        const y = a * x * x + b * x + c;

        values.push(y);
    }

    let yMin = Math.min(...values);
    let yMax = Math.max(...values);

    if (yMin === yMax) {
        yMin -= 5;
        yMax += 5;
    }

    const padding = (yMax - yMin) * .15;

    yMin -= padding;
    yMax += padding;

    function mapX(x) {
        return (x - xMin) / (xMax - xMin) * width;
    }

    function mapY(y) {
        return height -
            (y - yMin) / (yMax - yMin) * height;
    }

    /* Grid */

    ctx.lineWidth = 1;

    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {

        const x = mapX(i);

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);

        ctx.strokeStyle = "rgba(255,255,255,.06)";
        ctx.stroke();
    }

    const yStep = chooseStep(yMax - yMin);

    for (
        let y = Math.ceil(yMin / yStep) * yStep;
        y <= yMax;
        y += yStep
    ) {

        const py = mapY(y);

        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);

        ctx.strokeStyle = "rgba(255,255,255,.06)";
        ctx.stroke();
    }

    /* Axes */

    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.lineWidth = 1.5;

    if (xMin <= 0 && xMax >= 0) {

        const x = mapX(0);

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    if (yMin <= 0 && yMax >= 0) {

        const y = mapY(0);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    /* Parabola */

    ctx.beginPath();

    for (let i = 0; i <= 500; i++) {

        const x =
            xMin + (xMax - xMin) * i / 500;

        const y =
            a * x * x + b * x + c;

        const px = mapX(x);
        const py = mapY(y);

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.strokeStyle = "#7c6cff";
    ctx.lineWidth = 3;

    ctx.shadowColor = "#7c6cff";
    ctx.shadowBlur = 12;

    ctx.stroke();

    ctx.shadowBlur = 0;

    /* Vertex */

    const vertexY =
        a * vertexX * vertexX +
        b * vertexX +
        c;

    drawPoint(
        mapX(vertexX),
        mapY(vertexY),
        "#43d9ff"
    );

    /* Roots */

    for (const root of roots) {

        if (root >= xMin && root <= xMax) {

            drawPoint(
                mapX(root),
                mapY(0),
                "#55e6a5"
            );
        }
    }
}


function drawPoint(x, y, color) {

    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    ctx.fill();

    ctx.shadowBlur = 0;
}


function chooseStep(range) {

    if (range <= 10) return 1;
    if (range <= 25) return 5;
    if (range <= 100) return 10;

    return 20;
}


/* COPY */

function copySolution() {

    if (!lastSolution) return;

    navigator.clipboard.writeText(lastSolution)
        .then(() => {

            const button =
                document.querySelector(".copy-btn");

            const oldText = button.textContent;

            button.textContent = "Copied ✓";

            setTimeout(() => {
                button.textContent = oldText;
            }, 1500);
        });
}


/* CLEAR */

function clearAll() {

    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("c").value = "";

    document.getElementById("result")
        .classList.add("hidden");

    document.getElementById("steps").innerHTML = "";

    lastSolution = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ENTER KEY */

document.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        solve();
    }

});
