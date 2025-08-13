import pandas as pd

# Load the price CSV
prices_df = pd.read_csv('scarab_prices.csv')
# Columns: Name,Tier,Chaos Price,Divine Price,Trade Link

# Load the weights CSV
weights_df = pd.read_csv('scarab_weights.csv')
# Columns: Scarab,Weight,Rarity,URL

# Merge on scarab name (assuming exact matches)
combined_df = pd.merge(prices_df, weights_df, left_on='Name', right_on='Scarab', how='inner')

# Optional: select and reorder columns you want
combined_df = combined_df[['Name', 'Weight', 'Chaos Price', 'Divine Price', 'Rarity', 'Trade Link', 'URL']]

# Save to CSV
combined_df.to_csv('combined_scarab_data.csv', index=False)

print("Combined CSV saved as combined_scarab_data.csv")
