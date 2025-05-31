
##  Theory

**Title:** To Simulate M-ary Phase Shift Keying (M-PSK) Using MATLAB (8-PSK, 16-PSK, 32-PSK, 64-PSK) and Perform BER Calculation.
## 1. Introduction to M-ary Phase Shift Keying (M-PSK)

M-PSK is a digital modulation technique in which each symbol represents multiple bits, depending on the value of M. Instead of using amplitude or frequency variations, it changes the phase of the carrier signal to represent different data symbols.

The "M" in M-PSK stands for the number of different phase angles used.

Each phase corresponds to a unique binary word of length log₂(M).


M value	Bits per symbol

8-PSK	3 bits
16-PSK	4 bits
32-PSK	5 bits
64-PSK	6 bits

### 2. Principle of Operation

An M-PSK signal is given by:

s(t) = A \cos(2\pi f_ct + \theta_m)

Where:

: Amplitude (constant)

: Carrier frequency

: One of M possible phase values


In each symbol interval, the modulator outputs one of M possible phase values, each representing a unique combination of bits.


### 3. Constellation Diagrams

The constellation diagram shows all the possible signal states in the complex plane.

Each point corresponds to a different phase angle.

As M increases:

Constellation points get closer together

BER increases for the same noise level due to reduced noise margin

### 4. MATLAB Simulation Steps (Step-by-Step)

 Step 1: **Generate Random Binary Data**

data = randi([0 1], N*log2(M), 1);

N: number of symbols

log2(M): number of bits per symbol

 Step 2: **Group Bits and Convert to Symbols**

dataSymbols = bi2de(reshape(data, log2(M), []).');

Step 3: **Modulate Using M-PSK**

modSignal = pskmod(dataSymbols, M, pi/M);  % Gray-coded

 Step 4: **Add AWGN Noise**

snr = 0:2:20; % in dB
for k = 1:length(snr)
    receivedSignal = awgn(modSignal, snr(k), 'measured');

Step 5: **Demodulate**

demodData = pskdemod(receivedSignal, M, pi/M);

 Step 6: **Convert Symbols Back to Bits**

receivedBits = de2bi(demodData, log2(M));
    receivedBits = receivedBits.';
    receivedBits = receivedBits(:);

 Step 7: **Calculate Bit Error Rate**

[numErrors, ber(k)] = biterr(data, receivedBits);
end

 Step 8: **Plot BER vs SNR**

semilogy(snr, ber, '-o');
grid on;
xlabel('SNR (dB)');
ylabel('Bit Error Rate (BER)');
title(['BER vs SNR for ', num2str(M), '-PSK']);

 5. **Observation**

M-PSK Scheme	Theoretical BER	Observed BER (at SNR = 10 dB)

8-PSK	Lower	Moderate
16-PSK	Moderate	Higher than 8-PSK
32-PSK	High	High
64-PSK	Very High	Very High

6. **Key Points**

Higher M → Higher Data Rate, but more prone to noise.

Lower M → More Robust, but slower transmission.


