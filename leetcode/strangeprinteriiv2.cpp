// had to use chatgpt for the graph cycle recursion becaue I wasn't sure how to
// implement it even though I got the idea.
class Solution {
public:


    bool isPrintable(vector<vector<int>>& targetGrid) {
        int cols = 0;
        if (!targetGrid.empty()) {
            cols = targetGrid[0].size();
        }
        int n = cols;
        int m = targetGrid.size();
        vector<int> colors;
        for (int i = 0; i < m ; i++) {
            for (int j = 0; j < n; j++) {
                int color = targetGrid[i][j];
                if (std::find(colors.begin(),colors.end(),color) == colors.end()) {
                    colors.push_back(color);
                }
            }
        }

        vector<vector<int>>  coloredmatrix(m, vector<int>(n));
        // Coloring order
        // What squares are colored in each step
        // Coloring process


        // find smallest square containing all squares colored
        // easiest way is to check rows starting from top, then check columns starting from left.
        // do it for each color. store in a vector.
        /*cout << "colors \n";
        for (int i = 0; i < colors.size(); i++) {
            cout << colors[i] << "\n";
        }*/
        vector<vector<int>> colorsizes(colors.size(), vector<int>(4));
        int j;
        int k;
        int top;
        int left;
        int right;
        int bottom;
        vector<int> colororder;
        for (int i = 0 ; i < colors.size() ; i++) {
            int maxcol = -1;
            int mincol = -1;
            int minrow = -1;
            int maxrow = -1;
            j = 0;
            k = 0;
            while (j < targetGrid.size()) {
                if (targetGrid[j][k] == colors[i] && minrow == -1) {
                    minrow = j;
                }
                if (targetGrid[j][k] == colors[i]) {
                    maxrow = j;
                }
                k++;
                if (k == targetGrid[0].size()) {
                    j++;
                    k = 0;
                }
            }
            k = 0;
            j = 0;
            while (j < targetGrid[0].size()) {
                if (targetGrid[k][j] == colors[i] && mincol == -1) {
                    mincol = j;
                }
                if (targetGrid[k][j] == colors[i]) {
                    maxcol = j;
                }
                k++;
                if (k == targetGrid.size()) {
                    j++;
                    k = 0;
                }
            }

            // topleftbottomright
            colorsizes[i] = {minrow, mincol, maxrow, maxcol};
            /*squaresizes.push_back({i,(colorsizes[i][2]-colorsizes[i][0]+1)*(colorsizes[i][3]-colorsizes[i][1]+1)});*/
            colororder.push_back(i);


        }
        vector<vector<int>> topcolorvector;
        for (int i = 0; i < colors.size(); i++) {
            topcolorvector.push_back(ontopcolors(colorsizes, i, colororder));
        }
        cout << "topcolors\n";
        for (int j = 0; j < colors.size(); j++) {
            for (int i = 0 ; i < topcolorvector[j].size(); i++) {
                cout << colors[j] << colors[topcolorvector[j][i]] << "\n";
            }
        }

        // either one area has none of the overlapping number or the other area doesnt have the other overlapping number
        vector<vector<int>> problems(colors.size(),vector<int>{});
        for (int i = 0; i < topcolorvector.size(); i++ ) {
            for (int j = 0; j < topcolorvector[i].size(); j++) {
                    for (int k = colorsizes[topcolorvector[i][j]][0]; k <= colorsizes[topcolorvector[i][j]][2]; k++) {
                        for (int l = colorsizes[topcolorvector[i][j]][1]; l <= colorsizes[topcolorvector[i][j]][3]; l++) {
                            if (targetGrid[k][l] == colors[i] && std::find(problems[i].begin(),problems[i].end(),topcolorvector[i][j])==problems[i].end()) {
                                problems[i].push_back(topcolorvector[i][j]);
                            }
                        }
                    }
            }
        }
        /*
        cout << "listproblems\n";
        for (int i = 0; i < problems.size(); i++) {
            for (int j = 0;j < problems[i].size(); j++ ) {
                cout << i << j << problems[i][j] << "\n";
            }
        }*/
        for (int i = 0; i < problems.size(); i++) {
            for (int j = 0; j < problems[i].size(); j++) {
                if (problems[i][j] != -1) {
                    return findproblem(problems);
                }
            }
        }

        return true;
    }

        vector<int> ontopcolors(vector<vector<int>> colorsizes, int color, vector<int> colors) {
            int top = colorsizes[color][0];
            int left = colorsizes[color][1];
            int bottom = colorsizes[color][2];
            int right = colorsizes[color][3];
            int topTar;
            int leftTar;
            int bottomTar;
            int rightTar;
            vector<int> ontopc;
            for (int i = 0 ; i < colors.size(); i++) {
                if (colors[i] != color) {
                    topTar = colorsizes[colors[i]][0];
                    leftTar = colorsizes[colors[i]][1];
                    bottomTar = colorsizes[colors[i]][2];
                    rightTar = colorsizes[colors[i]][3];
                    if ( ((top <= bottomTar && bottom >= topTar)||(bottom >= topTar && top <= bottomTar)) && ((rightTar >= left && right >= leftTar)||( leftTar <= right && left <= rightTar))) {
                        ontopc.push_back(i);
                    }
                }
            }
            return ontopc;
        }

        bool dfsCycle(const vector<vector<int>>& problems, int node, vector<int>& visited, vector<int>& instack) {
            visited[node] = 1;
            instack[node] = 1;

            for (int n : problems[node]){
                if (!visited[n]) {
                    if ( dfsCycle(problems,n, visited, instack)) {
                        return true;
                    }
                }
                else if ( instack[n]) {
                    return true;
                }
            }
            instack[node] = 0;
            return false;
        }


        bool findproblem(vector<vector<int>>&problems) {
            int n = problems.size();
            vector<int> visited(n, 0), inStack(n, 0);

            for (int i = 0; i < n; i++) {
                if (!visited[i] && dfsCycle(problems, i, visited, inStack)) {
                    return false;
                }
            }
            return true;
        }
};
