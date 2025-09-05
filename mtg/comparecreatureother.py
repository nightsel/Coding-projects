import pandas as pd

#Results:
#It seems like having at least 6 creatures is necessary,
#the win rates between 6-13 creatures are pretty similar and after that the win
#rate starts dropping slightly. The most surprising thing is that the creature
#heavy decks are a bit worse like the ones with 14+ creatures, even though they
#are commonly played in draft. A lot of instant/sorcery spells have good win
#rates in draft even though they aren't considered that good because players
#consider creatures to be very important, even though the win rate data shows that
#low creature decks actually perform better.


# --- Paths ---
DECKS = "mtg/datafiles/updated_trimmed_deck2.csv"     # deck_* columns + won (+ maybe deck_colors)
CARDS = "mtg/datafiles/all_mtg_cards.csv"             # card DB with 'name' and 'type'
OUT   = "mtg/datafiles/creature_count_winrates.csv"

# --- Load ---
df = pd.read_csv(DECKS)
cards = pd.read_csv(CARDS)

# --- Identify deck_* columns ---
deck_cols = [c for c in df.columns if c.startswith("deck_")]

# --- (Optional but recommended) keep exactly 40-card decks ---
# Force deck_* columns to integers (non-numeric becomes 0)
df[deck_cols] = df[deck_cols].apply(pd.to_numeric, errors="coerce").fillna(0).astype(int)

# Now safe to sum
df["deck_size"] = df[deck_cols].sum(axis=1)
df = df[df["deck_size"] == 40].copy()

# --- Build unique creature name set (DEDUPLICATE!) ---
creature_names = (
    cards.loc[cards["type"].str.contains("Creature", na=False), "name"]
         .dropna()
         .drop_duplicates()
         .astype(str)
         .str.strip()
)

# Select the deck_* columns that correspond to those unique creature names
creature_cols = sorted(set(f"deck_{n}" for n in creature_names) & set(df.columns))

# --- Compute creature_count per deck (no double-counting) ---
df["creature_count"] = df[creature_cols].sum(axis=1)

# (Optional sanity) also compute land_count using the card DB for a quick check
land_names = (
    cards.loc[cards["type"].str.contains("Land", na=False), "name"]
         .dropna()
         .drop_duplicates()
         .astype(str)
         .str.strip()
)
land_cols = sorted(set(f"deck_{n}" for n in land_names) & set(df.columns))
df["land_count"] = df[land_cols].sum(axis=1)

# Sanity check: no deck should have creature_count > (40 - land_count)
impossible = df[df["creature_count"] > (40 - df["land_count"])]
if not impossible.empty:
    print("⚠️ Found decks with impossible counts (double-check names/columns):")
    print(impossible[["draft_id", "creature_count", "land_count", "deck_size"]].head())

# --- Win rate vs creature count ---
stats = (
    df.groupby("creature_count")["won"]
      .agg(win_rate="mean", deck_count="size")
      .reset_index()
      .sort_values("creature_count")
)

stats.to_csv(OUT, index=False)
print(stats.head(30))
print(f"\nSaved: {OUT}")
