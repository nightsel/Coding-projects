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
