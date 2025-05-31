#### Please use the [reference](https://github.com/virtual-labs/ph3-exp-dev-process/blob/main/storyboard/README.org) document to fill this template. Follow the [link](https://github.com/virtual-labs/ph3-exp-dev-process/tree/main/sample/storyboard) to view a sample storyboard document. 



## Storyboard

Delete this line before submission : The core principle of storyboarding is to make the lab/experiment documentation elaborated in a manner that it makes easy for any person (developer/domain and non domain faculty/student) to understand and develop the lab/experiment.

Experiment 1: Name of the Experiment

### 1. Story Outline
This experiment focuses on simulating M-ary Phase Shift Keying (M-PSK) techniques, specifically 8PSK and 16PSK, using MATLAB software. The aim is to understand the process of modulating digital data into different phase symbols, transmitting over a noisy channel, and demodulating at the receiver end. Through this, students will observe how increasing the number of phases affects signal constellation, bit error rate, and overall system performance.

By performing the simulation, learners gain hands-on experience with digital modulation concepts, constellation diagram interpretation, and error rate calculation, which are crucial for modern communication systems


### 2. Story
M-PSK modulation maps digital bits into symbols represented as points on a circle in the complex plane, each with a distinct phase. For 8PSK and 16PSK, the symbol set contains 8 and 16 different phases, respectively. The experiment begins with generating a random bit stream, which is grouped and mapped to corresponding phase symbols.

The transmitter modulates these symbols on a carrier wave by shifting its phase. The modulated signal passes through an AWGN channel to simulate real-world noise effects. At the receiver, the noisy signal is demodulated by comparing received phases to ideal constellation points. Finally, the bit error rate (BER) is calculated by comparing the original and received bits.


#### 2.1 Set the Visual Stage Description:
When the user opens the simulator, they see:

Input panel to select parameters like modulation order (8 or 16), number of bits, and SNR values.

Blocks showing data generation, symbol mapping, modulator, AWGN channel, demodulator, and BER calculator.

Graphical outputs including constellation diagrams (transmitted and received), and BER vs SNR plots.

Step-by-step simulation progress indicators

#### 2.2 Set User Objectives & Goals:
The user aims to:

Understand how digital bits are converted to M-PSK symbols.

Visualize the constellation diagrams for 8PSK and 16PSK.

Observe the effect of noise by varying SNR values on signal quality and BER.

Calculate and analyze BER performance for different modulation orders.

The user begins by choosing modulation parameters and running the simulation to see real-time results and graphical outputs

#### 2.3 Set the Pathway Activities:

Start by selecting modulation order (8PSK or 16PSK).

Generate random binary data bits.

Map bits to symbols (phase points).

Modulate the carrier wave using symbol phases.

Pass the signal through AWGN channel with selectable noise level.

Demodulate the received noisy signal to estimate transmitted bits.

Calculate BER by comparing transmitted and received bits.

Plot constellation diagrams and BER vs SNR graphs for analysis

##### 2.4 Set Challenges and Questions/Complexity/Variations in Questions:
How does increasing modulation order affect the minimum distance between constellation points and BER?

What happens to BER as SNR decreases?

Can the user interpret the constellation diagrams to identify symbol errors?

What trade-offs exist between bandwidth efficiency and error performance in 8PSK vs 16PSK?


##### 2.5 Allow pitfalls:
Incorrect selection of modulation order might confuse users; ensure instructions clarify symbol grouping.

Users may misinterpret constellation diagrams without understanding phase points.

Failing to vary SNR may lead to misunderstanding noise effects.

Not comparing BER results across modulation orders could miss performance insights.

##### 2.6 Conclusion:
At the experiment's end, the user understands how M-PSK modulates digital data by phase shifts, sees the impact of noise on communication quality, and interprets BER vs SNR results. The simulation reinforces theoretical concepts with practical visualization, preparing the learner for real-world digital communication systems.

##### 2.7 Equations/formulas: NA

 Type equations here : (Guide : ( a separate sheet having equations / programs for the lab exper3ment to be shared along with the Story submissions (1) . You can mark it as numerical reference numbers within the story narration (like we cite in the research papers) and then separately share these equations/programs sheets as a reference, do not include the equations as a whole in the narration)) Tool can be used to integrate formula in Markdown here
​
 


### 3. Flowchart
Link to flow chart Here : Store in the  /flowchart folder within pedagogy folder in your repo
<br>
(Guide :The lab proposer should extract logic from the story, prepare a flowchart from the story narration and write the algorithm to execute the black box.  use Google Drawings https://docs.google.com/drawings/ (send the link to your flowchart and also attach .png by exporting it )

### 4. Mindmap
 Link to mindmap here : Store the mindmap in both .mm & .png extension in the  /mindmap folder and include link of only .pdf verison here
 <br>
 (Guide : An elaborate mind map (connecting all the points in the experiment flow ) should be prepared and submitted by the lab proposer. The mind map should be a clear and detailed document that takes into account all minute intri5acies involved in the development of virtual lab. The mindmap should be self-content and any developer across the globe should be able to code it with all those details. using only FreeMind http://freemind.sourceforge.net/wiki/index.php/Main_Page (send the .png file and also the original .mm extension project file. )

### 5. Storyboard

Link the storyboard (.gif file ) in here :
(Guide: This document should include sketching and description scene wise (duration, action, description). Software to be used for storyboarding : https://wonderunit.com/storyboarder/ (Its a FOSS tool).
