class Solution {
public:
    int totalMoney(int n) {
        int total = 0;
        int count = 1;
        for (int i = 0 ; i < n ; i++) {
            if (i != 0 && i%7 == 0) count++;
            total = total+i%7+count;
        }
        return total;
    }
};
