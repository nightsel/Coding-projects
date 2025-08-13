import requests
from bs4 import BeautifulSoup
import pandas as pd
from time import sleep

# Scarab weight classes and their values
WEIGHT_CLASSES = {
    'common_scarab': 300,
    'uncommon_scarab': 200,
    'rare_scarab': 100,
    'mythic_scarab': 10,
    'extreme_scarab': 1
}

def get_scarab_list():
    """Get all scarab types from the main Scarab page"""
    url = "https://poedb.tw/us/Scarab"
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        print(soup.prettify()[:1000])

        #page_div = soup.find('div', id='ScarabsItem')
        #print(page_div)
        # Find all scarab links in the content area
        scarabs = []
        links = soup.select('div#ScarabsItem a')
        print(links)
        for link in links:
            if 'scarab' in link.text.lower():
                scarabs.append({
                    'name': link.text.strip(),
                    'url': "https://poedb.tw" + link['href']
                })
        return scarabs
    except Exception as e:
        print(f"Error getting scarab list: {e}")
        return []

def get_scarab_weights():
    """Scrape weights for all scarabs"""
    scarabs = get_scarab_list()
    if not scarabs:
        print("No scarabs found on the main page!")
        return []

    results = []
    for scarab in scarabs:
        try:
            print(f"Processing {scarab['name']}...")
            response = requests.get(scarab['url'], timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find the item rarity class
            item_box = soup.find('div', class_='table-responsive')
            if not item_box:
                print(f"  ⚠️ No itemBox found for {scarab['name']}")
                continue

            # Determine weight
            weight = None
            #print(soup.prettify()[:2000])

            rows = soup.select('table.table-hover tbody tr')
            weight_found = 0
            for row in rows:
                if weight_found == 0:
                    # Extract all <td> cells inside this row
                    cells = row.find_all('td')

                    # Example: rarity might be in a specific cell, say the 2nd or 3rd
                    if len(cells) == 2:
                        key = cells[0].text.strip()
                        rarity_class = cells[1].text.strip()

                        # Check if rarity class matches your known classes
                        for css_class, weight in sorted(WEIGHT_CLASSES.items(), key=lambda x: x[1], reverse=True):
                            if css_class in rarity_class:
                                print(f"{key}: {css_class} ({weight})")
                                weight_found = weight
                                break


            if weight:
                results.append({
                    'Scarab': scarab['name'],
                    'Weight': weight,
                    'Rarity': css_class.replace('_scarab', '').title(),
                    'URL': scarab['url']
                })
                print(f"  ✅ Weight: {weight}")
            else:
                print(f"  ⚠️ Unknown rarity for {scarab['name']}")

            sleep(1)  # Polite delay

        except Exception as e:
            print(f"  ❌ Error processing {scarab['name']}: {e}")

    return results

# Run and save to CSV
if __name__ == '__main__':
    weights = get_scarab_weights()
    if weights:
        df = pd.DataFrame(weights)
        df = df.sort_values('Weight', ascending=False)
        df.to_csv('scarab_weights.csv', index=False)
        print("\n✅ Saved scarab_weights.csv")
        print(df.head())
    else:
        print("Failed to get scarab weights")
