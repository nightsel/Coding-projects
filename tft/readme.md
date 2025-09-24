## Teamfight Tactics AI Project

### Character Data
- **Data Source:** [TFT character data JSON](https://raw.communitydragon.org/latest/cdragon/tft/en_us.json)  
- **tft_utils.py** – Supportive functions for working with the character data and evaluating team traits.

### AI Models
- **rollingAI.py** – Simple AI that selects the character generating the most synergies for the current team. Considers only the current shop and buys one character per shop.  
- **rollingAI2.py** – Advanced AI that can buy multiple characters per shop, sell unnecessary characters, and evaluate future shops to optimize team composition. Outperforms `rollingAI.py` consistently, with the advantage growing the longer it calculates.  

### Future Work
- Next AI versions could use neural networks, but due to the problem's limited complexity, the current logic-based approach (`rollingAI2.py`) is more efficient than training a neural network.
