import requests
import pandas as pd
import re

def get_current_league():

    return "Mercenaries"

def get_scarab_prices():
    league = get_current_league()
    try:
        url = f"https://poe.ninja/api/data/itemoverview?league={league}&type=Scarab"
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()
        scarabs = []

        for item in data.get('lines', []):
            scarabs.append({
                'Name': item.get('name', 'N/A'),
                'Tier': item.get('baseType', '').split()[-1],
                'Chaos Price': item.get('chaosValue', 0),
                'Divine Price': item.get('divineValue', 0),
                'Trade Link': f"https://www.pathofexile.com/trade/search/{league}?q={item.get('name', '')}"
            })

        return pd.DataFrame(scarabs)

    except Exception as e:
        print(f"Error fetching data: {e}")
        return pd.DataFrame()

# Execute
df = get_scarab_prices()
if not df.empty:
    df.to_csv('scarab_prices.csv', index=False)
    print(f"✅ Saved {len(df)} scarabs (League: {get_current_league()})")
    print(df.head())
else:
    print("❌ Failed to retrieve data")
