
// --- Global Chart Instances ---
let inputConstellationChart;
let outputConstellationChart;
let berChart;

// --- Utility Functions ---

// Q-function approximation (from numeric.js or custom implementation)
// Using an approximation for Q-function as numeric.js might not be available in all contexts.
// This is a common approximation for Q(x) for x >= 0
function qFunction(x) {
    if (x < 0) return 1 - qFunction(-x);
    const a = 0.3480242;
    const b = -0.0280046;
    const c = 0.1935278;
    const t = 1 / (1 + a * x);
    return (t * (b * t + c) + 0.5) * Math.exp(-x * x / 2);
}

// Generate random bits
function generateRandomBits(numSymbols, k) {
    const totalBits = numSymbols * k;
    const bits = new Array(totalBits);
    for (let i = 0; i < totalBits; i++) {
        bits[i] = Math.round(Math.random());
    }
    return bits;
}

// Gray mapping for M-PSK (example for 8-PSK, 16-PSK, 32-PSK, 64-PSK)
function decToGray(dec, k) {
    let bin = dec.toString(2);
    while (bin.length < k) {
        bin = '0' + bin;
    }
    let gray = bin[0];
    for (let i = 1; i < k; i++) {
        gray += (parseInt(bin[i-1]) ^ parseInt(bin[i])).toString();
    }
    return gray;
}

// Inverse Gray mapping
function grayToDec(gray) {
    let bin = gray[0];
    for (let i = 1; i < gray.length; i++) {
        bin += (parseInt(bin[i-1]) ^ parseInt(gray[i])).toString();
    }
    return parseInt(bin, 2);
}

// Map bits to M-PSK symbols (complex numbers) with Gray coding
function mapBitsToSymbols(bits, M) {
    const k = Math.log2(M); // bits per symbol
    const symbols = [];
    for (let i = 0; i < bits.length; i += k) {
        const bitSlice = bits.slice(i, i + k).join('');
        const decIndex = parseInt(bitSlice, 2);
        const grayIndex = grayToDec(decToGray(decIndex, k)); // Convert to Gray and back to decimal for phase
        const phase = (2 * Math.PI * grayIndex) / M;
        symbols.push({
            I: Math.cos(phase),
            Q: Math.sin(phase)
        });
    }
    return symbols;
}

// Add AWGN to symbols
function addAWGN(symbols, EbNo_dB, k) {
    const EbNo_linear = Math.pow(10, EbNo_dB / 10);
    const EsNo_linear = EbNo_linear * k;
    const noiseVariance = 1 / (2 * EsNo_linear); // Variance for I and Q components

    const noisySymbols = [];
    for (const symbol of symbols) {
        // Generate two independent Gaussian random variables (Box-Muller transform)
        let u1 = Math.random();
        let u2 = Math.random();
        let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        let z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

        const noiseI = z0 * Math.sqrt(noiseVariance);
        const noiseQ = z1 * Math.sqrt(noiseVariance);

        noisySymbols.push({
            I: symbol.I + noiseI,
            Q: symbol.Q + noiseQ
        });
    }
    return noisySymbols;
}

