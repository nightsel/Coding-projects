import pandas as pd

# Load the first CSV (deck information)
deck_df = pd.read_csv('trimmed_deck.csv')  # Replace with your file path



card_columns = [col for col in deck_df.columns if col.startswith('deck')]


numeric_cards = []
for col in card_columns:
    # Find rows where the card name is numeric
    numeric_cards.extend(deck_df[deck_df[col].apply(lambda x: str(x).isdigit())][col].tolist())

# Print the numeric card names
if numeric_cards:
    print("Numeric card names found:")
    print(len(numeric_cards))
else:
    print("No numeric card names found.")

# Load the second CSV (card information)
cards_df = pd.read_csv('all_mtg_cards.csv')  # Replace with your file path

# Extract and clean the card names from the deck dataframe
deck_cards = []
for col in card_columns:
    deck_cards.extend(deck_df[col].dropna().tolist())  # Drop NaN values and extract card names

# Remove the "deck_" prefix and convert to lowercase
deck_cards = [card.replace('deck_', '').lower() for card in deck_cards]

# Ensure the card names in cards.csv are in lowercase
cards_df['name'] = cards_df['name'].str.lower()

# Filter the cards.csv to only include cards that are in the deck
deck_cards_df = cards_df[cards_df['name'].isin(deck_cards)]

# Count the number of cards for each color
color_counts = deck_cards_df['color'].value_counts()

# Create a new column in deck.csv to mark colors with 4 or more cards
deck_df['has_4_or_more_cards'] = False  # Initialize the column

# Check for colors with 4 or more cards
for color, count in color_counts.items():
    if count >= 4:
        # Mark the deck if any card in the deck has this color
        deck_df['has_4_or_more_cards'] = deck_df['has_4_or_more_cards'] | deck_cards_df['color'].eq(color).any()

# Save the updated dataframe to a new CSV (optional)
deck_df.to_csv('updated_deck.csv', index=False)

# Print the result
print(deck_df)
