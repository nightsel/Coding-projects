import numpy as np

# Number of simulations
n_samples = 1_000_000

# Step 1: Base crit chance rolls from 10% to 20%
base_crits = np.random.uniform(10, 20, n_samples)

# Step 2: Corruption multiplies the result by a value between 0.78 and 1.22
corruption_multipliers = np.random.uniform(0.78, 1.22, n_samples)

# Final crit chance after corruption
final_crits = base_crits * corruption_multipliers

# Compute probability ranges
bins = {
    "<18%": np.sum(final_crits < 18),
    "18–19%": np.sum((final_crits >= 18) & (final_crits < 19)),
    "19–20%": np.sum((final_crits >= 19) & (final_crits < 20)),
    "20–21%": np.sum((final_crits >= 20) & (final_crits < 21)),
    "21–22%": np.sum((final_crits >= 21) & (final_crits < 22)),
    "22–23%": np.sum((final_crits >= 22) & (final_crits < 23)),
    "23–24%": np.sum((final_crits >= 23) & (final_crits < 24)),
    "≥24%": np.sum(final_crits >= 24),
}

# Convert counts to percentages
probabilities = {k: round(v / n_samples * 100, 2) for k, v in bins.items()}

# Print the result
for k, v in probabilities.items():
    print(f"{k}: {v}%")

probs = {"<18%": 78.97,
"18–19%": 6.31,
"19–20%": 5.09,
"20–21%": 3.96,
"21–22%": 2.9,
"22–23%": 1.83,
"23–24%": 0.86,
"≥24%": 0.08}

values = {
    "<18%": 0.2,
    "18–19%": 9,
    "19–20%": 33,
    "20–21%": 75,
    "21–22%": 105,
    "22–23%": 145,
    "23–24%": 300,
    "≥24%": 1200
}

expected_value = sum((probs[key] / 100) * values[key] for key in probs)
print(f"Expected Value: {expected_value:.2f}")
