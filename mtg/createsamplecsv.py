import pandas as pd

# Load your large card info CSV
df = pd.read_csv("mtg/datafiles/all_mtg_cards.csv") 

# Save just the first 50 rows to a new file
df.head(50).to_csv("mtg/datafiles/cards_sample.csv", index=False)
