import pandas as pd

def get_deck_colors(row):
    colors = []
    if row["deck_Mountain"] > 3:
        colors.append("R")
    if row["deck_Forest"] > 3:
        colors.append("G")
    if row["deck_Island"] > 3:
        colors.append("U")
    if row["deck_Plains"] > 3:
        colors.append("W")
    if row["deck_Swamp"] > 3:
        colors.append("B")

    return "".join(sorted(colors))  # Sorting to keep consistency (e.g., "UR" instead of "RU")

file_path = "trimmed_deck.csv"
df = pd.read_csv(file_path)


df["deck_colors"] = df.apply(get_deck_colors, axis=1)

df.to_csv("updated_trimmed_deck2.csv", index=False)
