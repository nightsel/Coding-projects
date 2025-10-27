class Solution {
public:
    int numberOfBeams(vector<string>& bank) {
        int prevlasers = 0;
        int nowlasers = 0;
        int totallasers = 0;
        for (int i = 0; i < bank.size(); i++) {
            if (bank[i].find('1') != std::string::npos) {
                nowlasers = count(bank[i].begin(),bank[i].end(),'1');
               // cout << nowlasers << " " << prevlasers << "\n";
                totallasers = totallasers + prevlasers*nowlasers;
                prevlasers = nowlasers;
            }
        }
        return totallasers;
    }
};
