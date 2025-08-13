# Try using the formula-based approach to find n
base_attack_speed = 0.75
initial_bonus = 0.2 # 2 guinsoo
increment_per_attack = 0.1*base_attack_speed # 2 guinsoo
combined_increment = 0.1*base_attack_speed # 2 guinsoo
initial_bonus = 0.1 # 1 guinsoo
increment_per_attack = 0.05*base_attack_speed # 1 guinsoo
combined_increment = 0.05*base_attack_speed # 1 guinsoo
time_elapsed = 21
# Formula-based cumulative time for n attacks with 2 Rageblades
def cumulative_time_2_rageblades(n, base_speed, initial_bonus, increment_per_attack):
    initial_speed = base_speed * (1 + initial_bonus)
    return sum(1 / (initial_speed + k * increment_per_attack) for k in range(n))

# Binary search for the maximum n where cumulative time is <= 20 seconds
low, high = 1, 1000  # Set a reasonable range for search
best_n = 0

while low <= high:
    mid = (low + high) // 2
    if cumulative_time_2_rageblades(mid, base_attack_speed, initial_bonus, combined_increment) <= time_elapsed:
        best_n = mid  # Update best known n
        low = mid + 1  # Search for higher n
    else:
        high = mid - 1  # Search for lower n

# Include fractional attack for the remaining time after best_n full attacks
remaining_time = time_elapsed - cumulative_time_2_rageblades(best_n, base_attack_speed, initial_bonus, combined_increment)
final_attack_speed = base_attack_speed * (1 + initial_bonus) + best_n * combined_increment
final_attacks = best_n + remaining_time * final_attack_speed

final_attacks
print(final_attacks)
print(base_attack_speed*time_elapsed)
print((final_attacks/(base_attack_speed*time_elapsed)))
