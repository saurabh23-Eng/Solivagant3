
## ✅ Theory

**Title:** Theory of M-ary Phase Shift Keying (PSK) and BER Calculation

---

1. **Phase Shift Keying (PSK)**

   * PSK is a digital modulation technique where the phase of a constant amplitude carrier signal is varied to represent digital data.
   * The data is encoded by changing the phase among a finite set of values.

2. **M-ary PSK**

   * M-ary PSK extends basic PSK by using $M$ different phase states to represent multiple bits per symbol.
   * Each symbol carries $\log_2 M$ bits, increasing spectral efficiency.

3. **8PSK and 16PSK**

   * In 8PSK, 8 distinct phase shifts represent 3 bits per symbol.
   * In 16PSK, 16 distinct phase shifts represent 4 bits per symbol.
   * As $M$ increases, more bits are transmitted per symbol, but symbols become closer in phase, making the system more susceptible to noise.

4. **Additive White Gaussian Noise (AWGN)**

   * AWGN is the common noise model used in communication system simulations.
   * It models random noise with constant spectral density and Gaussian amplitude distribution.

5. **Bit Error Rate (BER)**

   * BER measures the rate at which errors occur in the received bit stream compared to the transmitted bit stream.
   * It is a key performance metric for digital communication systems.

6. **Trade-off in M-ary PSK**

   * Higher-order M-ary PSK improves bandwidth efficiency but increases BER at a given SNR due to reduced distance between phase points.

7. **Performance Analysis**

   * BER vs. SNR curves help analyze the performance of different M-ary PSK schemes under noisy conditions.
   * Typically, 8PSK has a lower BER than 16PSK for the same SNR.
