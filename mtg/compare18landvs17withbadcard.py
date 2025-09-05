import pandas as pd
import matplotlib.pyplot as plt # for debugging

#Results:
#Based on looking at data including card "Stampeding Elk Herd", it seems
#like it's a better idea to play with 18 lands than to include this bad card in
#the deck. A good card like Courier's Briefcase breaks even with a 18 lands deck.
#Because green colour is known for being better with more lands than other colours,
#I checked black colour too with cards Baleful Eidolon (a bad card) and Gurmag
#Angler (a decent card). The results were similar, so playing with 18 lands
#seemed more beneficial than adding a bad card to the deck.
#I had some trouble finding decks with exactly 17 land cards because cards like
#Bala Ged Recovery are not part of the source csv because their name doesn't
#match exactly due to being a dual faced card. But I tried my best to fix the
#problem.

# Load datasets
df = pd.read_csv("mtg/datafiles/updated_trimmed_deck2.csv")
all_cards = pd.read_csv("mtg/datafiles/all_mtg_cards.csv")

# Get all land names from all_mtg_cards (type contains "Land")
land_names = all_cards[all_cards["type"].str.contains("Land", na=False)]["name"].tolist()


# Convert to deck_* column names that exist in df
land_columns = [
    col for col in df.columns if col.startswith("deck_")
    and any(col.replace("deck_", "").lower() in name.lower() for name in land_names)
]
print("Number of land columns found:", len(land_columns))
print(land_columns[:50])  # preview

# Add land_count column to df
deck_land_columns = [col for col in df.columns if col.startswith("deck_") and col in land_columns]
df["land_count"] = df[deck_land_columns].sum(axis=1)

# Count how many decks have each total land count
land_count_freq = df["land_count"].value_counts().sort_index()

print(land_count_freq)

# Optional: plot it
#plt.bar(land_count_freq.index, land_count_freq.values)
#plt.xlabel("Number of lands in deck")
#plt.ylabel("Number of decks")
#plt.title("Distribution of total land counts per deck")
#plt.show()

# --- Group 1: 17 lands + ≥1 Elk Herd ---
#col_name = "deck_Courier's Briefcase"
#col_name = "deck_Stampeding Elk Herd"
col_name = "deck_Gurmag Angler"
group1_mask = (df["land_count"] == 17) & (df[col_name] >= 1)

group1 = df[group1_mask]

# --- Group 2: 18 lands + green deck ---
#group2_mask = (df["land_count"] == 18) & (df["deck_colors"].str.contains("G",na=False))
# --- Group 2: 18 lands + black deck ---
group2_mask = (df["land_count"] == 18) & (df["deck_colors"].str.contains("B",na=False))
group2 = df[group2_mask]

# Results
results = {
    "17 lands + Added card deck": {
        "deck_count": len(group1),
        "win_rate": group1["won"].mean() if len(group1) > 0 else None
    },
    "18 lands deck with a fixed color": {
        "deck_count": len(group2),
        "win_rate": group2["won"].mean() if len(group2) > 0 else None
    }
}

print(results)
