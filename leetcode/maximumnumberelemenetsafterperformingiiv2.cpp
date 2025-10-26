// this is fine but a bit inefficient
#include <vector>
#include <algorithm>
#include <iostream>

class Solution {
public:
    static int maxFrequency(std::vector<int>& nums, int k, int numOperations) {
        if (nums.empty()) return 0;

        std::sort(nums.begin(), nums.end());
        int n = nums.size();
        int l = 0;
        int best = 1;
        int best2 = 1;
        int usedOps = 0;
        int rangeMin = nums[0] - k;
        int rangeMax = nums[0] + k;
        vector<int> preciselist;
        for (int i = 0; i < nums.size() ; i++) {
            if (abs(nums[i]-nums[0])<=k ) {
         //       cout << "added" << nums[i] << "\n";
                preciselist.push_back(nums[i]);
            }
            //else {
            //    break;
            //}
        }
        int lprev = 0;
        // Initial range from first element
        for (int r = 1; r < n; ++r) {
            // Compute new possible overlap range between left and right ends
            if (lprev != l) {
                for (int i = l; i < nums.size() ; i++) {
                    if (abs(nums[i]-nums[l])<=k) {
              //          cout << "added" << nums[i] << "\n";
                        preciselist.push_back(nums[i]);
                    }
                   // else {
                   //     break;
                   // }
                }
            }
            lprev = l;
           // cout << "precisethings \n";
            if (!preciselist.empty())
            //    cout << preciselist.back();
           // cout << "\n" << " " << r << "\n";
            int newMin = std::max(rangeMin, nums[r] - k);
            int newMax = std::min(rangeMax, nums[r] + k);
            //if (nums[r] == nums[l]) {
           //     cout << "heh";
           // }
           if (numOperations > 0) {
                if (r == l+1 && !preciselist.empty() && nums[l] != preciselist.back() ) {
                    //cout << "heh1";
                    usedOps++;
                }
                if (!preciselist.empty() && nums[r] != preciselist.back() && numOperations > usedOps && abs(nums[r]-preciselist.back())<=k) {
                    //cout << "heh2";
                //  if (nums[r] != preciselist.back())
                    usedOps++;
                }
                else if (nums[r]-nums[l]<=k && r-l >=1 && !preciselist.empty() && nums[r] == preciselist.back()) {
                   // cout << "heh3";
                //  if (nums[r] != preciselist.back())
                }
         /*       else if (nums[r]-nums[l]<=k && r-l == 1 && !preciselist.empty() && nums[r] == preciselist.back() && numOperations > usedOps) {
                    cout << "heh4";
                //  if (nums[r] != preciselist.back())
                usedOps++;
                } */
                else {
                  //  cout << "hereoh"<<"\n";
                    //cout << usedOps << "\n";
                    if (!preciselist.empty()) {
                        r = l;
                        preciselist.pop_back();
                        usedOps = 0;
                        rangeMin = nums[l] - k;
                        rangeMax = nums[l] + k;
                    }
                    if (preciselist.empty()) {
                        l++;
                        r = l;
                        usedOps = 0;
                        rangeMin = nums[l] - k;
                        rangeMax = nums[l] + k;
                    }
                }
              //  cout << "l" << l<<"\n";
              //  cout << r << "\n";

                int windowSize = r - l + 1;
                best = std::max(best, windowSize);
              //  cout << best;
            }
        }
        l = 0;
        usedOps = 0;
        rangeMin = nums[0] - k;
        rangeMax = nums[0] + k;
        for (int r = 1; r < n; ++r) {
            // Compute new possible overlap range between left and right ends

            int newMin = std::max(rangeMin, nums[r] - k);
            int newMax = std::min(rangeMax, nums[r] + k);
            if (nums[r] == nums[r-1] && nums[r] == nums[l]) {
             //   cout << "heh" << "\n";
            }
            else if (rangeMax >= nums[r] && usedOps == 0 && numOperations> 1) {
             //   cout << "here1"<<rangeMax << newMin << "\n";
                rangeMax = min(rangeMax, newMax);
                rangeMin = nums[r];
                usedOps++;
                usedOps++;
            }
            else if (rangeMax >= newMin && usedOps == 0 && numOperations- usedOps >=2) {
            //    cout << "here2"<< rangeMax << newMin << "\n";
                rangeMax = min(newMax, rangeMax);
                rangeMin = newMin;
                usedOps++;
                usedOps++;
            }
            else if (rangeMax >= nums[r] && usedOps == 0 && numOperations > 0) {
            //    cout << "here3"<< rangeMax << newMin << "\n";
                rangeMax = min(newMax, rangeMax);
                rangeMin = newMin;
                usedOps++;
            }
            else if (rangeMax >= newMin && numOperations> usedOps && usedOps > 0) {
           //     cout << "here4"<< rangeMax << newMin << "\n";
                rangeMin = max(newMin, rangeMin);
                rangeMax = min(newMax, rangeMax);
                usedOps++;
            }
            else {
                l++;
                r = l;
                usedOps = 0;
                rangeMin = nums[l] - k;
                rangeMax = nums[l] + k;
            }

            int windowSize = r - l + 1;
            best2 = std::max(best2, windowSize);
        }
        cout << "best2 "<<best2;
        best = max(best,best2);


        return best;
    }
};