// Demodulate symbols (minimum distance detector)
function demodulateSymbols(noisySymbols, M) {
    const demodulatedIndices = [];
    for (const noisySymbol of noisySymbols) {
        let minDistance = Infinity;
        let closestIndex = -1;

        for (let i = 0; i < M; i++) {
            const idealPhase = (2 * Math.PI * i) / M;
            const idealI = Math.cos(idealPhase);
            const idealQ = Math.sin(idealPhase);

            const distance = Math.sqrt(
                Math.pow(noisySymbol.I - idealI, 2) +
                Math.pow(noisySymbol.Q - idealQ, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        demodulatedIndices.push(closestIndex);
    }
    return demodulatedIndices;
}

// Map demodulated symbol indices back to bits (inverse Gray mapping)
function mapSymbolsToBits(demodulatedIndices, M) {
    const k = Math.log2(M);
    const receivedBits = [];
    for (const index of demodulatedIndices) {
        const grayBinary = decToGray(index, k); // Convert decimal index to Gray binary string
        const decBinary = grayToDec(grayBinary).toString(2); // Convert Gray binary to normal binary string
        const paddedBinary = decBinary.padStart(k, '0'); // Pad with leading zeros
        for (const bitChar of paddedBinary) {
            receivedBits.push(parseInt(bitChar));
        }
    }
    return receivedBits;
}

// Calculate BER
function calculateBER(transmittedBits, receivedBits) {
    let errors = 0;
    for (let i = 0; i < transmittedBits.length; i++) {
        if (transmittedBits[i] !== receivedBits[i]) {
            errors++;
        }
    }
    return errors / transmittedBits.length;
}

// Calculate theoretical BER for M-PSK
function theoreticalBER(EbNo_dB, M) {
    const k = Math.log2(M);
    const EbNo_linear = Math.pow(10, EbNo_dB / 10);
    const arg = Math.sqrt(2 * EbNo_linear * k) * Math.sin(Math.PI / M);
    return (2 / k) * qFunction(arg);
}

// --- Charting Functions ---

function initConstellationChart(canvasId, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Constellation Points',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1, // Keep aspect ratio square
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'In-phase (I)'
                    },
                    min: -1.5,
                    max: 1.5
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Quadrature (Q)'
                    },
                    min: -1.5,
                    max: 1.5
                }
            }
        }
    });
}

function initBerChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Eb/N0 values
            datasets: [{
                label: 'Simulated BER',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
            }, {
                label: 'Theoretical BER',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderDash: [5, 5],
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'BER vs. Eb/N0',
                    font: {
                        size: 16
                    }
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Eb/N0 (dB)'
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Bit Error Rate (BER)'
                    },
                    min: 1e-6, // Adjust as needed
                    max: 1, // Adjust as needed
                    ticks: {
                        callback: function(value, index, values) {
                            // Display only powers of 10
                            if (value === 1 || value === 0.1 || value === 0.01 || value === 0.001 || value === 0.0001 || value === 0.00001 || value === 0.000001) {
                                return value.toExponential();
                            }
                            return null;
                        }
                    }
                }
            }
        }
    });
}

// --- Operation Chamber Animation ---
const opBlocks = {
    'data-gen': document.getElementById('op-data-gen'),
    'modulation': document.getElementById('op-modulation'),
    'noise': document.getElementById('op-noise'),
    'demodulation': document.getElementById('op-demodulation'),
    'ber-calc': document.getElementById('op-ber-calc')
};
const opArrows = document.querySelectorAll('.arrow');

function highlightOperation(step) {
    // Reset all
    Object.values(opBlocks).forEach(block => block.classList.remove('active', 'bg-blue-200'));
    opArrows.forEach(arrow => arrow.classList.remove('active'));

    // Highlight current step
    if (opBlocks[step]) {
        opBlocks[step].classList.add('active', 'bg-blue-200');
    }

    // Highlight preceding arrow if applicable
    if (step === 'modulation') opArrows[0].classList.add('active');
    if (step === 'noise') opArrows[1].classList.add('active');
    if (step === 'demodulation') opArrows[2].classList.add('active');
    if (step === 'ber-calc') opArrows[3].classList.add('active');
}

function resetOperationHighlights() {
    Object.values(opBlocks).forEach(block => block.classList.remove('active', 'bg-blue-200'));
    opArrows.forEach(arrow => arrow.classList.remove('active'));
}

