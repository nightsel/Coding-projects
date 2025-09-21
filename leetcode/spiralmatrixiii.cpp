class Solution {
public:
    vector<vector<int>> spiralMatrixIII(int rows, int cols, int rStart, int cStart) {
        vector<vector<int>> matrix(rows*cols, vector<int>(2,0));
        matrix[0] = {rStart, cStart};
        int n = cols;
        int m = rows;
        int spiraling = 1;
        int loops = 0;
        int start = 1;
        int turns = 0;
        int count = 0;
        int countnumbers = 1;
        int pathlength = 2;

        while (spiraling == 1) {
            vector<vector<int>> startmatrix = matrix;

            if (turns % 4 == 0) {
                for (int i = 1; i < pathlength ; i++) {
                    if (countnumbers <= matrix.size() - 1) {
                        int valx = rStart-loops;
                        int valy = cStart+i-loops;
                        if (valx < rows && valy < cols && valy > -1 && valx > -1)  {

                            matrix[countnumbers] = {valx, valy};
                            countnumbers++;
                        }
                    }

                }
            }
            else if (turns % 4 == 1) {
                for (int j = 1; j < pathlength ; j++) {
                    if (countnumbers <= matrix.size() - 1) {
                        int valx = rStart-loops+j;
                        int valy = cStart+1+loops;

                        if (valx < rows && valy < cols && valy > -1 && valx > -1)  {

                            matrix[countnumbers] = {valx, valy};
                            countnumbers++;
                        }
                    }

                }
            }

            else if (turns % 4 == 2) {
                for (int i = 1; i < pathlength ; i++) {
                    if (countnumbers <= matrix.size() - 1) {
                        int valx = rStart+1+loops;
                        int valy = cStart-i+loops+1;
                        if (valx < rows && valy < cols && valy > -1 && valx > -1)  {

                            matrix[countnumbers] = {valx, valy};
                            countnumbers++;
                        }
                    }


                }
            }
            else {
                for (int j = 1; j < pathlength ; j++) {
                    if (countnumbers <= matrix.size() - 1) {
                        int valx = rStart-j+1+loops;
                        int valy = cStart-1-loops;
                        if (valx < rows && valy < cols && valy > -1 && valx > -1)  {

                            matrix[countnumbers] = {valx, valy};
                            countnumbers++;
                        }
                    }

                }
            }
            turns++;
            if (turns == 2) {
                pathlength++;
            }
            if (turns == 4) {
                loops++;
                turns = 0;
                pathlength++;
            }

            if ( startmatrix == matrix) {
                count++;
                if (count == 5) {
                    spiraling = 0;
                }
            }

            else {
                count = 0;
            }
        }
        return matrix;
    }
};
