class Solution {
public:
    int smallestNumber(int n) {

        std::string binary = std::bitset<10>(n).to_string();
        binary.erase(0, binary.find('1'));
        std::string allOnes(binary.size(), '1');
        return stoi(allOnes, nullptr, 2);

    }
};
