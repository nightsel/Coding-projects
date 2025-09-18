import pandas as pd
import json
from tft_utils import create_champ_df
from tft_utils import count_synergies
from tft_utils import generate_shop
from tft_utils import pick_best_champion
from tft_utils import simulate_shop_turn
from tft_utils import top_synergy_team


# Create a dataframe out of tft champion data, including champion name, cost
# and traits
df = create_champ_df("tft/tftdata.json", set_number=15)

# Build champions_by_cost with full info
champions_by_cost = {
    cost: df[df["cost"] == cost].to_dict(orient="records")
    for cost in range(1, 6)
}


with open("tft/tftdata.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Example: assume data["setData"][4] contains traits

set_data2 = data["setData"][4]  # adjust if needed


# Extract only TFT15 traits
tft15_traits = [
    item for item in set_data2.get("traits", [])
    if "TFT15_" in item.get("apiName", "")
    and not item.get("apiName", "").startswith("TFT15_MechanicTrait")
]

# Build synergy thresholds automatically
synergy_thresholds = {
    trait["name"]: [effect["minUnits"] for effect in trait["effects"]]
    for trait in tft15_traits
}

# Reroll probability manually from https://blitz.gg/tft/guides/reroll
reroll_probability_8 = [.17, .24, .32, .24, .03]

currentgold = 20
stop_loop = 0
total_gold_spent = 0
board = pd.DataFrame(columns=["name", "cost", "traits"])

# The Crew synergy is bugged within data file, so it needs to be input manually
synergy_thresholds["The Crew"] = [2, 3, 4, 5]


while stop_loop != 10:
    #active_synergies_count = count_synergies(board, synergy_thresholds)
    shop = generate_shop(champions_by_cost, reroll_probability_8)
    #champ_to_buy = pick_best_champion(board, shop, synergy_thresholds, currentgold)
    #print(f"AI buys: {champ_to_buy['name']} ({champ_to_buy['traits']})")
    #board = pd.concat([board, pd.DataFrame([champ_to_buy])], ignore_index=True)
    board, currentgold, b, sold = simulate_shop_turn(board,shop,currentgold,synergy_thresholds)
    #currentgold -= champ_to_buy["cost"]
    #total_gold_spent += champ_to_buy["cost"]
    df_limited = top_synergy_team(board, synergy_thresholds, max_units=8)
    #print(count_synergies(df_limited, synergy_thresholds))
    #reward = len(active_synergies_count) * 10 - total_gold_spent
    stop_loop += 1

print(board)
df_limited = top_synergy_team(board, synergy_thresholds, max_units=8)
print(count_synergies(df_limited, synergy_thresholds))
