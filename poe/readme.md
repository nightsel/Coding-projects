# Path of Exile Scripts

## Scarab Analysis
- **scarabs_weights.py** – collects all scarab names from https://poedb.tw/us/Scarab, assigns weights based on rarity, and outputs a CSV.
- **scarabs.py** – retrieves scarab prices from poe.ninja API and outputs a CSV.
- **combine_scarab_csvs.py** – merges scarab names, weights, and prices into one CSV.
- **scarabcalcs.py** – calculates average scarab value and useful trading insights.

## Sanctum Simulation
- **calcsanc.py** – simulates outcomes for different items in the Sanctum game mode to see which items maximize rewards.

## Tainted Divine Teardrops
- **teardropcalc.py** – calculates how many "Tainted Divine Teardrops" are needed to reach the best expected outcome.

## Path of Exile 2 Item Simulation
- **tanglecalc.py** – simulates expected value of items with random outcomes; accounts for multiple layers of randomness.

More detailed analysis of these scripts can be found here: [Path of Exile Analysis](PoE_analysis.md)
