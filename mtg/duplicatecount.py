import pandas as pd

# Load the CSV file
file_path = "trimmed_deck.csv"
df = pd.read_csv(file_path)

# Count duplicate rows
duplicate_rows = df.duplicated().sum()
duplicate_rows

print(duplicate_rows)

df_no_duplicates = df.drop_duplicates()

df_no_duplicates.to_csv("cleaned_file.csv", index=False)
