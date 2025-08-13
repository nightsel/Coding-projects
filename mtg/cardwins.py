import pandas as pd

# Load the CSV
df = pd.read_csv("mtg/datafiles/trimmed_deck.csv")

# Identify card columns (all except 'draft_id' and 'won')
card_columns = [col for col in df.columns if col not in ['draft_id', 'won']]

# Dictionary to store win rates for each card
card_win_rates = {}

# Calculate average win rate for each card

for card in card_columns:
     # Make sure to select rows where the card column == 1
    included = df[df[card] == 1].copy()

    if not included.empty:
        # Count rows where won is 1
        wins = included[included['won'] == 1].shape[0]
        # Count rows where won is 0 or 1
        total = included[included['won'].isin([0,1])].shape[0]
        card_win_rates[card] = wins / total

# Convert to DataFrame
card_win_rate_df = pd.DataFrame.from_dict(card_win_rates, orient='index', columns=['won'])
card_win_rate_df.reset_index(inplace=True)
card_win_rate_df.rename(columns={'index': 'card_name'}, inplace=True)

# Sort by win rate (highest to lowest)
card_win_rate_df = card_win_rate_df.sort_values(by='won', ascending=False)

# Save to a new CSV
card_win_rate_df.to_csv("mtg/datafiles/card_win_rates_sorted.csv", index=False)

print(card_win_rate_df.head())  # Show top results
