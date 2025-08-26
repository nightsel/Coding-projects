import pandas as pd

# Define file paths
deck_csv_path = "mtg/datafiles/game_data_public.PIO.PremierDraft.csv"  # Replace with actual path
trimmed_csv_path = "mtg/datafiles/trimmed_deck40.csv"  # Output path for trimmed file

deck_df = pd.read_csv(deck_csv_path)

print(deck_df.columns.tolist())

# Select the relevant columns
deck_columns = [col for col in deck_df.columns if col.startswith("deck_")]
columns_to_keep = deck_columns + ["draft_id", "won"]

# Trim the dataframe
trimmed_deck_df = deck_df[columns_to_keep]

# --- Filter to only 40-card decks ---
trimmed_deck_df["deck_size"] = trimmed_deck_df[deck_columns].sum(axis=1)
trimmed_deck_df = trimmed_deck_df[trimmed_deck_df["deck_size"] == 40]

# Drop helper column if you don’t want it in the CSV
trimmed_deck_df = trimmed_deck_df.drop(columns=["deck_size"])

# Save the trimmed CSV
trimmed_deck_df.to_csv(trimmed_csv_path, index=False)

print(f"Trimmed CSV saved to '{trimmed_csv_path}'. {len(trimmed_deck_df)} decks kept.")
