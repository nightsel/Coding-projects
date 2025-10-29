class Solution {
public:
    int maxPartitionsAfterOperations(string s, int k) {
        if (s.empty()) return 0;
        int n = s.size();
        int totalPartitions;
        int left;
        string letters = "abcdefghijklmnopqrstuvwxyz";

        vector<vector<int>> freq(26, vector<int>(n + 1, 0));

        for (int i = 0; i < n; i++) {
            int c = s[i] - 'a';
            for (int j = 0; j < 26; j++) {
                freq[j][i + 1] = freq[j][i] + (j == c);
            }
        }

        // --- Compute initial partitions
        vector<int> pref(n, 0);
vector<int> partition_start(n, 0);

int partitions = 1;
int start = 0;
pref[0] = 1;
partition_start[0] = 0;

for (int i = 1; i < n; i++) {
    // Count distinct letters in current segment [start, i]
    int distinct = 0;
    for (int c = 0; c < 26; c++) {
        if (freq[c][i + 1] - freq[c][start] > 0) distinct++;
    }

    if (distinct > k) {
        partitions++;
        start = i;
    }
    pref[i] = partitions;
    partition_start[i] = start;
}

partitions++;  // account for last
int best = partitions;

// --- Compute suffix partitions using freq
vector<int> suff(n, 0);
partitions = 1;
int end = n - 1;
suff[n - 1] = 1;

for (int i = n - 2; i >= 0; i--) {
    int distinct = 0;
    for (int c = 0; c < 26; c++) {
        if (freq[c][end + 1] - freq[c][i] > 0) distinct++;
    }

    if (distinct > k) {
        partitions++;
        end = i + 1;
    }
    suff[i] = partitions;
}
        vector<int> charresults;
        best = 1;
        for (int j = 0; j < n; j++) {
            char original = s[j];
            charresults = {};
            for (char c : letters) {
                if (c == original) continue;
                //if (!charresults.empty()) {
                    if (find_if(charresults.begin(), charresults.end(),
    [&](char x){ return x != charresults[0]; }) != charresults.end()) {
                        charresults = {};
                        break;
                    }
                //}


                string copy = s;
                copy[j] = c;

                int L = partition_start[j];

                int rdone = 0;
                int ar = 0;
              //  cout << L << "\n";
              //  cout << n<< "\n";

                int low = L, high = n - 1, r = L;

                // binary search for the farthest `r` such that s[L..r] (with s[j] changed to c) has <= k distinct chars
                while (low <= high) {
                    int mid = (low + high) / 2;

                    int distinct = 0;
                    for (int cidx = 0; cidx < 26; cidx++) {
                        int cnt = freq[cidx][mid + 1] - freq[cidx][L];

                        // adjust for changed letter
                        if (j >= L && j <= mid) {
                            if (s[j] - 'a' == cidx) cnt--;
                            if (c - 'a' == cidx) cnt++;
                        }

                        if (cnt > 0) distinct++;
                    }

                    if (distinct <= k) {
                        r = mid;          // can expand rightward
                        low = mid + 1;
                    } else {
                        high = mid - 1;   // too many distinct letters
                    }
                }

              //  if (r == 0 && partition_start[j] != 0) {
               //     r = n-1;
               // }

left = (partition_start[j] > 0) ? pref[partition_start[j] - 1] : 0;
totalPartitions = left + 1;

// Recompute partitions from r+1 to end for modified string
int curDistinct = 0;
vector<int> seen(26, 0);
for (int x = r + 1; x < n; x++) {
    int idx = (x == j) ? (c - 'a') : (s[x] - 'a');
    seen[idx]++;
    if (seen[idx] == 1) curDistinct++;
    if (curDistinct > k) {
        totalPartitions++;
        fill(seen.begin(), seen.end(), 0);
        curDistinct = 1;
        seen[s[x] - 'a'] = 1;
    }
}
if (curDistinct > 0 && (j != partition_start[j]|| (j == partition_start[j] && j==0))) totalPartitions++;
//if (totalPartitions == 4) {
 //   cout << partition_start[j];
 //   cout << j <<" "<< c<<" "<< r <<" "<< left << "\n";
//}
//cout << "j" << j << "\n";
//cout <<"hey"<< r << "\n";
//cout << totalPartitions << "\n";
best = max(best, totalPartitions);
                charresults.push_back(best);
            }
        }
        return best;
    }
};
