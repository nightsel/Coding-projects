class Solution {
public:
    int maxProfitAssignment(vector<int>& difficulty, vector<int>& profit, vector<int>& worker) {
        //std::sort(worker.begin(),worker.end(),std::greater<>());
        std::vector<std::pair<int,int>> pairs;
        for (size_t i = 0; i < profit.size(); ++i)
        pairs.emplace_back(profit[i], difficulty[i]);
        std::sort(pairs.begin(), pairs.end(),
                [](auto &a, auto &b){ return a.first > b.first; });

        for (size_t i = 0; i < pairs.size(); ++i) {
            profit[i] = pairs[i].first;
            difficulty[i] = pairs[i].second;
        }
        int totalprofit = 0;
        for (int i = 0; i < worker.size(); i++) {
            for (int j = 0 ; j <profit.size(); j++) {
                if (worker[i] >= difficulty[j]) {
                    totalprofit += profit[j];
                    break;
                }
            }
        }
        return totalprofit;
    }
};
