// working version
#include <vector>
#include <algorithm>
#include <iostream>

class Solution {
public:
    static int maxFrequency(std::vector<int>& nums, int k, int numOperations) {
        if (nums.empty()) return 0;

        std::sort(nums.begin(), nums.end());
        // some variables might be useless
        int n = nums.size();
        int l = 0;
        int best = 1;
        int best2 = 1;
        int usedOps = 0;
        int rangeMin = nums[0] - k;
        int rangeMax = nums[0] + k;
        vector<int> preciselist;
        long long leftrange = 0;
        long long rightrange = 0;
        int leftprecise = 0;
        int rightprecise = 0;
        int r = 0;
        int r_right = 0;
        int allowed1;
        int allowed2;
        int allowedlast;
        int allowedrangelast;
        unordered_map<long long,int> freq;
        freq.reserve(n*2);
        for (long long x : nums) freq[x]++;

        for (int l = 0; l < n ; l++) {
            allowedlast = 0;
            allowedrangelast = 0;
            while (nums[leftprecise] < nums[l]-k) {
                if (leftprecise+1 < nums.size())
                    leftprecise++;
                else break;
            }
            while (nums[rightprecise] <= nums[l]+k) {
                if (rightprecise+1 < nums.size())
                    rightprecise++;
                else
                {allowedlast = 1;
                break;
                }
            }
            while (1LL * nums[l] +2*k >= rightrange) {
                if (r_right+1 < nums.size()) {
                    r_right++;
                    rightrange = nums[r_right];
                }
                else {
                    allowedrangelast = 1;
                    break;
                }
            }
         //   cout << l << " " << leftprecise << " " << rightprecise << " "<< allowedlast << "\n";
          //  cout << l << " " << r_right << " "<< allowedrangelast << "\n";
            allowed1 = numOperations+freq[nums[l]];
            allowed2 = numOperations;
            int bestprecise = min(allowed1, rightprecise-leftprecise+allowedlast);
            int bestrange = min(allowed2, r_right-l+allowedrangelast);
         //   cout << bestprecise << "\n";
         //   cout << bestrange<<"\n";
            best = max(best, bestprecise);
            best = max(best, bestrange);
        }


        return best;
    }
};
