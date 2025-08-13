import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns

# Load deck and card data
deck_df = pd.read_csv('updated_deck2.csv')  # Deck data
cards_df = pd.read_csv('all_mtg_cards.csv')  # Card details

# Extract card columns (those starting with "deck_")
card_columns = [col for col in deck_df.columns if col.startswith('deck')]

# Convert card column names to actual card names
card_names = [col.replace('deck_', '').lower() for col in card_columns]

# Function to check if a deck is **exactly UB** (no extra colors)
def is_ub_only(color_string):
    if isinstance(color_string, str):  # Ensure it's a valid string
        color_set = set(color_string.split(', '))
        return color_set == {'U', 'B'}  # Must be exactly UB
    return False  # Exclude NaN or empty values

# Filter only UB decks
ub_decks_df = deck_df[deck_df['colors_in_deck'].apply(is_ub_only)].copy()

# Create a binary matrix: 1 if the card is in the deck, 0 otherwise
deck_card_matrix = ub_decks_df[card_columns]  # Already 1s and 0s

# Apply K-Means clustering (3 clusters)
kmeans = KMeans(n_clusters=3, random_state=42)
ub_decks_df['cluster'] = kmeans.fit_predict(deck_card_matrix)

# Show how many decks belong to each cluster
print(ub_decks_df['cluster'].value_counts())

# Print a few examples from each cluster
for cluster_id in range(3):
    print(f"\n🔹 Decks in Cluster {cluster_id}:")
    print(ub_decks_df[ub_decks_df['cluster'] == cluster_id].head())

# Save the clustered UB decks to a CSV (optional)
ub_decks_df.to_csv('clustered_ub_decks.csv', index=False)

# Check if the column exists
if 'user_game_win_rate_bucket' in ub_decks_df.columns:
    # Convert to numeric (if needed)
    ub_decks_df['user_game_win_rate_bucket'] = pd.to_numeric(ub_decks_df['user_game_win_rate_bucket'], errors='coerce')

    # Calculate the average win rate per cluster
    avg_win_rate_per_cluster = ub_decks_df.groupby('cluster')['user_game_win_rate_bucket'].mean()

    # Print the results
    print(avg_win_rate_per_cluster)
else:
    print("Column 'user_game_win_rate_bucket' not found in the dataset.")

# Filter decks that belong to cluster 2
cluster_2_decks = ub_decks_df[ub_decks_df['cluster'] == 2]

# Select card columns (excluding non-card columns like 'colors_in_deck' and 'user_game_win_rate_bucket')
card_columns = [col for col in ub_decks_df.columns if col.startswith('deck_')]

# Show card names for the first few decks in Cluster 2
for idx, row in cluster_2_decks.head(3).iterrows():  # Show first 3 decks as an example
    included_cards = [col.replace('deck_', '') for col in card_columns if row[col] == 1]  # Find included cards
    print(f"\n🔹 Deck {idx} (Cluster 2) contains {len(included_cards)} cards:")
    print(", ".join(included_cards))  # Print card names as a list

    # Select card columns (columns that start with 'deck_')
card_columns = [col for col in ub_decks_df.columns if col.startswith('deck_')]

# Get top 10 most used cards per cluster
top_cards_per_cluster = {}

for cluster_id in range(3):  # Assuming we have 3 clusters
    # Filter decks in the current cluster
    cluster_decks = ub_decks_df[ub_decks_df['cluster'] == cluster_id]

    # Sum occurrences of each card in this cluster
    card_usage = cluster_decks[card_columns].sum().sort_values(ascending=False)

    # Get the top 10 most used cards
    top_cards_per_cluster[cluster_id] = card_usage.head(10)

# Print results
for cluster_id, top_cards in top_cards_per_cluster.items():
    print(f"\n🔹 Top 10 Most Used Cards in Cluster {cluster_id}:")
    for card, count in top_cards.items():
        card_name = card.replace('deck_', '')  # Remove 'deck_' prefix
        print(f"{card_name}: {count} decks")

