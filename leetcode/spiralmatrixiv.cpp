/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    vector<vector<int>> spiralMatrix(int m, int n, ListNode* head) {
        vector<vector<int>> matrix(m, vector<int>(n,-1));
        int cols = n;
        int rows = m;
        int spiraling = 1;
        int loops = 0;
        int start = 1;
        int turns = 0;
        int count = 0;
        int countnumbers = 1;
        int findelement = 0;
        while (spiraling == 1) {

            if (turns % 4 == 0) {
                for (int i = loops; i < n-loops ; i++) {
                    if (head != nullptr) {
                        matrix[loops][i] = head->val;
                        head = head->next;
                        findelement = 1;
                    }

                }
            }
            else if (turns % 4 == 1) {
                for (int j = 1+loops; j < m-loops ; j++) {
                    if (head != nullptr) {
                        matrix[j][cols-loops-1] = head->val;
                        head = head->next;
                        findelement = 1;
                    }


                }
            }
            else if (turns % 4 == 2) {
                for (int i = loops+1; i < n-loops ; i++) {
                    if (head != nullptr) {
                        matrix[rows-1-loops][cols-i-1] = head->val;
                        head = head->next;
                        findelement = 1;
                    }


                }
            }
            else {
                for (int j = loops+1; j < m-loops-1 ; j++) {
                    if (head != nullptr) {
                        matrix[rows-j-1][loops] = head->val;
                        head = head->next;
                        findelement = 1;
                    }


                }
            }
            turns++;
            if (turns == 4) {
                loops++;
                turns = 0;
            }

            if ( findelement == 0) {
                count++;
                if (count == 2) {
                    spiraling = 0;
                }
            }
            else {
                count = 0;
                findelement = 0;
            }
        }
        return matrix;
    }
};
