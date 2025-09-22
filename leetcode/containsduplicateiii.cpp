class Solution {
public:
    bool containsNearbyAlmostDuplicate(vector<int>& nums, int indexDiff, int valueDiff) {

        // 3 valuediff means, find the previous -3, -2, -1 , 0, 1, 2, 3 value distance  value from nums and check its distance. if distance lower, then a duplicate has been found.

        // with this solution, problem arises when the valuediff is very large and a lot of useless values are checked instead of just checking if there's a value within that index range nearby.

        unordered_map<int,int> lastSeen; // number → last index
        for (int i = 0; i < nums.size(); i++) {
            for (int k = 0 ; k<= valueDiff; k++) {
                if (lastSeen.count(nums[i]-k)) {
                    if ( i - lastSeen[nums[i]-k] <= indexDiff) {
                        return true;
                    }
                }
                if (lastSeen.count(nums[i]+k)) {
                    if ( i - lastSeen[nums[i]+k] <= indexDiff) {
                        return true;
                    }
                }
            }
            lastSeen[nums[i]] = i;
        }
        return false;
    }
};
