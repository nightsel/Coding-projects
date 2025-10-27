class Solution {
public:
    int maxDistinctElements(vector<int>& nums, int k) {
        std::sort(nums.begin(),nums.end());
        int freq = 0;
        int leftrange = nums[0]-k;
        for (int i = 0; i < nums.size(); i++) {

            if (leftrange >= nums[i]-k) {
                if (leftrange > nums[i]+k) {

                }
                else {
                    freq++;
                    leftrange++;
                }
            }
            while (leftrange < nums[i]-k) {
                leftrange++;
                if (leftrange > nums[i]+k) {
                    break;
                }
                else if (leftrange >= nums[i]-k) {
                    freq++;
                    leftrange++;
                }
            }
        }
        return freq;
    }
};
