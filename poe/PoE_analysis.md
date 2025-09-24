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
