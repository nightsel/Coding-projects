import pandas as pd

# Define file paths
deck_csv_path = "mtg/datafiles/game_data_public.PIO.PremierDraft.csv"  # Replace with actual path
trimmed_csv_path = "mtg/datafiles/trimmed_deck.csv"  # Output path for trimmed file

deck_df = pd.read_csv(deck_csv_path)

print(deck_df.columns.tolist())

# Select the relevant columns
columns_to_keep = [col for col in deck_df.columns if col.startswith("deck_")]
columns_to_keep += ["draft_id", "won"]

# Trim the dataframe
trimmed_deck_df = deck_df[columns_to_keep]

# Save the trimmed CSV
trimmed_deck_df.to_csv(trimmed_csv_path, index=False)

print(f"Trimmed CSV saved to '{trimmed_csv_path}'.")
