class Solution {
public:
    int maxFrequency(vector<int>& nums, int k, int numOperations) {
        int freqcount = 0;
        unordered_map<int,int> freq;
        for (int num : nums) {
            for (int target = num - k; target <= num + k; ++target) {
                if (target != num)
                    freq[target]++;
                    if (freq[target] >= numOperations)
                        freq[target] = numOperations;
            }
        }
        for (int num : nums) {
            for (int target = num; target <= num; ++target)
                freq[target]++;
        }
        unordered_map<int,int>::iterator best
            = max_element(freq.begin(),freq.end(),[] (const std::pair<char,int>& a, const std::pair<char,int>& b)->bool{ return a.second < b.second; } );
        cout << best->first << " , " << best->second << "\n";
        freqcount = best->second;

        for (int i = 0; i < nums.size(); i++) {

        }
        return freqcount;
    }
};
