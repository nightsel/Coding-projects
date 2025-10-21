class Solution {
public:
    string findLexSmallestString(string s, int a, int b) {
        long long numbs = stol(s);
        long long tempnumb;
        string stringnumb;
        string teststr;

        long long smallestnumber = numbs;
        // go through all the numbers.
        long long testnumber = smallestnumber;
        if (b % 2 == 0) {
            cout << "hey";
            for (int i = 1; i < 11; i++) {
                for (int k = 0; k < s.length()/2; k++) {
                    tempnumb = testnumber;
                    testnumber = (testnumber + a*(pow(10,2*k)));
            //        cout << testnumber;
        //            cout << "testll" << (testnumber % static_cast<int>(pow(10, 2*k+1))) << "\n";
        //           cout << "test" << tempnumb % static_cast<int>(pow(10, 2*k+1)) << "\n";
                    if ((testnumber % static_cast<long long>(pow(10, 2*k+1))) < tempnumb % static_cast<long long>(pow(10, 2*k+1))) {
                        testnumber = testnumber -pow(10,2*k+1);
                    }
                }
        //       cout << "tempnumb" << tempnumb << "\n";
                cout << testnumber<< "\n";
                string teststr = to_string(testnumber);
                if (teststr.length() < s.length()) {
                    teststr = string(s.length()-teststr.length(), '0')+ teststr;
                }
                for (int j = 0; j < s.length(); j++) {
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                    cout << smallestnumber <<"\n";
                    cout << teststr;
                    if (stol(teststr) < smallestnumber) {
                        smallestnumber = stol(teststr);
                    }
                }
            }

        }
        else {
            // if the number is not an even number.
            for (int i = 1; i < 11; i++) {
                // add all numbers to the numbers. check which result is the smallest.

                for (int k = 0; k < s.length()/2; k++) {
                    tempnumb = testnumber;
                    testnumber = (testnumber + a*(pow(10,2*k)));
                 //   cout << testnumber;
        //            cout << "testll" << (testnumber % static_cast<int>(pow(10, 2*k+1))) << "\n";
        //           cout << "test" << tempnumb % static_cast<int>(pow(10, 2*k+1)) << "\n";
                    if ((testnumber % static_cast<long long>(pow(10, 2*k+1))) < tempnumb % static_cast<long long>(pow(10, 2*k+1))) {
                        testnumber = testnumber -pow(10,2*k+1);
                    }
                }
        //       cout << "tempnumb" << tempnumb << "\n";
          //      cout << testnumber<< "\n";
                string teststr = to_string(testnumber);
                for (int j = 0; j < s.length(); j++) {
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                   cout << "here"<< "\n" << teststr <<"\n"<< stol(to_string(smallestnumber).substr(1)) << "\n" << teststr.substr(1) <<"\n";
         //           cout << teststr;
                    if (stol(teststr) < smallestnumber) {
                        // count the numbers after first index since the first index changes later
                        smallestnumber = stol(teststr);
                    }
                }
            }

            stringnumb = to_string(numbs);
            teststr = stringnumb;
            if (teststr.length() < s.length()) {
                teststr = string(s.length()-teststr.length(), '0')+ teststr;
            }
            teststr = teststr.substr(b) + teststr.substr(0, b);
            testnumber = stol(teststr);

            cout << "first phase testfake" << smallestnumber << "\n";

            for (int i = 1; i < 11; i++) {

                for (int k = 0; k < s.length()/2; k++) {
                    tempnumb = testnumber;
                    testnumber = (testnumber + a*(pow(10,2*k)));
            //        cout << "good" <<testnumber<<"\n";
            //        cout << testnumber;
        //            cout << "testll" << (testnumber % static_cast<int>(pow(10, 2*k+1))) << "\n";
        //           cout << "test" << tempnumb % static_cast<int>(pow(10, 2*k+1)) << "\n";
                    if ((testnumber % static_cast<long long>(pow(10, 2*k+1))) < tempnumb % static_cast<long long>(pow(10, 2*k+1))) {
                        testnumber = testnumber -pow(10,2*k+1);
                    }
                }
                teststr = to_string(testnumber);
                if (teststr.length() < s.length()) {
                    teststr = string(s.length()-teststr.length(), '0')+ teststr;
                }
                for (int j = 0; j < s.length(); j++) {
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                    cout << "here"<< smallestnumber <<"\n";
                    cout << teststr;
                    if (stol(teststr) < smallestnumber) {
                        smallestnumber = stol(teststr);
                    }
                }

        //       cout << "tempnumb" << tempnumb << "\n";
           //     cout << testnumber<< "\n";
          //      if (smallestnumber > testnumber) {
          //         smallestnumber = testnumber;
            //    }
            }

            stringnumb = to_string(smallestnumber);
            string teststr = stringnumb;
            if (teststr.length() < s.length()) {
                teststr = string(s.length()-teststr.length(), '0')+ teststr;
            }
            //teststr = teststr.substr(b) + teststr.substr(0, b);
            testnumber = stol(teststr);
            cout << "first phase" << testnumber;
            for (int i = 1; i < 11; i++) {
                for (int k = 0; k < s.length()/2; k++) {
                    tempnumb = testnumber;
                    testnumber = (testnumber + a*(pow(10,2*k)));
            //        cout << "good" <<testnumber<<"\n";
            //        cout << testnumber;
        //            cout << "testll" << (testnumber % static_cast<int>(pow(10, 2*k+1))) << "\n";
        //           cout << "test" << tempnumb % static_cast<int>(pow(10, 2*k+1)) << "\n";
                    if ((testnumber % static_cast<long long>(pow(10, 2*k+1))) < tempnumb % static_cast<long long>(pow(10, 2*k+1))) {
                        testnumber = testnumber -pow(10,2*k+1);
                    }
                }
                teststr = to_string(testnumber);
                if (teststr.length() < s.length()) {
                    teststr = string(s.length()-teststr.length(), '0')+ teststr;
                }
                for (int j = 0; j < s.length(); j++) {
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                    cout << "here"<< smallestnumber <<"\n";
                    cout << teststr;
                    if (stol(teststr) < smallestnumber) {
                        smallestnumber = stol(teststr);
                    }
                }

        //       cout << "tempnumb" << tempnumb << "\n";
           //     cout << testnumber<< "\n";
          //      if (smallestnumber > testnumber) {
          //         smallestnumber = testnumber;
            //    }
            }
             stringnumb = to_string(smallestnumber);
            teststr = stringnumb;
            if (teststr.length() < s.length()) {
                teststr = string(s.length()-teststr.length(), '0')+ teststr;
            }
            teststr = teststr.substr(b) + teststr.substr(0, b);
            testnumber = stol(teststr);

            cout << "first phase test" << smallestnumber << "\n";

            for (int i = 1; i < 11; i++) {

                for (int k = 0; k < s.length()/2; k++) {
                    tempnumb = testnumber;
                    testnumber = (testnumber + a*(pow(10,2*k)));
            //        cout << "good" <<testnumber<<"\n";
            //        cout << testnumber;
        //            cout << "testll" << (testnumber % static_cast<int>(pow(10, 2*k+1))) << "\n";
        //           cout << "test" << tempnumb % static_cast<int>(pow(10, 2*k+1)) << "\n";
                    if ((testnumber % static_cast<long long>(pow(10, 2*k+1))) < tempnumb % static_cast<long long>(pow(10, 2*k+1))) {
                        testnumber = testnumber -pow(10,2*k+1);
                    }
                }
                teststr = to_string(testnumber);
                if (teststr.length() < s.length()) {
                    teststr = string(s.length()-teststr.length(), '0')+ teststr;
                }
                for (int j = 0; j < s.length(); j++) {
                    teststr = teststr.substr(b) + teststr.substr(0, b);
                    cout << "here"<< smallestnumber <<"\n";
                    cout << teststr;
                    if (stol(teststr) < smallestnumber) {
                        smallestnumber = stol(teststr);
                    }
                }

        //       cout << "tempnumb" << tempnumb << "\n";
           //     cout << testnumber<< "\n";
          //      if (smallestnumber > testnumber) {
          //         smallestnumber = testnumber;
            //    }
            }

            cout << "start \n";
            stringnumb = to_string(smallestnumber);
            teststr = stringnumb;
        }

        cout << smallestnumber;
        string smalleststring = to_string(smallestnumber);
        if (smalleststring.length() < s.length()) {
            smalleststring = string(s.length()-smalleststring.length(), '0')+ smalleststring;
        }
        return smalleststring;
    }
};
