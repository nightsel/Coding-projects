class Solution {
public:
    int nextBeautifulNumber(int n) {

        int copyn;
        int iteration = 1;
        int count;
        while (true) {
            count = 0;
            copyn = n+iteration;
            vector<int> digits = {};
            while (copyn != 0) {
                digits.push_back(copyn%10);
                if (copyn%10 == 0) {
                    break;
                }
                copyn = copyn / 10;
                ++count;

            }
            std::sort(digits.begin(),digits.end());
            int numsum = 1;
            if (digits[0] != 0) {
                int digitsum = digits[0];
                if (digits.size() > 1) {
                    for (int i = 1; i < digits.size(); i++){

                        if (digits[i] != digits[i-1]) {
                            if (numsum != digits[i-1]) {

                                digitsum = -5;
                                break;
                            }
                            else {
                                numsum = 0;
                            }
                            digitsum = digitsum+digits[i];
                        }
                        else {
                            if (numsum == 0)
                            numsum = 2;
                            else
                            numsum = numsum+1;
                        }
                    }
                }
                if (count == digitsum) {

                    return n+iteration;
                }
            }
            iteration++;
        }
        }
    int countdigits (int n) {
        int count = 0;

        while (n != 0)
        {

            n = n / 10;

            ++count;
        }
        return count;
    }
};
