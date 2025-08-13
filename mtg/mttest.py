import random

# Define card classes
class Card:
    def __init__(self, name, cost=0, effect=None):
        self.name = name
        self.cost = cost
        self.effect = effect

class Land(Card):
    def __init__(self):
        super().__init__(name="Island")

class Creature(Card):
    def __init__(self, name, cost, power, toughness, flying=False):
        super().__init__(name, cost)
        self.power = power
        self.toughness = toughness
        self.flying = flying

class Sorcery(Card):
    def __init__(self, name, cost, effect):
        super().__init__(name, cost, effect)

class Player:
    def __init__(self, deck):
        self.deck = deck
        self.hand = []
        self.lands = []
        self.battlefield = []
        self.life = 20
        self.mana_pool = 0

    def draw_card(self):
        if self.deck:
            self.hand.append(self.deck.pop(0))

    def play_land(self):
        for card in self.hand:
            if isinstance(card, Land):
                self.lands.append(card)
                self.hand.remove(card)
                return

    def cast_spell(self):
        for card in self.hand:
            if card.cost <= self.mana_pool:
                if isinstance(card, Creature):
                    self.battlefield.append(card)
                elif isinstance(card, Sorcery):
                    if card.effect == "draw":
                        for _ in range(2):
                            self.draw_card()
                self.mana_pool -= card.cost
                self.hand.remove(card)
                return

    def tap_lands(self):
        self.mana_pool += len(self.lands)

    def attack(self, opponent):
        # Declare attackers
        attackers = self.battlefield[:]
        if not attackers:
            return

        # Declare blockers
        blockers = []
        remaining_blockers = opponent.battlefield[:]  # Copy of opponent's battlefield for blocking
        for attacker in attackers:
            potential_blockers = [
                creature for creature in remaining_blockers
                if (attacker.flying and creature.flying) or not attacker.flying
            ]
            if potential_blockers:
                blocker = random.choice(potential_blockers)
                blockers.append((attacker, blocker))
                remaining_blockers.remove(blocker)

        # Resolve combat
        for attacker, blocker in blockers:
            # Simultaneous damage
            blocker.toughness -= attacker.power
            attacker.toughness -= blocker.power

        # Remove dead creatures after combat
        opponent.battlefield = [creature for creature in opponent.battlefield if creature.toughness > 0]
        self.battlefield = [creature for creature in self.battlefield if creature.toughness > 0]

        # Direct damage to opponent (unblocked attackers)
        blocked_attackers = {pair[0] for pair in blockers}
        for attacker in attackers:
            if attacker not in blocked_attackers:
                opponent.life -= attacker.power


# Simulate a game with blocking
def simulate_game(deck1, deck2):
    player1 = Player(deck1[:])
    player2 = Player(deck2[:])

    for _ in range(7):
        player1.draw_card()
        player2.draw_card()

    turn = 0
    while player1.life > 0 and player2.life > 0 and turn < 100:
        for player, opponent in [(player1, player2), (player2, player1)]:
            player.tap_lands()
            player.play_land()
            player.cast_spell()
            player.attack(opponent)
        turn += 1

    if player1.life > player2.life:
        return 1
    elif player2.life > player1.life:
        return -1
    else:
        return 0

def evaluate_deck_composition(comp1, comp2, num_games=1000):
    deck1 = create_deck(comp1)
    deck2 = create_deck(comp2)
    results = [simulate_game(deck1, deck2) for _ in range(num_games)]
    win_rate = results.count(1) / num_games
    return win_rate

def create_deck(composition):
    land_count, creature1_count, creature2_count, sorcery_count = composition
    deck = (
        [Land()] * land_count +
        [Creature("3/3 Creature", 3, 3, 3)] * creature1_count +
        [Creature("2/2 Flying", 3, 2, 2, flying=True)] * creature2_count +
        [Sorcery("Draw 2 Cards", 3, "draw")] * sorcery_count
    )
    random.shuffle(deck)
    return deck


# Find the optimal composition with blocking mechanics
def find_optimal_composition():
    best_comp = None
    best_score = 0
    for land in range(20, 31):  # Land range
        for c1 in range(0, 31):  # Creature 3/3 range
            for c2 in range(0, 31):  # Creature 1/1 Flying range
                for sorcery in range(0, 21):  # Sorcery range
                    if land + c1 + c2 + sorcery == 60:  # Deck size constraint
                        comp = (land, c1, c2, sorcery)
                        score = evaluate_deck_composition(comp, comp)
                        if score > best_score:
                            best_comp = comp
                            best_score = score
    return best_comp


if __name__ == "__main__":
    optimal_composition = find_optimal_composition()
    print("Optimal Deck Composition:", optimal_composition)
