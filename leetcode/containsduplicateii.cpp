class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        vector<int> numcopy = nums;
        sort(numcopy.begin(),numcopy.end());
        vector<int> duplicates;
        for (int i = 0; i < numcopy.size()-1; i++) {
            if (numcopy[i] == numcopy[i+1]) {
                duplicates.push_back(numcopy[i]);
            }
        }
        for (int k = 0; k < duplicates.size(); k++) {
            cout << "\n" << duplicates[k] << "\n";

        }
        std::vector<int>::iterator firstidx;
        std::vector<int>::iterator secondidx;
        for (int i =0; i<duplicates.size();i++) {
            if (i>0) {
                if (duplicates[i] != duplicates[i-1]) {
                    firstidx = std::find(nums.begin(), nums.end(), duplicates[i]);
                    secondidx = std::find(firstidx+1, nums.end(), duplicates[i]);
                    if (abs(firstidx-secondidx) <= k) {
                        return true;
                    }
                }
                else {
                    firstidx = secondidx;
                    secondidx = std::find(firstidx+1, nums.end(), duplicates[i]);
                    if (abs(firstidx-secondidx) <= k) {
                        return true;
                    }
                }
            }
            else {
                firstidx = std::find(nums.begin(), nums.end(), duplicates[i]);
                secondidx = std::find(firstidx+1, nums.end(), duplicates[i]);
                if (abs(firstidx-secondidx) <= k) {
                    return true;
                }
            }
        }
        return false;
    }
};
