import pandas as pd

# Define file paths
draft_csv_path = "draft_data_public.PIO.PremierDraft.csv"  # Replace with the path to your draft CSV
deck_csv_path = "game_data_public.PIO.PremierDraft.csv"   # Replace with the path to your deck CSV

# Open the draft and deck files as iterators
draft_iter = pd.read_csv(draft_csv_path, chunksize=1000)
deck_df = pd.read_csv(deck_csv_path)

# Filter results incrementally
with open("filtered_matches.csv", "w") as output_file:
    header_written = False
    for draft_chunk in draft_iter:
        # Perform an inner merge on each chunk
        merged_chunk = pd.merge(draft_chunk, deck_df, on="draft_id", how="inner")

        # Write to output in append mode
        merged_chunk.to_csv(output_file, index=False, header=not header_written)
        header_written = True

print("Filtered matches saved to 'filtered_matches.csv'.")
