class Solution {
public:
    bool containsNearbyAlmostDuplicate(vector<int>& nums, int indexDiff, int valueDiff) {

        // 3 valuediff means, find the previous -3, -2, -1 , 0, 1, 2, 3 value distance  value from nums and check its distance. if distance lower, then a duplicate has been found.

        // with this solution, problem arises when the valuediff is very large and a lot of useless values are checked instead of just checking if any of the indices in the range even have their value within valuediff.

        // Switch to deque instead and store only the last x indexdiffs in the deque.
        // deque takes too long with indexdiff being large, although works in most cases

        // Switch to hash buckets (chatgpt suggestion)
        int foundindices = 0;
        deque<int> lastSeen;
       // unordered_map<long, long> buckets;
        for (int i = 0; i < nums.size(); i++) {
            for (int num : lastSeen) {
                if (abs(num - nums[i]) <= valueDiff) {
                    return true;
                }
            }

            lastSeen.push_back(nums[i]);

            if (lastSeen.size() > indexDiff) {
                lastSeen.pop_front();
            }
        }
        return false;
    }
};
