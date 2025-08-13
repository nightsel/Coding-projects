import random
import numpy as np

# Simulation parameters
NUM_SIMULATIONS = 100_000

def simulate_teardrops_from_bottom(num_simulations=NUM_SIMULATIONS):
    attempts = []

    for _ in range(num_simulations):
        # Starting state:
        # - Fractured mod at T1 (not affected by Teardrop)
        # - 2 mods at T3, 1 mod at T2
        mods = ["fractured_T1", "T3", "T3", "T2"]
        count = 0

        while True:
            count += 1
            # Apply Tainted Teardrop to each of the 3 non-fractured mods
            for i in range(1, 4):
                if mods[i] == "T3":
                    mods[i] = "T2" if random.random() < 0.5 else "T3"
                elif mods[i] == "T2":
                    mods[i] = "T1" if random.random() < 0.5 else "T3"
                elif mods[i] == "T1":
                    mods[i] = "T1" if random.random() < 0.5 else "T2"

            # Check if all 3 non-fractured mods are at T1
            # Count how many mods are at T1
            t1_count = mods[1:].count("T1")
            # Check if at least 2 are T1 and the rest are not T3
            if t1_count == 3:
                break
            elif t1_count == 2 and any(m != "T3" for m in mods[1:] if m != "T1"):
                break

        attempts.append(count)

    return np.mean(attempts)

# Run the simulation
average_teardrops = simulate_teardrops_from_bottom()
print(f"Average Tainted Teardrops needed: {average_teardrops:.2f}")
