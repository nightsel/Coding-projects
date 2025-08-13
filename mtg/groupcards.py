import pandas as pd


# Load the CSVs
deck_df = pd.read_csv("mtg/datafiles/updated_deck2.csv")
# Calculate total card count per deck
deck_df["total_cards"] = deck_df.filter(like="deck_").sum(axis=1)

# Keep only decks with 56 or fewer cards
deck_df = deck_df[deck_df["total_cards"] <= 56]

# Drop the temporary "total_cards" column (optional)
deck_df = deck_df.drop(columns=["total_cards"])


card_data = pd.read_csv("mtg/datafiles/all_mtg_cards.csv")  # Replace with actual file
card_data = card_data.drop_duplicates(subset=["name"])



card_df = pd.read_csv("mtg/datafiles/all_mtg_cards.csv")

# Identify all cards with mana value = 2
card_df = card_df.drop_duplicates(subset=["name"])
two_drops = card_df[card_df["cmc"] == 2]["name"].tolist()
two_drops = list(set(two_drops))
print(f"Identified {len(two_drops)} two-drops: {two_drops[:10]}")  # Show a preview
print([f'deck_{card}' for card in two_drops[:10]])  # Check formatted names

# Retrieve the CMC of the first 10 two-drop cards
cmc_values = card_df[card_df["name"].isin(two_drops[:10])][["name", "cmc"]]

# Print the card names along with their CMC
print(cmc_values)

deck_df = pd.read_csv("mtg/datafiles/updated_deck2.csv")


# Format `two_drops` to match `deck_df` column names (capitalize words)
two_drops_formatted = [f"deck_{card}" for card in two_drops]

for card in two_drops[:10]:
    actual_cmc = card_df.loc[card_df['name'].str.lower() == card.lower(), 'cmc']
    print(f"{card}: {actual_cmc.values}")
    #actual_cmc = card_df.loc[card_df['name'].str.lower() == card.lower(), 'cmc'].iloc[0] if not card_df.loc[card_df['name'].str.lower() == card.lower(), 'cmc'].empty else None
    #print(f"{card}: {actual_cmc}")

print(deck_df.head())


# Get only the ones that exist in `deck_df`
two_drops_in_decks = [col for col in two_drops_formatted if col in deck_df.columns]


# Create a new column counting the number of 2-drops in each deck
deck_df['num_two_drops'] = deck_df[two_drops_in_decks].sum(axis=1)

high_two_drop_decks = deck_df[deck_df["num_two_drops"] > 16]  # Adjust threshold as needed
high_two_drop_decks = high_two_drop_decks.drop_duplicates(subset=["draft_id"])
print(high_two_drop_decks[["draft_id", "num_two_drops"]])  # Show problem decks

deck_id_to_check = high_two_drop_decks.iloc[0]['draft_id']  # Pick one suspicious deck
deck_cards = deck_df.set_index("draft_id").filter(like="deck_")  # Keep only deck columns
#deck_cards = deck_df.loc[deck_df['draft_id'] == deck_id_to_check, two_drops_in_decks]
#deck_cards_list = (deck_cards.T[0] > 0).index.tolist()

#deck_cards = deck_cards.T[deck_cards.T[deck_id_to_check] > 0].index.tolist()  # Get cards included
#print('heres the deck')


#deck_id_to_check = "5d3788a96bb0466caf011cd062863140"  # Example draft ID

# Step 1: Get all rows matching the draft ID
#matching_rows = deck_cards.loc[deck_id_to_check]  # Get all rows where draft_id matches

# Step 2: If there are multiple rows, sum them to get total card counts
#if isinstance(matching_rows, pd.DataFrame):
#    deck_row = matching_rows.iloc[0]  # Take the first row instead of summing
#else:
    #deck_row = matching_rows  # If only one row exists, keep it as is


# Step 1: Filter cards with count > 0
#filtered = deck_row[deck_row > 0]

# Step 2: Expand the list by repeating each card based on its count
#deck_card_list = []
#for card, count in filtered.items():
#    deck_card_list.extend([card] * int(count))  # Repeat the card 'count' times

# Step 3: Remove "deck_" prefix for readability
#deck_card_list = [card.replace("deck_", "") for card in deck_card_list]

#decklist = pd.read_csv('deck_cmc_analysis.csv')


#deck_dftest = filtered.reset_index()

#deck_dftest.columns = ['name', 'count']
#deck_dftest['name'] = deck_dftest['name'].str.replace('deck_', '', regex=False)

#print(deck_dftest.columns)
#print(decklist.columns)


#merge them
#combined_df = pd.merge(deck_dftest, decklist, on='name', how='left')

# Step 4: Print result

#print(filtered)
#print(combined_df)

# Step 1: Count total cards in the deck
#num_cards = len(deck_card_list)  # Number of unique card names in the deck

# Step 2: Create a DataFrame with card names and their CMC
#card_cmc_df = card_data[card_data["name"].isin([card.replace("deck_", "") for card in deck_card_list])][["name", "cmc"]]

# Step 3: Sort by CMC for easier readability
#card_cmc_df = card_cmc_df.sort_values(by="cmc")

# Step 4: Display the results
#print(f"Total number of unique cards: {num_cards}")
#print(card_cmc_df)


# Check the column names of the DataFrame
print(deck_df.columns)


# Group by number of 2-drops and calculate average win rate
#grouped = deck_df.groupby("num_two_drops")["user_game_win_rate_bucket"].mean().reset_index()
grouped = deck_df.groupby("num_two_drops").agg(
    avg_win_rate=("user_game_win_rate_bucket", "mean"),
    num_decks=("user_game_win_rate_bucket", "size")
).reset_index()

print(two_drops_in_decks[:10])  # Show first 10 deck column names for 2-drops

print([col for col in deck_df.columns if col.startswith("deck_")][:10])

# Show the average win rate for each count of 2-drops
print(grouped)


import matplotlib.pyplot as plt
import seaborn as sns


# Line plot to see the trend
plt.figure(figsize=(10, 5))
sns.lineplot(data=grouped, x="num_two_drops", y="user_game_win_rate_bucket", marker="o")

plt.xlabel("Number of 2-Drops in Deck")
plt.ylabel("Average Win Rate")
plt.title("Win Rate Based on 2-Drop Count")
plt.grid()
plt.show()
