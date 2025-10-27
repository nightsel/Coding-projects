class Solution {
public:
    int maxPartitionsAfterOperations(string s, int k) {
        // First longest prefix part (done)
        // Then part where a letter is changed.
        int count = 1;
        int prefixes = 0;
        vector<char> foundchars = {s[0]};
        int best = 1;
        for (int i = 0; i < s.length()-1; i++) {
            if (s[i+1] != s[i] && find(foundchars.begin(),foundchars.end(), s[i+1]) == foundchars.end()) {
                count++;
                foundchars.push_back(s[i+1]);
                if (count > k) {
                    count = 1;
                    prefixes++;
                    foundchars = {s[i+1]};
                }
            }
           // cout << count;
        }
        prefixes++;
        //cout << prefixes;
        best = max(best,prefixes);
        for (int j = 0; j < s.length(); j++) {
            //cout << j << "\n";
            count = 1;
            prefixes = 0;
            string copys = s;
            copys[j] = '+';
            foundchars = {copys[0]};
            for (int i = 0; i < s.length()-1; i++) {
                if (copys[i+1] != copys[i] && find(foundchars.begin(),foundchars.end(), copys[i+1]) == foundchars.end()) {
                    count++;
                    foundchars.push_back(copys[i+1]);
                    if (count > k) {
                        count = 1;
                        prefixes++;
                        foundchars = {copys[i+1]};
                    }
                }
               // cout << count;
            }
            prefixes++;
            //cout << prefixes;
            best = max(best,prefixes);
            if (prefixes == 12) {
                cout << j;
            }
        }
        return best;


    }
};
