import pandas as pd
import json
from tft_utils import create_champ_df
from tft_utils import count_synergies
from tft_utils import generate_shop
from tft_utils import pick_best_champion
from tft_utils import simulate_shop_turn
from tft_utils import top_synergy_team
from tft_utils import monte_carlo_shop_turn


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

# The Crew synergy is bugged within data file, so it needs to be input manually
synergy_thresholds["The Crew"] = [2, 3, 4, 5]

# Reroll probability manually from https://blitz.gg/tft/guides/reroll
reroll_probability_8 = [.17, .24, .32, .24, .03]
iterations_of_algorithm = 10
synergies_found_total = 0
monte_carlo_sims = 100
for i in range(iterations_of_algorithm):
    currentgold = 20
    stop_loop = 0
    total_gold_spent = 0
    board = pd.DataFrame(columns=["name", "cost", "traits"])


    while stop_loop != 10:

        shop = generate_shop(champions_by_cost, reroll_probability_8)

        board, currentgold, b, sold = monte_carlo_shop_turn(board,shop,currentgold,synergy_thresholds, champions_by_cost, reroll_probability_8, monte_carlo_sims)



        stop_loop += 1
    df_limited = top_synergy_team(board, synergy_thresholds, max_units=8)
    synergies_found_total = synergies_found_total + len(count_synergies(df_limited, synergy_thresholds))
    print(count_synergies(df_limited, synergy_thresholds))


print(synergies_found_total/iterations_of_algorithm)

#[('Mentor', 1), ('The Crew', 2), ('The Crew', 3), ('Sniper', 2), ('Protector', 2), ('Edgelord', 2), ('Star Guardian', 2), ('Star Guardian', 3)]
"""

Python - RollingAI2.py:62
      name cost                              traits
0    Viego    3               Soul Fighter, Duelist
1    Xayah    2             Star Guardian, Edgelord
2   Kennen    1  Supreme Cells, Protector, Sorcerer
3  Naafiri    1            Soul Fighter, Juggernaut
4   Kai'Sa    2              Supreme Cells, Duelist
5   Kobuko    2                 Mentor, Heavyweight
6     Lulu    3                     Monster Trainer
7      Lux    2              Soul Fighter, Sorcerer
8    Poppy    4          Star Guardian, Heavyweight
[('Mentor', 1), ('Heavyweight', 2), ('Monster Trainer', 1), ('Star Guardian', 2), ('Soul Fighter', 2), ('Duelist', 2), ('Supreme Cells', 2)]

       name cost                                  traits
0   Naafiri    1                Soul Fighter, Juggernaut
1    Syndra    1  Crystal Gambit, Star Guardian, Prodigy
2      Rell    1                  Star Guardian, Bastion
3        Vi    2              Crystal Gambit, Juggernaut
4      Ahri    3                 Star Guardian, Sorcerer
5      Udyr    3             Mentor, Juggernaut, Duelist
6    Lucian    1                   Mighty Mech, Sorcerer
7    Ezreal    1                Battle Academia, Prodigy
8  Xin Zhao    2                   Soul Fighter, Bastion
9   Naafiri    1                Soul Fighter, Juggernaut
[('Mentor', 1), ('Juggernaut', 2), ('Soul Fighter', 2), ('Bastion', 2), ('Star Guardian', 2), ('Star Guardian', 3), ('Prodigy', 2), ('Sorcerer', 2)]

7.3 on average for 50 sims
7.8 for 100 sims

This algorithm is clearly better than the simple version although more time consuming.

"""
