
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
### 4. Circuit Digram 
![WhatsApp Image 2025-05-31 at 15 27 38_d1444bfe](https://github.com/user-attachments/assets/4319738d-27a6-4a63-9ede-96625dcf59b8)
**Circuit Digram of M array Phase Shift (using matlab software)**


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

 ### 5. Observation

M-PSK Scheme	Theoretical BER	Observed BER (at SNR = 10 dB)

8-PSK	Lower	Moderate
16-PSK	Moderate	Higher than 8-PSK
32-PSK	High	High
64-PSK	Very High	Very High

6. Key Points

 Higher M → **Higher Data Rate**, but more prone to noise.

Lower M → **More Robust**, but slower transmission.
### 7.Advantages of M-PSK Modulation and Demodulation

1. Efficient use of bandwidth (especially with higher M values).

2. Constant envelope → suitable for non-linear power amplifiers.

3 .Simple implementation for lower-order PSK (e.g., BPSK, QPSK, 8-PSK).

4. Higher data rates with increased M (more bits per symbol).

5. Suitable for coherent detection techniques with good synchronization.

### 8. Disadvantages of M-PSK

1. Higher-order PSK (16, 32, 64) is more susceptible to noise due to smaller phase spacing.

2. Requires accurate phase synchronization at the receiver.

3.Complex demodulation circuitry for large M values.

4. Increased bit error rate (BER) under low SNR conditions.

 ### 9. Conclusion

M-PSK provides a flexible way to increase data transmission rates using the same bandwidth.

Simulation results confirm that as the value of M increases, the system becomes more sensitive to noise, resulting in a higher BER.

8-PSK and 16-PSK offer a good balance between performance and complexity for many practical systems.

This simulation reinforces the importance of choosing the right modulation scheme based on channel conditions and system requirements.
### 10. Summary

M-ary PSK is a digital modulation method where information is transmitted by varying the phase of a constant-amplitude carrier wave.

In this experiment, MATLAB is used to simulate various M-PSK schemes (8, 16, 32, 64).

BER is calculated to evaluate performance under different noise levels (SNR).

Trade-offs exist between data rate and noise performance:

Higher M = Higher data rate, but higher BER.

Lower M = More robust, but slower.