# Select only the card columns
X = ub_decks_df[card_columns]

# Apply PCA to reduce to 2 dimensions
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Add PCA components and cluster labels to a new DataFrame
pca_df = pd.DataFrame(X_pca, columns=['PC1', 'PC2'])
pca_df['Cluster'] = ub_decks_df['cluster']

# Plot
#plt.figure(figsize=(8,6))
#sns.scatterplot(data=pca_df, x='PC1', y='PC2', hue='Cluster', palette='viridis')
#plt.title('PCA Visualization of Clusters')
#plt.show()

# First, filter land cards from the second CSV (cards_df)
land_cards_df = cards_df[cards_df['type'].str.contains('land', case=False, na=False)]

# Create a set of land cards (convert names to lowercase)
# Strip 'deck_' from column names for easier comparison
land_cards_set = set(land_cards_df['name'].str.strip().str.lower())

# Initialize a list to store land card counts for each deck
land_cards_per_deck = []

# Iterate through each row (deck) in the ub_decks_df DataFrame
for idx, row in ub_decks_df.iterrows():
    # For each deck row, go through each card column and check if it's a land card
    land_cards_in_deck = [
        card.replace('deck_', '').lower()  # Remove 'deck_' prefix and compare with land cards
        for card in row[card_columns]
        if isinstance(card, str) and card.replace('deck_', '').lower() in land_cards_set
    ]

    # Append the count of land cards in this deck
    land_cards_per_deck.append(len(land_cards_in_deck))

# Add the land cards count to the dataframe
ub_decks_df['land_cards_count'] = land_cards_per_deck

# Calculate the average land card count per cluster
land_cards_per_cluster = ub_decks_df.groupby('cluster')['land_cards_count'].mean()

# Print the result
print(land_cards_per_cluster)

deck_1_cards = [
    card.replace('deck_', '').lower()
    for card in ub_decks_df.iloc[0][card_columns]
    if isinstance(card, str)
]

deck_1_data = ub_decks_df.iloc[0][card_columns]
print("Deck 1 data (with 1s and 0s):")
print(deck_1_data)

# Get the card names where the deck column has a 1 (card present)
cards_in_deck = [
    col.replace('deck_', '')  # Remove 'deck_' prefix and get the card names
    for col, value in deck_1_data.items()
    if value == 1  # Check if the card is present (marked as 1)
]

print("Cards in Deck 1:")
print(cards_in_deck)

# Land cards set (from the second CSV)
land_cards_set = set(land_cards_df['name'].str.lower())

# Count land cards in Deck 1
land_cards_in_deck_1 = [
    card.lower() for card in cards_in_deck if card.lower() in land_cards_set
]

print(f"Land cards in Deck 1: {land_cards_in_deck_1}")
print(f"Number of land cards in Deck 1: {len(land_cards_in_deck_1)}")

# Count the total number of land cards in Deck 1, accounting for multiple instances
total_land_cards_in_deck_1 = sum(
    deck_1_data[col]  # Use the actual value (number of copies) for the land cards
    for col in deck_1_data.index
    if col.replace('deck_', '').lower() in land_cards_set  # Check if it's a land card
)

print(f"Total land cards in Deck 1 (including duplicates): {total_land_cards_in_deck_1}")

print(ub_decks_df.columns)
print(card_columns)

# Get card usage per cluster
card_freq_percentage = pd.DataFrame({
    cluster_id: (top_cards_per_cluster[cluster_id] / (ub_decks_df['cluster'] == cluster_id).sum()) * 100
    for cluster_id in range(3)  # Adjust if you have more clusters
}).fillna(0)

# Create heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(card_freq_percentage, annot=True, cmap='coolwarm', fmt='.2f', cbar_kws={'label': 'Percentage Frequency'})
plt.title("Card Usage by Cluster (Percentage Frequency)")
plt.xlabel("Cluster")
plt.ylabel("Card")
plt.show()
