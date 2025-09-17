import json
import pandas as pd
from collections import Counter

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

    for _ in range(shop_size):
        # pick a cost according to probabilities
        cost = random.choices(costs, weights=probabilities, k=1)[0]
        # pick a champion of that cost randomly
        champ = random.choice(champions_by_cost[cost])
        shop.append(champ)

    return shop
