import pandas as pd
import ast  # For converting string representations of lists

# Load the CSVs
deck_df = pd.read_csv('mtg/datafiles/trimmed_deck.csv')  # Replace with your file path
cards_df = pd.read_csv('mtg/datafiles/all_mtg_cards.csv')  # Replace with your file path

# Extract card names from column headers in deck_df
card_columns = [col for col in deck_df.columns if col.startswith('deck')]
card_names = [col.replace('deck_', '').lower() for col in card_columns]

# Ensure the card names in the second CSV are lowercase
cards_df['name'] = cards_df['name'].str.lower()

# Filter out land cards
non_land_cards_df = cards_df[~cards_df['type'].str.contains('Land', na=False, case=False)]

# Convert 'colors' column properly
def safe_parse_colors(color_entry):
    if pd.isna(color_entry) or color_entry == "":  # Handle colorless cards
        return []
    try:
        return ast.literal_eval(color_entry)  # Convert from string to list
    except (ValueError, SyntaxError):
        return []  # In case of malformed data, return an empty list

# Apply function to clean up colors
non_land_cards_df['colors'] = non_land_cards_df['colors'].apply(safe_parse_colors)

# Initialize a new column for colors with 4 or more occurrences
deck_df['colors_in_deck'] = ""

# Count colors properly for each deck row
for index, row in deck_df.iterrows():
    included_cards_row = []
    for col in card_columns:
        if row[col] == 1:
            included_cards_row.append(card_names[card_columns.index(col)])

    # Get non-land cards in the deck
    deck_non_land_cards = non_land_cards_df[non_land_cards_df['name'].isin(included_cards_row)]

    # Get colors only from non-land cards
    colors_in_deck = deck_non_land_cards['colors'].tolist()

    # Count individual colors
    color_count = {}
    for color_list in colors_in_deck:
        for color in color_list:  # Now this is a real list, not a string!
            color_count[color] = color_count.get(color, 0) + 1

    # Find colors with 4 or more cards
    colors_with_4_or_more = [color for color, count in color_count.items() if count >= 4]

    # Store the result in the DataFrame
    deck_df.at[index, 'colors_in_deck'] = ', '.join(colors_with_4_or_more)

# Save the updated deck CSV (optional)
deck_df.to_csv('mtg/datafiles/updated_deck2.csv', index=False)

# Print the result
print(deck_df)
