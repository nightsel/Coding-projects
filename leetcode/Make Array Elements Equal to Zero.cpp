class Solution {
public:
    int countValidSelections(vector<int>& nums) {
        int numb = 0;
        int dir;
        for (int j = 0; j < 2; j++) {
            for (int i = 0; i < nums.size(); i++) {
                vector<int> numscopy = nums;
                vector<int>::iterator curr = find(numscopy.begin()+i,numscopy.end(),0);


                if (curr == numscopy.end()) {
                    break;
                };
                if (curr != numscopy.begin()+i) continue;
                if (j == 0) {
                        dir = 1;
                    }
                    else {
                        dir = 0;
                    }
                while (true) {
                   // cout << *curr << "\n";
                   // for (int l = 0; l < nums.size(); l++) {
                   //     cout << nums[l] << "\n";
                   // }
                    //cout << (curr==numscopy.end()-1) << "\n";
                    if ((dir == 0 && curr==numscopy.begin() && *curr == 0) || ((dir == 1 && curr==numscopy.end()-1 && *curr == 0 )  )) {
                       // cout << "how";
                      //  for (int l = 0; l < numscopy.size(); l++) {
                       //    cout << j <<" "<< i<< " " << numscopy[l] << "\n";
                       // }
                        if (!any_of(numscopy.begin(), numscopy.end(), [](auto x){ return x != 0; })) {
                            numb++;
                        }
                      //  cout << "numb" << numb << "\n";
                        break;
                    }
                    if (*curr == 0) {
              //          cout << "gothere";
                        if (dir == 1) advance(curr,1);
                        else advance(curr,-1);
                     }
                    else if (*curr > 0) {
                        (*curr)--;
                   //     cout <<"hey" << *curr;
                        if (dir == 1) dir = 0;
                        else dir = 1;
                        if (dir == 1) curr++;
                        else curr--;
                    }
                }
            }
        }
        return numb;
    }
};
