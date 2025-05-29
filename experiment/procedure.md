🔧 Procedure (Step-by-Step)

Start Stimulator,

Open a new script or use the Command Window to begin the simulation.

Define Simulation Parameters

Set the total number of bits to be transmitted.

Choose the modulation scheme: 8PSK or 16PSK.

Specify the range of SNR (Signal-to-Noise Ratio) values in decibels.

Define any additional simulation settings as needed.

Generate Random Bit Stream

Create a stream of random bits.

Group bits appropriately:

3 bits per symbol for 8PSK

4 bits per symbol for 16PSK

Map Bits to Symbols

Convert the grouped bits into decimal symbol values.

Modulate the symbols using the selected PSK scheme.

Add AWGN (Noise)

For each SNR value, add Additive White Gaussian Noise to the modulated signal to simulate real-world conditions.

Demodulate Received Signal

Demodulate the noisy signal using the same PSK scheme.

Convert the demodulated symbols back to their original bit form.

Calculate BER (Bit Error Rate)

Compare the original transmitted bits with the received bits.

Calculate the Bit Error Rate for each SNR value.

Plot BER Curve

Plot a graph of BER versus SNR to analyze the performance of the modulation scheme.

Repeat for Both Modulation Types

Repeat the entire procedure for both 8PSK and 16PSK.

Compare the resulting BER curves to understand how modulation order affects performance.### Procedure
