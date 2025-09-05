import pandas as pd
import re

# Results:
#Surprisingly, decks have similar win rates between 2 and 12 2 drops. Only after
#the deck has 13 2 drops or more, it starts being a detriment but there is
#almost no sample size for those amounts. Overall it seems like there is a slight
#trend that having more of them is better until 8 2 drops.

# ---------- CONFIG ----------
TRIMMED_DECK = "mtg/datafiles/trimmed_deck.csv"        # one row per deck, deck_* columns = counts
ALL_CARDS     = "mtg/datafiles/all_mtg_cards.csv"       # your card DB with columns incl. 'name','cmc','type'
OUT_SUMMARY   = "mtg/datafiles/two_drop_winrates.csv"
OUT_DEBUG_11  = "mtg/datafiles/decks_with_11_two_drops_full.csv"

ONLY_CREATURES = True      # 2-drops means 2-CMC creatures
DECK_SIZE_FILTER = 40      # set to an int for exact deck size filter; or None to skip
MIN_GAMES_FLAG = [0, 1]    # which values in 'won' count as a game row

# ---------- HELPERS ----------
def canon(name: str) -> str:
    """Normalize names so DB matches deck_* columns:
       - take the front face for split/DFC (split on ' // ')
       - lower, remove non-alnum except spaces, collapse spaces.
    """
    if not isinstance(name, str):
        return ""
    name = name.split(" // ")[0]  # front face for split/adventure/DFC
    name = name.strip().lower()
    name = re.sub(r"[^0-9a-z\s]", "", name)
    name = re.sub(r"\s+", " ", name)
    return name

# ---------- LOAD ----------
df = pd.read_csv(TRIMMED_DECK)
cards = pd.read_csv(ALL_CARDS)

#add win rate column
# Identify card columns (all except 'draft_id' and 'won')
card_columns = [col for col in df.columns if col not in ['draft_id', 'won']]

# Dictionary to hold per-card win rates
card_win_rates = {}

for card in card_columns:
    included = df[df[card] >= 1]
    if not included.empty:
        card_win_rates[card] = included['won'].mean()
    else:
        card_win_rates[card] = None

# Convert to a DataFrame with same row index as df
wr_df = pd.DataFrame(
    {f"{card}_win_rate": card_win_rates[card] for card in card_columns},
    index=df.index
)

# Join all at once
df = pd.concat([df, wr_df], axis=1)

# Identify deck_* columns
deck_cols = [c for c in df.columns if c.startswith("deck_")]

# Optional: filter to exactly 40-card decks (sum of deck_* columns)
if DECK_SIZE_FILTER is not None:
    deck_sizes = df[deck_cols].sum(axis=1)
    df = df.loc[deck_sizes == DECK_SIZE_FILTER].copy()

# ---------- BUILD THE 2-DROP CREATURE SET ----------
# Ensure cmc is numeric
cards["cmc"] = pd.to_numeric(cards["cmc"], errors="coerce")

creature_mask = cards["type"].str.contains("Creature", na=False) if ONLY_CREATURES else True
two_drop_db = cards[creature_mask & (cards["cmc"] == 2)].copy()

# Canonical names from DB
two_drop_db["canon"] = two_drop_db["name"].apply(canon)
two_drop_names = set(two_drop_db["canon"])

# Map deck_* columns to canonical card names
col_to_canon = {c: canon(c.replace("deck_", "")) for c in deck_cols}

# Which deck_* columns correspond to 2-drop creatures?
two_drop_cols = [c for c in deck_cols if col_to_canon[c] in two_drop_names]

# ---------- COUNT TWO-DROPS PER DECK ----------
df["two_drop_count"] = df[two_drop_cols].sum(axis=1)

# ---------- SUMMARY: WIN RATE + FREQUENCY ----------
# We assume 'won' is 0/1 per match-row or per deck outcome; your original code averaged 'won' per deck row.
# If 'won' is per-game in this table, this is fine. If per-deck, it’s the deck’s win metric.
summary = (
    df.groupby("two_drop_count")
      .agg(
          win_rate=("won", "mean"),
          deck_count=("won", "size")
      )
      .reset_index()
      .sort_values("two_drop_count")
)

summary.to_csv(OUT_SUMMARY, index=False)
print(summary.head(20))
print(f"\nSaved summary to {OUT_SUMMARY}")

# ---------- OPTIONAL DEBUG: dump full lists for decks with exactly 11 two-drops ----------

debug_mask = df["two_drop_count"] == -1
# set to an amount that is being looked for instead of -1, for example 11.

if debug_mask.any():
    # Unpivot deck_* columns to long form to see full decklists
    deck_long = (
        df.loc[debug_mask, ["draft_id", "two_drop_count"] + deck_cols]
          .melt(id_vars=["draft_id", "two_drop_count"], var_name="deck_col", value_name="count")
    )
    deck_long = deck_long[deck_long["count"] > 0].copy()
    # Recover readable card names
    deck_long["card_name"] = deck_long["deck_col"].str.replace("^deck_", "", regex=True)
    deck_long = deck_long[["draft_id", "two_drop_count", "card_name", "count"]]
    deck_long.to_csv(OUT_DEBUG_11, index=False)
    print(f"Dumped full decklists for 11 two-drops to {OUT_DEBUG_11}")

# ---------- SANITY CHECKS ----------
#print("\nSanity checks:")
#print(f"- # of deck_* columns matched as 2-drop creatures: {len(two_drop_cols)}")
#print(f"- % of decks with 0 two-drops: {(df['two_drop_count'].eq(0).mean()*100):.1f}%")
