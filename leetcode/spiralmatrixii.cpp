class Solution {
public:
    vector<vector<int>> generateMatrix(int o) {
        vector<vector<int>> matrix(o, vector<int>(o, 0));
        int cols = 0;
        if (!matrix.empty()) {
            cols = matrix[0].size();
        }
        int n = cols;
        int m = matrix.size();
        int rows = m;
        int spiraling = 1;
        int loops = 0;
        int start = 1;
        int turns = 0;
        int count = 0;
        int countnumbers = 1;
        while (spiraling == 1) {
            vector<vector<int>> startmatrix = matrix;
            if (turns % 4 == 0) {
                for (int i = loops; i < n-loops ; i++) {
                    matrix[loops][i] = countnumbers;
                    countnumbers++;
                    //1+i+loops*cols;
                    // spiral.push_back(val);
                }
            }
            else if (turns % 4 == 1) {
                for (int j = 1+loops; j < m-loops ; j++) {
                    matrix[j][cols-loops-1] = countnumbers;
                    countnumbers++;
                    // j*cols+cols;
                    //spiral.push_back(val);

                }
            }
            else if (turns % 4 == 2) {
                for (int i = loops+1; i < n-loops ; i++) {
                    matrix[rows-1-loops][cols-i-1] = countnumbers;
                    countnumbers++;
                    // rows*cols-i-loops*n;

                    //spiral.push_back(val);

                }
            }
            else {
                for (int j = loops+1; j < m-loops-1 ; j++) {
                    matrix[rows-j-1][loops] = countnumbers;
                    countnumbers++;
                    // ((rows-1)*cols)-j*cols+1;

                    //spiral.push_back(val);

                }
            }
            turns++;
            if (turns == 4) {
                loops++;
                turns = 0;
            }
            if (!matrix.empty()) {
                cout << (matrix.back()).back();
            }
            if ( startmatrix == matrix) {
                spiraling = 0;
            }
            else {
                count = 0;
            }
        }
       return matrix;
    }
};
