import pandas as pd
import json
from tft_utils import create_champ_df
from tft_utils import count_synergies
from tft_utils import generate_shop


# Create a dataframe out of tft champion data, including champion name, cost
# and traits
df = create_champ_df("tft/tftdata.json", set_number=15)


with open("tft/tftdata.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Example: assume data["setData"][0] contains "champions"
set_data = data["setData"][0]  # adjust if needed


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


shop = generate_shop(champions_by_cost, reroll_probability_8)
print(shop)


# Reroll probability manually from https://blitz.gg/tft/guides/reroll
reroll_probability_8 = [.17, .24, .32, .24, .03]

#for trait in traits_data:
    #min_units = min(effect["minUnits"] for effect in trait["effects"])
    #synergy_thresholds[trait["name"]] = min_units
#print(synergy_thresholds)

print(count_synergies(df.head(20), synergy_thresholds))

#print(diagnose_synergies(df, synergy_thresholds))

startgold = 20
stop_loop = 0
total_gold_spent = 0

while stop_loop == 0:

    reward = active_synergies_count * 10 - total_gold_spent
    stop_loop = 1