// --- Main Simulation Logic ---
function showInstructionPrompt(message) {
    let promptModal = document.getElementById('instructionPromptModal');
    if (!promptModal) {
        promptModal = document.createElement('div');
        promptModal.id = 'instructionPromptModal';
        promptModal.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center animate-bounce-in">
            <div class="text-4xl mb-2 text-yellow-500">⚠</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p class="text-gray-700 mb-4 text-center">${message}</p>
            <button id="openInstructionsFromPrompt" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md mb-2 transition duration-300">Read Lab Instructions</button>
            <button id="closeInstructionPrompt" class="text-gray-500 hover:text-gray-800 mt-1">Dismiss</button>
          </div>
        </div>
        <style>
          @keyframes bounce-in {
            0% { transform: scale(0.8); opacity: 0; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-bounce-in { animation: bounce-in 0.5s; }
        </style>
        `;
        document.body.appendChild(promptModal);
    } else {
        promptModal.querySelector('p').textContent = message;
        promptModal.style.display = 'flex';
    }
    promptModal.style.display = 'flex';
    document.getElementById('openInstructionsFromPrompt').onclick = function() {
        document.getElementById('instructionsModal').style.display = 'flex';
        promptModal.style.display = 'none';
    };
    document.getElementById('closeInstructionPrompt').onclick = function() {
        promptModal.style.display = 'none';
    };
}

async function runSimulation() {
    resetOperationHighlights(); // Reset highlights at start

    const M = parseInt(document.getElementById('modulationType').value);
    const k = Math.log2(M);
    const numSymbols = parseInt(document.getElementById('numSymbols').value);
    const ebNoStart = parseFloat(document.getElementById('ebNoStart').value);
    const ebNoEnd = parseFloat(document.getElementById('ebNoEnd').value);
    const ebNoStep = parseFloat(document.getElementById('ebNoStep').value);

    if (numSymbols < 1000) {
        showInstructionPrompt("Please enter at least 1000 symbols for meaningful results. If you are unsure, please read the Lab Instructions.");
        return;
    }
    if (ebNoStart >= ebNoEnd) {
        showInstructionPrompt("Eb/N0 End must be greater than Eb/N0 Start. If you are unsure, please read the Lab Instructions.");
        return;
    }
    if (ebNoStep <= 0) {
        showInstructionPrompt("Eb/N0 Step must be a positive value. If you are unsure, please read the Lab Instructions.");
        return;
    }

    document.getElementById('runSimulationBtn').disabled = true;
    document.getElementById('runSimulationBtn').textContent = 'Simulating...';
    document.getElementById('downloadReportBtn').disabled = true;

    const ebNoValues = [];
    const simulatedBERs = [];
    const theoreticalBERs = [];

    // Generate ideal constellation for input display
    const idealConstellation = [];
    for (let i = 0; i < M; i++) {
        const phase = (2 * Math.PI * i) / M;
        idealConstellation.push({
            x: Math.cos(phase),
            y: Math.sin(phase)
        });
    }
    inputConstellationChart.data.datasets[0].data = idealConstellation;
    inputConstellationChart.update();
    // Set output constellation color to red
    outputConstellationChart.data.datasets[0].backgroundColor = 'rgba(255, 0, 0, 0.6)';
    outputConstellationChart.data.datasets[0].borderColor = 'rgba(255, 0, 0, 1)';
    outputConstellationChart.update();

    // Perform simulation for each Eb/N0 value
    for (let ebNo_dB = ebNoStart; ebNo_dB <= ebNoEnd; ebNo_dB += ebNoStep) {
        ebNoValues.push(ebNo_dB);

        // Step 1: Data Generation
        highlightOperation('data-gen');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for animation
        const transmittedBits = generateRandomBits(numSymbols, k);

        // Step 2: Modulation
        highlightOperation('modulation');
        await new Promise(resolve => setTimeout(resolve, 100));
        const modulatedSymbols = mapBitsToSymbols(transmittedBits, M);

        // Step 3: Noise Addition
        highlightOperation('noise');
        await new Promise(resolve => setTimeout(resolve, 100));
        const noisySymbols = addAWGN(modulatedSymbols, ebNo_dB, k);

        // Update output constellation for the first Eb/N0 value (or a representative one)
        if (ebNo_dB === ebNoStart) {
            outputConstellationChart.data.datasets[0].data = noisySymbols.map(s => ({
                x: s.I,
                y: s.Q
            }));
            outputConstellationChart.data.datasets[0].backgroundColor = 'rgba(255, 0, 0, 0.6)';
            outputConstellationChart.data.datasets[0].borderColor = 'rgba(255, 0, 0, 1)';
            outputConstellationChart.update();
        }

        // Step 4: Demodulation
        highlightOperation('demodulation');
        await new Promise(resolve => setTimeout(resolve, 100));
        const demodulatedIndices = demodulateSymbols(noisySymbols, M);
        const receivedBits = mapSymbolsToBits(demodulatedIndices, M);

        // Step 5: BER Calculation
        highlightOperation('ber-calc');
        await new Promise(resolve => setTimeout(resolve, 100));
        const simulatedBER = calculateBER(transmittedBits, receivedBits);
        simulatedBERs.push(simulatedBER);

        const theoretical = theoreticalBER(ebNo_dB, M);
        theoreticalBERs.push(theoretical);

        // Update BER chart incrementally
        berChart.data.labels = ebNoValues.map(val => val.toFixed(1));
        berChart.data.datasets[0].data = simulatedBERs;
        berChart.data.datasets[1].data = theoreticalBERs;
        berChart.update();
    }

    resetOperationHighlights(); // Clear highlights after simulation
    document.getElementById('runSimulationBtn').disabled = false;
    document.getElementById('runSimulationBtn').textContent = 'Run Simulation';
    document.getElementById('downloadReportBtn').disabled = false;

    // Store data for download
    window.berDataForDownload = {
        ebNoValues,
        simulatedBERs,
        theoreticalBERs
    };
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts
    inputConstellationChart = initConstellationChart('inputConstellationChart', 'Ideal Constellation');
    outputConstellationChart = initConstellationChart('outputConstellationChart', 'Received Constellation');
    berChart = initBerChart('berChart');

    // Example initial constellation for 8-PSK
    const M_initial = parseInt(document.getElementById('modulationType').value);
    const idealConstellationInitial = [];
    for (let i = 0; i < M_initial; i++) {
        const phase = (2 * Math.PI * i) / M_initial;
        idealConstellationInitial.push({
            x: Math.cos(phase),
            y: Math.sin(phase)
        });
    }
    inputConstellationChart.data.datasets[0].data = idealConstellationInitial;
    inputConstellationChart.update();

    // Lab Instructions Modal
    const instructionsModal = document.getElementById('instructionsModal');
    const viewInstructionsBtn = document.getElementById('viewInstructionsBtn');
    const howToPerformLabModal = document.getElementById('howToPerformLabModal');
    const howToPerformLabBtn = document.getElementById('howToPerformLabBtn');
    const closeButtons = document.querySelectorAll('.close-button');

    viewInstructionsBtn.onclick = () => {
        instructionsModal.style.display = 'flex';
        // Add a small delay to allow the display change to register before adding the class
        setTimeout(() => { instructionsModal.classList.add('show'); }, 10);
    };

    howToPerformLabBtn.onclick = () => {
        howToPerformLabModal.style.display = 'flex';
        // Add a small delay to allow the display change to register before adding the class
        setTimeout(() => { howToPerformLabModal.classList.add('show'); }, 10);
    };

    closeButtons.forEach(btn => {
        btn.onclick = () => {
            const modalToClose = btn.closest('.modal');
            if (modalToClose) {
                modalToClose.classList.remove('show');
                // Add a delay to allow the fade-out transition to complete
                modalToClose.addEventListener('transitionend', function handler() {
                    modalToClose.style.display = 'none';
                    modalToClose.removeEventListener('transitionend', handler);
                });
            }
        };
    });

    window.onclick = (event) => {
        if (event.target == instructionsModal) {
            instructionsModal.classList.remove('show');
            instructionsModal.addEventListener('transitionend', function handler() {
                instructionsModal.style.display = 'none';
                instructionsModal.removeEventListener('transitionend', handler);
            });
        }
        if (event.target == howToPerformLabModal) {
            howToPerformLabModal.classList.remove('show');
            howToPerformLabModal.addEventListener('transitionend', function handler() {
                howToPerformLabModal.style.display = 'none';
                howToPerformLabModal.removeEventListener('transitionend', handler);
            });
        }
    };

    // Run Simulation Button
    document.getElementById('runSimulationBtn').addEventListener('click', runSimulation);

    // Reset Data button for Simulation Interface
    document.getElementById('resetDataBtn').addEventListener('click', () => {
        document.getElementById('modulationType').value = '8';
        document.getElementById('numSymbols').value = 100000;
        document.getElementById('ebNoStart').value = 0;
        document.getElementById('ebNoEnd').value = 15;
        document.getElementById('ebNoStep').value = 1;
        // Update input constellation chart to default (8-PSK)
        if (window.inputConstellationChart) {
            const M = 8;
            const idealConstellation = [];
            for (let i = 0; i < M; i++) {
                const phase = (2 * Math.PI * i) / M;
                idealConstellation.push({ x: Math.cos(phase), y: Math.sin(phase) });
            }
            window.inputConstellationChart.data.datasets[0].data = idealConstellation;
            window.inputConstellationChart.update();
        }
        // Clear output constellation and BER chart, and set output waveform color to red
        if (window.outputConstellationChart) {
            window.outputConstellationChart.data.datasets[0].data = [];
            window.outputConstellationChart.data.datasets[0].backgroundColor = 'rgba(255, 0, 0, 0.6)';
            window.outputConstellationChart.data.datasets[0].borderColor = 'rgba(255, 0, 0, 1)';
            window.outputConstellationChart.update();
        }
        if (window.berChart) {
            window.berChart.data.labels = [];
            window.berChart.data.datasets[0].data = [];
            window.berChart.data.datasets[1].data = [];
            window.berChart.update();
        }
        // Remove any stored BER data for download
        window.berDataForDownload = undefined;
    });

    // Download Report Button
    document.getElementById('downloadReportBtn').addEventListener('click', () => {
        if (!window.berDataForDownload) {
            alert('Please run the simulation first to generate data for download.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const margin = 32;
        let y = margin;
        // Title
        doc.setFontSize(18);
        doc.text('M-arrays Phase Shift BER Simulation Lab - BER Report', margin, y);
        y += 28;
        // Date/Time
        const now = new Date();
        doc.setFontSize(11);
        doc.text('Date/Time: '  + now.toLocaleString(), margin, y);
        y += 18;
        // Parameters
        const modulationType = document.getElementById('modulationType').value;
        const numSymbols = document.getElementById('numSymbols').value;
        const ebNoStart = document.getElementById('ebNoStart').value;
        const ebNoEnd = document.getElementById('ebNoEnd').value;
        const ebNoStep = document.getElementById('ebNoStep').value;
        doc.text(`Modulation Type: ${modulationType}-PSK`, margin, y);
        y += 14;
        doc.text(`Number of Symbols: ${numSymbols}`, margin, y);
        y += 14;
        doc.text(`Eb/N0 Range: ${ebNoStart} dB to ${ebNoEnd} dB (step ${ebNoStep})`, margin, y);
        y += 20;
        // BER Table
        doc.setFontSize(13);
        doc.text('BER Data Table:', margin, y);
        y += 16;
        doc.setFontSize(10);
        doc.text('Eb/N0 (dB)   Simulated BER   Theoretical BER', margin, y);
        y += 12;
        const { ebNoValues, simulatedBERs, theoreticalBERs } = window.berDataForDownload;
        for (let i = 0; i < ebNoValues.length; i++) {
            doc.text(`${ebNoValues[i]}           ${simulatedBERs[i]}           ${theoreticalBERs[i]}`, margin, y);
            y += 12;
            if (y > 750) { doc.addPage(); y = margin; }
        }
        // Footer
        doc.setFontSize(10);
        doc.text('Report generated by M-arrays Phase Shift BER Simulation Lab', margin, 820);
        doc.save('M-arrays-PSK-BER-Report.pdf');
    });

    // Print Summary Report (PDF) button
    document.getElementById('printSummaryBtn').addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const margin = 32;
        let y = margin;
        // Title
        doc.setFontSize(20);
        doc.text('M-arrays Phase Shift BER Simulation Lab - Summary Report', margin, y);
        y += 32;
        // Date/Time
        const now = new Date();
        doc.setFontSize(12);
        doc.text('Date/Time: ' + now.toLocaleString(), margin, y);
        y += 24;
        // Parameters
        const modulationType = document.getElementById('modulationType').value;
        const numSymbols = document.getElementById('numSymbols').value;
        const ebNoStart = document.getElementById('ebNoStart').value;
        const ebNoEnd = document.getElementById('ebNoEnd').value;
        const ebNoStep = document.getElementById('ebNoStep').value;
        doc.text(`Modulation Type: ${modulationType}-PSK`, margin, y);
        y += 18;
        doc.text(`Number of Symbols: ${numSymbols}`, margin, y);
        y += 18;
        doc.text(`Eb/N0 Range: ${ebNoStart} dB to ${ebNoEnd} dB (step ${ebNoStep})`, margin, y);
        y += 24;
        // BER Chart
        const berChartCanvas = document.getElementById('berChart');
        if (berChartCanvas) {
            const berImgData = berChartCanvas.toDataURL('image/png', 1.0);
            doc.setFontSize(14);
            doc.text('BER vs. Eb/N0:', margin, y);
            y += 10;
            doc.addImage(berImgData, 'PNG', margin, y, 500, 250);
            y += 260;
        }
        // Input Constellation
        const inputCanvas = document.getElementById('inputConstellationChart');
        if (inputCanvas) {
            const inputImgData = inputCanvas.toDataURL('image/png', 1.0);
            doc.setFontSize(14);
            doc.text('Input Constellation (Transmitted):', margin, y);
            y += 10;
            doc.addImage(inputImgData, 'PNG', margin, y, 220, 220);
            y += 230;
        }
        // Output Constellation
        const outputCanvas = document.getElementById('outputConstellationChart');
        if (outputCanvas) {
            const outputImgData = outputCanvas.toDataURL('image/png', 1.0);
            doc.setFontSize(14);
            doc.text('Output Constellation (Received with Noise):', margin, y);
            y += 10;
            doc.addImage(outputImgData, 'PNG', margin, y, 220, 220);
            y += 230;
        }
        // BER Table
        if (window.berDataForDownload) {
            doc.setFontSize(14);
            doc.text('BER Data Table:', margin, y);
            y += 16;
            doc.setFontSize(10);
            doc.text('Eb/N0 (dB)   Simulated BER   Theoretical BER', margin, y);
            y += 12;
            const { ebNoValues, simulatedBERs, theoreticalBERs } = window.berDataForDownload;
            for (let i = 0; i < ebNoValues.length; i++) {
                doc.text(`${ebNoValues[i]}           ${simulatedBERs[i]}           ${theoreticalBERs[i]}`, margin, y);
                y += 12;
                if (y > 750) { doc.addPage(); y = margin; }
            }
        }
        // Footer
        doc.setFontSize(10);
        doc.text('Report generated by M-arrays Phase Shift BER Simulation Lab', margin, 820);
        doc.save('M-arrays-PSK-BER-Summary-Report.pdf');
    });
}); 