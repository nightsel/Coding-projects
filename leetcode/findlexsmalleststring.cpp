class Solution {
public:
    string findLexSmallestString(string s, int a, int b) {

        string teststr = s;

        string tempstr = s;
        string smalleststring = s;
        string smalleststring2 = s;
        string oddstring(teststr.length() / 2, ' ');
        string oddstring2(teststr.length() / 2, ' ');
        string evenstring(teststr.length() / 2, ' ');
        string evensmallest(teststr.length() / 2, ' ');
        string oddsmallest(teststr.length() / 2, ' ');
        string oddsmallest2(teststr.length() / 2, ' ');
        string origstring = teststr;
        int looptimes = 1;
        for (int i = 0; i < 10; i++) {
            if ((looptimes*a)%10 == 0) break;
            looptimes++;
        }
        if (b % 2 == 0) {
            for (int i = 0; i < looptimes; i++) {
                for (int k = 0; k < s.length()/2; k++) {
                    tempstr = teststr;
                    int i = s.size() - 1;
                    teststr[i-k*2] = (teststr[i-k*2] - '0' + a) % 10 + '0';
              //      cout << s[i-k*2];
             //       cout << "\n";
            //        cout << testnumber;
        //            cout << "testll" << (testnumber % static_cast<int>(pow(10, 2*k+1))) << "\n";
        //           cout << "test" << tempnumb % static_cast<int>(pow(10, 2*k+1)) << "\n";
                }
        //       cout << "tempnumb" << tempnumb << "\n";
         //       cout << testnumber<< "\n";

                for (int j = 0; j < s.length(); j++) {
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                    cout << teststr <<"\n";
                    if (teststr < smalleststring) {
                        smalleststring = teststr;
                    }
                }
            }
        }
        else {
            // if the b number is not an even number.
            for (int j = 0; j < s.length(); j++) {
                origstring = origstring.substr(b) + origstring.substr(0, b);

                teststr = origstring;
                if (teststr < smalleststring) {
                    smalleststring = teststr;
                    cout << "smallestfound" << smalleststring <<"\n";
                }
                cout << "teststr" << teststr << "\n";
                for (int i = 1; i < looptimes; i++) {
                    tempstr = teststr;
                    for (int k = 0; k < s.length()/2; k++) {
                        int r = s.size() - 1;
                        teststr[r-k*2] = (teststr[r-k*2] - '0' + a*i) % 10 + '0';
                    }
                    cout << "teststring1" << teststr << "\n";
                    if (teststr < smalleststring) {
                        smalleststring = teststr;
                        cout << "smallestfound" << smalleststring <<"\n";
                    }
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                    if (teststr < smalleststring) {
                        smalleststring = teststr;
                        cout << "smallestfound" << smalleststring <<"\n";
                    }
                    for (int i = 0; i < looptimes; i++) {
                        for (int k = 0; k < s.length()/2; k++) {
                            int r = s.size() - 1;
                            teststr[r-k*2] = (teststr[r-k*2] - '0' + a) % 10 + '0';
                        }
                        if (teststr < smalleststring) {
                            smalleststring = teststr;
                            cout << "smallestfound" << smalleststring <<"\n";
                        }
                        cout << "here"<< teststr <<"\n";
                    }
                    teststr = tempstr;
                }
            }
        }


        //string smalleststring = to_string(smallestnumber);

        return smalleststring;
    }
};
