class Solution {
public:
    int maxFrequency(vector<int>& nums, int k, int numOperations) {
        int freqcount = 0;
        //unordered_map<long long, long long> freq;
        //unordered_map<int,int> freq;
        //unordered_map<int,int> freqbins;
        int range = 1e5;
        vector<int> freq(range + 1);
        for (int num : nums)
            freq[num - 1]++;

        vector<int> pref(range + 1, 0);
        for (int i = 0; i < range; ++i)
            pref[i + 1] = pref[i] + freq[i];

        /*for (int num : nums) {
            int bin = num / (k + 1);
            for (int target = num - k; target <= num + k; ++target) {
                if (target != num)
                    freq[target]++;
                    if (freq[target] >= numOperations)
                        freq[target] = numOperations;
            }
            freqbins[bin] = num;
        }*/
        int best = 0;
        for (int i = 0; i < range; ++i) {
            int left = max(0, i - k);
            int right = min(range - 1, i + k);
            int in_range = pref[right + 1] - pref[left];
            best = max(best, min(in_range, freq[i] + numOperations));
        }
        freqcount = best;
        /*for (int num : nums) {
            for (int target = num; target <= num; ++target)
                freq[target]++;
        }
        unordered_map<int,int>::iterator best
            = max_element(freq.begin(),freq.end(),[] (const std::pair<char,int>& a, const std::pair<char,int>& b)->bool{ return a.second < b.second; } );
        cout << best->first << " , " << best->second << "\n";
        freqcount = best->second;*/

        return freqcount;
    }
};
