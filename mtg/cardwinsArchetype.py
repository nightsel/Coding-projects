import pandas as pd

# Load the CSV that already has the "deck_colors" column
df = pd.read_csv("mtg/datafiles/updated_trimmed_deck2.csv")

# Identify card columns (all except 'draft_id', 'won', and 'deck_colors')
card_columns = [col for col in df.columns if col not in ['draft_id', 'won', 'deck_colors']]

# Dictionary to store results per archetype
archetype_results = {}

# Loop through each archetype
for archetype, group in df.groupby("deck_colors"):
    card_stats = []

    for card in card_columns:


        included = group[group[card] == 1].copy()
        total = included[included['won'].isin([0, 1])].shape[0]
        wins = included[included['won'] == 1].shape[0]

        if total >= 500:  # ✅ only consider cards played 500+ times
            win_rate = wins / total if total > 0 else 0
            card_stats.append({"card_name": card, "win_rate": win_rate, "times_played": total})

    # Convert to DataFrame
    card_win_rate_df = pd.DataFrame(card_stats)

    if not card_win_rate_df.empty:
        # Sort by win_rate and keep top 10
        top_10 = card_win_rate_df.sort_values(by='win_rate', ascending=False).head(10)

        # Save in dictionary
        archetype_results[archetype] = top_10

        # Save each archetype's results to CSV
        top_10.to_csv(f"mtg/datafiles/top10_cards_{archetype}.csv", index=False)

# Example output in console
for archetype, df_top in archetype_results.items():
    print(f"Archetype: {archetype}")
    print(df_top)
    print()
