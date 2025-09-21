class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        int i = 0;
        vector<vector<int>> perms;
        for (i = 0; i < nums.size(); i++) {
            perms.push_back({nums[i]});
        }
        int numshandled = 1;
        while (numshandled != nums.size()) {
            numshandled++;
            int startperm = perms.size();
            for (i = 0; i < startperm; i++) {
                for (int j = 0; j < nums.size(); j++) {

                    if (std::find(perms[i].begin(),perms[i].end(), nums[j]) == perms[i].end()) {
                        vector<int> vectopush;
                        for (int l = 0; l < perms[i].size(); l++) {
                            vectopush.push_back(perms[i][l]);
                        }
                        vectopush.push_back(nums[j]);
                        perms.push_back({vectopush});
                    }
                }
            }
            for (int n = 0; n < perms.size(); n++) {
                if (perms[n].size() != numshandled) {
                    perms.erase(perms.begin()+n);
                    n--;
                }
            }
        }
        return perms;
    }
};
