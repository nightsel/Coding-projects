Here are coding projects that I have made for 3 video games. Most of the
codes are using ChatGPT to form a structure that gets troubleshooted when it
fails.

Results from scripts are written inside the script code to not waste space here.

Magic the Gathering Arena:

I wrote scripts to improve decisions in one of the game modes, draft. All of the
scripts in mtg folder are for this purpose, and they are explained below.
In this game, there is a draft mode where players are able to select cards to their deck.
By using data analysis from games that are played online, it is possible to
know which cards are better to choose.

17lands has a lot of data and even data analysis regarding these cards that is
publicly available. Link here: https://www.17lands.com/public_datasets . I used
draft data from the set PIO PremierDraft.

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


Next, I compared whether it's better to add a bad card to the draft deck or play
with 18 lands (as the data website's name suggests, playing 17 lands is considered
optimal usually). The data analysis is done in the script
compare18landsvs17withbardcard.py.
Of course the comparison needs to be done in decks that could
include the bad card so there's no bias, so in this case I made sure the 18 land
deck has lands of the chosen bad card's colour.

It is also considered important to have creatures in the deck because most of
the time in draft you win by attacking the opponent with them. That's why I
checked the data for how many creatures you should have in the deck at minimum
for it to not lower your win rate. The comparison is done in
comparecreatureother.py.

I also checked if it's better to add mediocre two-drops to the deck when the
deck has a low amount of two-drops to balance it. This is done in 2dropcomparison.py
Lands are included this time to be able to compare a blue/red deck excluding a bad
blue/red two-drop vs a deck that's including the two-drop.

todo2: ai project




Path of Exile:

In Path of Exile, there is quite a lot of math involved and economy is an
important aspect.

First I will explain scripts scarab_weights.py, scarabs.py, combine_scarab_csvs.py
and scarabcalcs.py .
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
the average scarab value which is done in scarabcalcs.py. This is a useful tool
in the economy, because a lot of scarabs are useless and 3 of a bad scarab can be exchanged
for a random scarab. If the 3 bad scarabs are less valuable than the
average, then this trade is worth it.


Secondly about the script calcsanc.py, which is related to sanctum.
There is a game mode called sanctum where you start a game with items that
modify the game mode. These items improve the rewards that you get from
finishing the game. So it's important to know what items give the most benefit.
In this script I simulate what happens with different types of items.


And lastly, teardropcalc.py calculates how many "Tainted Divine Teardrops" are
required to reach the best outcome on average. There isn't much math involved
here, it's just a simple simulation and assumes getting lucky and unlucky are both 50%.


tanglecalc.py is for Path of Exile 2 where it's possible to use an item
which will give a random outcome. This script simulates the expected value
for the outcome if the prices of all the outcomes and inputs are known.
The outcomes have 2 different layers in the randomness, basically you can get
lucky twice for example, or lucky once and unlucky once.
That's why the simulation is necessary.

Teamfight Tactics:

There is a calculator for outdated version of guinsoo's rageblade. The item used
to give faster actions taken after every action that is taken, which can be
simulated for an average increase. The calculations are done in calctftrandom.py.

todo1: AI project

First, a csv with all the characters in the game needs to be found. It can be
downloaded from https://raw.communitydragon.org/latest/cdragon/tft/en_us.json .
