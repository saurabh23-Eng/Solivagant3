🔧 Procedure (Step-by-Step)

1.Start Stimulator,

Open a new script or use the Command Window to begin the simulation.


2.Define Simulation Parameters

Set the total number of bits to be transmitted.

Choose the modulation scheme: 8PSK or 16PSK.

Specify the range of SNR (Signal-to-Noise Ratio) values in decibels.

Define any additional simulation settings as needed.


3.Generate Random Bit Stream

Create a stream of random bits.

Group bits appropriately:

3 bits per symbol for 8PSK

4 bits per symbol for 16PSK


4.Map Bits to Symbols

Convert the grouped bits into decimal symbol values.

Modulate the symbols using the selected PSK scheme.


5.Add AWGN (Noise)

For each SNR value, add Additive White Gaussian Noise to the modulated signal to simulate real-world conditions.


6.Demodulate Received Signal

Demodulate the noisy signal using the same PSK scheme.

Convert the demodulated symbols back to their original bit form.


7.Calculate BER (Bit Error Rate)

Compare the original transmitted bits with the received bits.

Calculate the Bit Error Rate for each SNR value.


8.Plot BER Curve

Plot a graph of BER versus SNR to analyze the performance of the modulation scheme.

Repeat for Both Modulation Types


9.Repeat the entire procedure for both 8PSK and 16PSK.

Compare the resulting BER curves to understand how modulation order affects performance.### Procedure
