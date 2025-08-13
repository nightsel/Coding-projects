Here are coding projects that I have made for 3 video games. Most of the
codes are using ChatGPT to form a structure that gets troubleshooted when it
fails. I think it's efficient to use ChatGPT for coding due to the amount of
time that it saves, but it's still important to know what the code does.

Magic the Gathering Arena:

In this game, there is a draft mode where players are able to select cards to their deck.
By using data analysis from games that are played online, it is possible to
know which cards are better to choose.
For example one relevant statistic is how many times a deck with a specific card
has won out of all the games where that card has been played. A card that is
more likely to win matches is often a better pick in draft.

17lands has a lot of data and even data analysis regarding these cards that is
publicly available.

To calculate the win probability of a card, first the massive input csv from
17lands is trimmed to only the relevant columns, which are the columns that
start with deck_, won and draft id. Draft id lets us know which match is in
question and cards' names indicate if the card was included in the deck of that
match. The column won shows whether the match was won. This is all done in
trimdeck.py

The individual card win rate is calculated in cardwins.py. It is quite simple,
for each card column it's checked if the column has won value 1 or 0, and the
average win rate is calculated by summing all the 1s divided by the amount of
matches where that card was included.

Path of Exile:

In Path of Exile, there is quite a lot of math involved and economy is an
important aspect.

There is a game mode called sanctum where you start a game with items that
modify the game mode. These items improve the rewards that you get from
finishing the game. So it's important to know what items give the most benefit.

The most complicated strategy collects coins and purchases items during the
game from merchants. The goal is to buy as many items called "relics" from the
shop as possible by the 4th merchant. Some relics are much better than others,
such as one that gives a discount to every other purchase, which is why you
have to be picky in the beginning.

The items that sanctum is started with make it easier for you to be able to
purchase everything. Particularly one makes all of your purchases cheaper, and
one gives you more offered options on every merchant. Based on the economy,
where the starting items are priced, most of the
players believe that getting more choices is better even if you don't get any
cost reduction but with the script calcsanc.py I simulated that it's not the
case. Balancing cost reductions and increasing merchant's offered options is a better
option than only increasing merchant's offered options.

Scarab calculations:
Scarabs are one of the most important resources in Path of Exile. Some scarabs
are more rare than others and rarity is determined by their weight. Every
scarab's weight is known or at least well estimated, and they can be found
on the website https://poedb.tw/us/Scarab .

I wrote the script scarabs_weights.py that collects all the scarab names from
that website, gives them weights based on the rarity shown on that website's
 each scarab link and then compiles them into a csv.

Then the script scarabs.py finds the price for each scarab from poe.ninja's api
https://poe.ninja/api/data/itemoverview?league=Mercenaries&type=Scarab and
complies them into a csv. And finally, combine_scarab_csvs.py combines every
scarab's name, weight and value to a single csv. This allows calculation of
the average scarab which is done in scarabcalcs.py. This is a useful tool
in the economy, because a lot of scarabs are useless and 3 of a bad scarab can be exchanged
for a random scarab. If the 3 bad scarabs are less valuable than the
average, then this trade is worth it.

teardropcalc.py calculates how many "Tainted Divine Teardrops" are required to
reach the best outcome on average. There isn't much math involved here, it's
just a simple simulation and assumes getting lucky and unlucky are both 50%.


tanglecalc.py is for Path of Exile 2 where it's possible to use an item
which will give a random outcome. This script simulates the expected value
for the outcome if the prices of all the outcomes and inputs are known.
The outcomes have 2 different layers in the randomness, basically you can get
lucky twice for example, or lucky once and unlucky once.
That's why the simulation is necessary.
