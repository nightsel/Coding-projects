#include <algorithm>
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int cols = 0;
        if (!matrix.empty()) {
            cols = matrix[0].size();
        }
        int n = cols;
        int m = matrix.size();
        int rows = m;
        vector<int> spiral;
        int spiraling = 1;
        int loops = 0;
        int start = 1;
        int turns = 0;
        int count = 0;
        // first row. last column. last row. first column. second row. second last column.
        while (spiraling == 1) {
            vector<int> startspiral = spiral;
            if (turns % 4 == 0) {
                for (int i = loops; i < n-loops ; i++) {
                    int val = matrix[loops][i];
                    //1+i+loops*cols;

                        spiral.push_back(val);

                }
            }
            else if (turns % 4 == 1) {
                for (int j = 1+loops; j < m-loops ; j++) {
                    int val = matrix[j][cols-loops-1];
                    // j*cols+cols;
                    spiral.push_back(val);

                }
            }
            else if (turns % 4 == 2) {
                for (int i = loops+1; i < n-loops ; i++) {
                    int val = matrix[rows-1-loops][cols-i-1];
                    // rows*cols-i-loops*n;

                        spiral.push_back(val);

                }
            }
            else {
                for (int j = loops+1; j < m-loops-1 ; j++) {
                    int val = matrix[rows-j-1][loops];
                    // ((rows-1)*cols)-j*cols+1;

                        spiral.push_back(val);

                }
            }
            turns++;
            if (turns == 4) {
                loops++;
                turns = 0;
            }
            if (!spiral.empty()) {
                cout << spiral.back();
            }
            if ( startspiral == spiral) {
                spiraling = 0;
            }
            else {
                count = 0;
            }
        }
        return spiral;
    };
};
