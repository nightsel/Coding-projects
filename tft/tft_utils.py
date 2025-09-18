import json
import pandas as pd
from collections import Counter
import random


def create_champ_df(filepath, set_number=15):
    """
    Load TFT traits data from a JSON file and return a DataFrame.

    Args:
        filepath (str): Path to the JSON file.
        set_number (int): TFT set number to filter (default 15).

    Returns:
        pd.DataFrame: DataFrame with columns name, cost, traits.
    """
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        setdata = data["setData"]

        # Flatten champions
        all_champions = []
        if isinstance(setdata, list):
            for s in setdata:
                all_champions.extend(s.get("champions", []))
        elif isinstance(setdata, dict):
            all_champions = setdata.get("champions", [])

    # Filter by set number in 'characterName' and remove champions with no traits
    set_champs = [
        c for c in all_champions
        if f"TFT{set_number}_" in c["characterName"] and c.get("traits")
    ]

    # Build DataFrame
    all_champs = []
    for champ in set_champs:
        all_champs.append({
            "name": champ["name"],
            "cost": champ["cost"],
            "traits": ", ".join(champ["traits"])
        })

    df = pd.DataFrame(all_champs)
    return df

def score_champion(df, champ, thresholds):
    """Return how many NEW synergies this champ adds if bought."""
    active_before = set(t for t, _ in count_synergies(df, thresholds))

    # Add champ using concat instead of append
    df_candidate = pd.concat([df, pd.DataFrame([champ])], ignore_index=True)
    active_after = set(t for t, _ in count_synergies(df_candidate, thresholds))

    return len(active_after - active_before)

def simulate_shop_turn(df, shop, gold, thresholds):
    bought = []
    sold = []

    # --- Rank shop units by how good they are ---
    ranked_shop = sorted(
        shop,
        key=lambda champ: (score_champion(df, champ, thresholds), -champ["cost"]),
        reverse=True
    )

    # --- Try to buy in order of priority ---
    for champ in ranked_shop:
        if gold >= champ["cost"]:
            df = pd.concat([df, pd.DataFrame([champ])], ignore_index=True)
            gold -= champ["cost"]
            bought.append(champ["name"])
        else:
            # Try to sell bench fillers to afford this champ
            while gold < champ["cost"] and not df.empty:
                df_limited = top_synergy_team(df, thresholds, max_units=8)
                active_before = set(t for t, _ in count_synergies(df_limited, thresholds))
                worst_idx = None

                for i, row in df.iterrows():
                    df_candidate = df.drop(i)
                    active_after = set(t for t, _ in count_synergies(df_candidate, thresholds))
                    if active_before == active_after:  # safe to sell
                        worst_idx = i
                        break

                if worst_idx is not None:
                    sold.append(df.loc[worst_idx, "name"])
                    gold += df.loc[worst_idx, "cost"]
                    df = df.drop(worst_idx).reset_index(drop=True)
                else:
                    break

            # Retry purchase if now affordable
            if gold >= champ["cost"]:
                df = pd.concat([df, pd.DataFrame([champ])], ignore_index=True)
                gold -= champ["cost"]
                bought.append(champ["name"])

    return df, gold, bought, sold

def top_synergy_team(df, thresholds, max_units=8):
    """
    Return a reduced DataFrame of up to max_units champions
    that maximize synergies.
    """
    df = df.drop_duplicates(subset=["name"])

    if len(df) <= max_units:
        return df.copy()

    # Start greedy: pick units that add the most new synergies one by one
    chosen = pd.DataFrame(columns=df.columns)
    remaining = df.copy()

    while len(chosen) < max_units and not remaining.empty:
        best_unit = None
        best_gain = -1

        for i, row in remaining.iterrows():
            trial = pd.concat([chosen, pd.DataFrame([row])], ignore_index=True)
            gain = len(count_synergies(trial, thresholds)) - len(count_synergies(chosen, thresholds))
            if gain > best_gain:
                best_gain = gain
                best_unit = i

        # Add the best unit and remove it from pool
        chosen = pd.concat([chosen, pd.DataFrame([remaining.loc[best_unit]])], ignore_index=True)
        remaining = remaining.drop(best_unit)

    return chosen



def count_synergies(df, thresholds):
    """
    Count synergies in a DataFrame of champions with traits as strings.
    thresholds = {"Sorcerer": [2, 4, 6], "Juggernaut": [2, 4], ...}
    """

    # Only unique champions by name
    unique_df = df.drop_duplicates(subset=["name"])

    trait_counts = Counter()

    for _, row in unique_df.iterrows():
        traits = [t.strip() for t in row["traits"].split(",") if t.strip()]
        for trait in traits:
            trait_counts[trait] += 1

    active_synergies = []
    for trait, count in trait_counts.items():
        if trait == "Mentor":
            # special rule: only counts at 1 or 4
            if count == 1 or count >= 4:
                active_synergies.append((trait, count))
        elif trait in thresholds:
            for threshold in thresholds[trait]:
                if count >= threshold:
                    active_synergies.append((trait, threshold))

    return active_synergies
    
def generate_shop(champions_by_cost, probabilities, shop_size=5):
    """
    Generate a random shop of champions according to cost probabilities.
    shop_size = number of slots in shop (usually 5)
    """
    shop = []
    costs = [1, 2, 3, 4, 5]
    # Reroll probability manually from https://blitz.gg/tft/guides/reroll

    for _ in range(shop_size):
        # pick a cost according to probabilities
        cost = random.choices(costs, weights=probabilities, k=1)[0]
        # pick a champion of that cost randomly
        champ = random.choice(champions_by_cost[cost])
        shop.append(champ)

    return shop

def pick_best_champion(board, shop, thresholds, gold):
    """
    board: list of champion dicts already on board
    shop: list of champion dicts available this turn
    thresholds: synergy thresholds dict
    """
    best_champ = None
    best_synergy_gain = -1

    for champ in shop:
        # after AI picks champ_to_buy
        new_board = pd.concat([board, pd.DataFrame([champ])], ignore_index=True)

        new_synergies = count_synergies(new_board, thresholds)
        current_synergies = count_synergies(board, thresholds)

        # calculate how many new synergies this champion would give
        gain = len(new_synergies) - len(current_synergies)
        if (gain > best_synergy_gain) & (champ['cost'] <= gold):
            best_synergy_gain = gain
            best_champ = champ


    return best_champ
