import pandas as pd
import ast  # Import ast for safely evaluating string representations of lists

# Load the CSVs
deck_df = pd.read_csv('updated_deck2.csv')  # Replace with your file path
cards_df = pd.read_csv('all_mtg_cards.csv')  # Replace with your file path

# Extract card names from column headers in deck_df
card_columns = [col for col in deck_df.columns if col.startswith('deck')]
card_names = [col.replace('deck_', '').lower() for col in card_columns]

# Define the target color combinations as sets
ub_colors = {'W'}  # UB decks (blue and black)
ur_colors = {'U'}  # UB decks (blue and black)
uw_colors = {'B'}  # UB decks (blue and black)
ug_colors = {'U', 'G'}  # UB decks (blue and black)
wurgb_colors = {'W', 'U', 'R', 'B', 'G'}  # WURBG decks (all five colors)

# Initialize counters
ub_count = 0
ur_count = 0
uw_count = 0
ug_count = 0
wurgb_count = 0

# Loop through each deck in the DataFrame
for index, row in deck_df.iterrows():
    # Ensure 'colors_in_deck' is a string and not a NaN value
    colors_in_deck = row['colors_in_deck']

    # Only proceed if it's a valid string (not NaN)
    if isinstance(colors_in_deck, str):
        deck_colors = set(colors_in_deck.split(', '))  # Split string into a set of colors
    else:
        deck_colors = set()  # If it's not a valid string, set as empty set

    # Check if the deck matches UB or WURBG
    if ub_colors == deck_colors:
        ub_count += 1
    if ur_colors == deck_colors:
        ur_count += 1
    if uw_colors == deck_colors:
        uw_count += 1
    if ug_colors == deck_colors:
        ug_count += 1
    if wurgb_colors == deck_colors:
        wurgb_count += 1


# Print the results
print(f"Number of UB decks: {ub_count}")
print(f"Number of UR decks: {ur_count}")
print(f"Number of UW decks: {uw_count}")
print(f"Number of UG decks: {ug_count}")
print(f"Number of WURBG decks: {wurgb_count}")


# Define the full set of 5 colors
all_colors = {'W', 'U', 'B', 'R', 'G'}

# Counter for the number of decks found
decks_found = 0

# Loop through all decks until we find 10
for index, row in deck_df.iterrows():
    # Get the colors present in this deck
    deck_colors = set(row['colors_in_deck'].split(', '))  # Convert to set

    # Check if this deck contains all 5 colors
    if all_colors.issubset(deck_colors):
        print(f"\nDeck {index} contains all 5 colors: {deck_colors}")

        # Extract the card names in this deck
        included_cards = []
        for col in card_columns:
            if row[col] == 1:  # If the card is included (1), add it
                included_cards.append(card_names[card_columns.index(col)])

        # Print the cards in the deck
        print("Cards in this deck:")
        print(", ".join(included_cards))

        # Increment counter and stop after 10 decks
        decks_found += 1
        if decks_found == 10:
            break  # Stop after finding 10 decks
