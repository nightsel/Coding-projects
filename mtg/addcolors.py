import pandas as pd

def get_deck_colors(row):
    colors = []
    if row["deck_Mountain"]+ row["deck_Boros Guildgate"]  + row["deck_Gruul Guildgate"] + row["deck_Izzet Guildgate"] +row["deck_Rakdos Guildgate"]> 3:
        colors.append("R")
    if row["deck_Forest"] +row["deck_Golgari Guildgate"] + row["deck_Gruul Guildgate"] + row["deck_Selesnya Guildgate"] + row["deck_Simic Guildgate"]> 3:
        colors.append("G")
    if row["deck_Island"]+row["deck_Azorius Guildgate"] +row["deck_Dimir Guildgate"] + row["deck_Izzet Guildgate"] + row["deck_Simic Guildgate"]> 3:
        colors.append("U")
    if row["deck_Plains"]+row["deck_Azorius Guildgate"] +row["deck_Boros Guildgate"] + row["deck_Orzhov Guildgate"] + row["deck_Selesnya Guildgate"]> 3:
        colors.append("W")
    if row["deck_Swamp"] +row["deck_Dimir Guildgate"] + row["deck_Golgari Guildgate"] + row["deck_Orzhov Guildgate"] + row["deck_Rakdos Guildgate"]> 3:
        colors.append("B")

    return "".join(sorted(colors))  # Sorting to keep consistency (e.g., "UR" instead of "RU")

file_path = "mtg/datafiles/trimmed_deck40.csv"
df = pd.read_csv(file_path)


df["deck_colors"] = df.apply(get_deck_colors, axis=1)

df.to_csv("mtg/datafiles/updated_trimmed_deck2.csv", index=False)
