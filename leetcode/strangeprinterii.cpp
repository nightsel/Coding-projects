// This doe not work fully accurately but it's close.
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
        // easiest way is to check rows starting from top and bottom, then check columns starting from left and right.
        // do it for each color. store in a vector.
        cout << "colors \n";
        for (int i = 0; i < colors.size(); i++) {
            cout << colors[i] << "\n";
        }
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
        cout << "listproblems\n";
        for (int i = 0; i < problems.size(); i++) {
            for (int j = 0;j < problems[i].size(); j++ ) {
                cout << i << j << problems[i][j] << "\n";
            }
        }
        for (int i = 0; i < problems.size(); i++) {
            for (int j = 0; j < problems[i].size(); j++) {
                if (problems[i][j] != -1) {
                    int probcolor = problems[i][j];
                    return findproblem(problems, probcolor, i, j, colors);
                }
            }
        }

        return true;

        // color matrices with a while loop that iterates over all possibilities. for loop for all starting colors


        // color permutations.

        // correct method but expensive
        //bool perms = permute(colororder, colors, colorsizes, coloredmatrix,  targetGrid);

        //return perms;


        /*for (int i = 0 ; i < perms.size() ; i++)
            for (int j = 0; j < perms[i].size(); j++) {
                cout << "permsij" << colors[perms[i][j]];
                top = colorsizes[perms[i][j]][0];
                left = colorsizes[perms[i][j]][1];
                bottom = colorsizes[perms[i][j]][2];
                right = colorsizes[perms[i][j]][3];

                cout << "topleftbottomright \n";
                cout << top << "\n";
                cout << left << "\n";
                cout << bottom << "\n";
                cout << right << "\n";
                cout << "\n";

                for (int k = top; k <= bottom; k++) {
                    for (int l = left; l <= right; l++) {
                        coloredmatrix[k][l] = colors[perms[i][j]];
                    }
                }
                if (targetGrid == coloredmatrix) {
                    return true;
                }
            }
        return false;*/
    }

    /*void solution(vector<int>& ds,vector<vector<int>>& ans,vector<int>& freq,vector<int> nums, vector <int> colors, vector<vector<int>> colorsizes, vector<vector<int>>& coloredmatrix, vector<vector<int>> targetGrid){

        // This part means that if the current iteration is at the maximum number of numbers,
        // then the result should be included in the permutations.
        if(ds.size() == nums.size()){
            //ans.push_back(ds);
            return;
        }
        for(int i = 0 ; i < nums.size() ; i ++){
            // if the current number has not yet been handled in this part of the loop, then it can be handled now
            if(!freq[i]){
                // push back the current number to next iteration's sequence
                ds.push_back(nums[i]);
                // consider the number handled for next iterations
                freq[i]=1;
                // iterate the next number in current sequence with recursion
                solution(ds,ans,freq,nums,colors,colorsizes,coloredmatrix,targetGrid);
                // consider the number not handled for the next sequence
                freq[i]=0;
                // remove the number that was handled from the current sequence so another number can be iterated.
                ds.pop_back();
            }
        }

    }

        bool permute(vector<int>& nums, vector <int> colors, vector<vector<int>> colorsizes, vector<vector<int>>&coloredmatrix, vector<vector<int>> targetGrid) {
            // completed vector of sequences
            vector<vector<int>> ans;
            // current sequence being iterated
            vector<int> ds;

            // numbers that get iterated.
            vector<int> freq(nums.size(),0);
            // set all numbers to not be handled yet
            for(int i = 0 ; i < nums.size() ; i ++) freq[i] = 0;
            // find sequences with recursive iterations, and update ans within iterations
            solution(ds,ans,freq,nums,colors,colorsizes,coloredmatrix,targetGrid);
            // return result
            return false;

        }*/
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
        void solve(vector<vector<int>>problems, int probcolor, int i, int j, vector<int>colors, int& currentcolor, vector<int>& problemloop, int& error) {
            if (std::find(problems[probcolor].begin(),problems[probcolor].end(), i) != problems[probcolor].end()) {
                cout <<"problem found \n"<< colors[problems[i][j]] <<"\n" << i;
                int currentcolor = problems[i][j];
             //   for (int k = 0; k < problems[probcolor].size(); k++) {
              //      problemloop.push_back(problems[probcolor][k]);
             //       solve(problems,probcolor,i,j,colors,currentcolor,problemloop, error);
             //   }
                error = 1;
            }
        }
        bool findproblem(vector<vector<int>>problems, int probcolor, int i, int j, vector<int>colors) {
            vector<int>problemloop = {probcolor};
            int error = 0;
            int currentcolor = probcolor;
            solve(problems,probcolor,i,j,colors,currentcolor,problemloop, error);
            if (error == 1) {
                return false;
            }

            return true;
        }

};
