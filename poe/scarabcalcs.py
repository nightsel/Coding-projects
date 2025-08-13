import pandas as pd

# Load combined CSV
df = pd.read_csv('combined_scarab_data.csv')

# Calculate weighted average Chaos Price
weighted_avg_chaos = (df['Chaos Price'] * df['Weight']).sum() / df['Weight'].sum()

print(f"Weighted average Chaos Price: {weighted_avg_chaos:.2f}")
weighted_avg_divine = (df['Divine Price'] * df['Weight']).sum() / df['Weight'].sum()
print(f"Weighted average Divine Price: {weighted_avg_divine:.2f}")
