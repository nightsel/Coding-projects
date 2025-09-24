# MTG Draft Analysis

This folder contains scripts to analyze Magic: The Gathering Arena draft data.

## Scripts
- `trimdeck.py` - Extracts relevant columns from the raw 17lands CSV dataset.
- `cardwins.py` - Calculates individual card win rates.
- `cardwinsArchetype.py` - Calculates card win rates per archetype.
- `2dropcomparison.py` - Compares impact of 2-drop creatures on deck win rates.
- `compare18landsvs17withbadcard.py` - Compares performance of decks with 18 lands vs including a bad card.
- `comparecreatureother.py` - Evaluates impact of minimum creatures in a deck.

## Data Sources
- Public 17lands draft dataset: [https://www.17lands.com/public_datasets](https://www.17lands.com/public_datasets)

More detailed analysis of functions here: [MTG Analysis](MTG_analysis.md)
