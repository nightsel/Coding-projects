Here are coding projects that I have made for 3 video games. Most of the
codes are using ChatGPT to form a structure that gets troubleshooted when it
fails.

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

Card win rates for each archetype is gathered in cardwinsArchetype.py. Archetypes
are defined based on what colour of lands they are using. A deck with 3 or more
red lands and 3 or more blue lands is considered to be archetype "RU". Cards
can be good in 1 archetype and bad in another so this can be important data
sometimes. The archetype assignment for each draft deck happens in addcolors.py.

In Magic the gathering, 2 drops are considered to be creatures with converted
mana cost of exactly 2. Usually this means being able to play them on turn 2.
These creatures are an important part of a draft deck.
The amount of 2 drops compared to deck win rate is compared in 2dropcomparison.py.
Surprisingly, decks have similar win rates between 2 and 12 2 drops. Only after
the deck has 13 2 drops or more, it starts being a detriment but there is
almost no sample size for those amounts. Overall it seems like there is a slight
trend that having more of them is better until 8 2 drops.

Next, I compared whether it's better to add a bad card to the draft deck or play
with 18 lands (as the data website's name suggests, playing 17 lands is considered
optimal usually). The data analysis is done in the script
compare18landsvs17withbardcard.py.
Of course the comparison needs to be done in decks that could
include the bad card so there's no bias, so in this case I made sure the 18 land
deck has lands of the chosen bad card's colour.
Based on looking at data including card "Stampeding Elk Herd", it seems
like it's a better idea to play with 18 lands than to include this bad card in
the deck. A good card like Courier's Briefcase breaks even with a 18 lands deck.
Because green colour is known for being better with more lands than other colours,
I checked black colour too with cards Baleful Eidolon (a bad card) and Gurmag
Angler (a decent card). The results were similar, so playing with 18 lands
seemed more beneficial than adding a bad card to the deck.
I had some trouble finding decks with exactly 17 land cards because cards like
Bala Ged Recovery are not part of the source csv because their name doesn't
match exactly due to being a dual faced card. But I tried my best to fix the
problem.




todo: 2 drop vs slightly better card when amount of 2 drops is low vs high




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
case. Balancing cost reductions and increasing merchants' offered options is a better
option than only increasing merchants' offered options.

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
