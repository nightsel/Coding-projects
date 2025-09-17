import json
import pandas as pd
from collections import Counter
import random

def create_champ_df(filepath, set_number=15):
    """
    Load TFT champion data from a JSON file and return a DataFrame.

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

    # Filter by set number in 'characterName'
    set_champs = [c for c in all_champions if f"TFT{set_number}_" in c["characterName"]]

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



def count_synergies(df, thresholds):
    """
    Count synergies in a DataFrame of champions with traits as strings.
    thresholds = {"Sorcerer": [2, 4, 6], "Juggernaut": [2, 4], ...}
    """

    trait_counts = Counter()

    for _, row in df.iterrows():
        traits = [t.strip() for t in row["traits"].split(",") if t.strip()]
        for trait in traits:
            trait_counts[trait] += 1

    active_synergies = []
    for trait, count in trait_counts.items():
        if trait in thresholds:
            if trait == "Mentor":
                if count == 1 or count == 4:
                    active_synergies.append((trait, count))
                continue
            # normal handling for other traits
            trait_thresholds = sorted(thresholds[trait])
            active_threshold = None

            for i, th in enumerate(trait_thresholds):
                if count >= th and (i == len(trait_thresholds)-1 or count < trait_thresholds[i+1]):
                    active_threshold = th
            if active_threshold is not None:
                active_synergies.append((trait, active_threshold))

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
