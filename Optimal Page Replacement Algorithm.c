// CPP program to demonstrate optimal page
// replacement algorithm.
// Tomado y modificado de GeeksforGeeks: https://www.geeksforgeeks.org/program-optimal-page-replacement-algorithm/
#include <bits/stdc++.h>
using namespace std;
 
// Function to check whether a page exists
// in a frame or not
bool search(int key, vector<int>& fr)
{
    for (int i = 0; i < fr.size(); i++)
        if (fr[i] == key)
            return true;
    return false;
}
 
// Function to find the frame that will not be used
// recently in future after given index in pg[0..pn-1]
int predict(int pg[], vector<int>& fr, int pn, int index)
{
    // Store the index of pages which are going
    // to be used recently in future
    int res = -1, farthest = index;
    for (int i = 0; i < fr.size(); i++) {
        int j;
        for (j = index; j < pn; j++) {
            if (fr[i] == pg[j]) {
                if (j > farthest) {
                    farthest = j;
                    res = i;
                }
                break;
            }
        }
 
        // If a page is never referenced in future,
        // return it.
        if (j == pn)
            return i;
    }
 
    // If all of the frames were not in future,
    // return any of them, we return 0. Otherwise
    // we return res.
    return (res == -1) ? 0 : res;
}
 
void optimalPage(int pg[], int pn, int fn)
{
    // Create an array for given number of
    // frames and initialize it as empty.
    vector<int> fr;
 
    // Traverse through page reference array
    // and check for miss and hit.
    int hit = 0;
    for (int i = 0; i < pn; i++) {
 
        // Page found in a frame : HIT
        if (search(pg[i], fr)) {
            hit++;
            continue;
        }
 
        // Page not found in a frame : MISS
 
        // If there is space available in frames.
        if (fr.size() < fn)
            fr.push_back(pg[i]);
 
        // Find the page to be replaced.
        else {
            int j = predict(pg, fr, pn, i + 1);
            fr[j] = pg[i];
        }
    }
    cout << "No. of hits = " << hit << endl;
    cout << "No. of misses = " << pn - hit << endl;
}
void generateReferenceString(int size_pg, int random_limit)
{
   int i;
   srand(time(0));
   ReferenceString = (int *)malloc( sizeof(int) * size_pg );
   for(i=0; i< size_pg; i++)
   {
	ReferenceString[i] = rand() % random_limit;
   }
   return ReferenceString;
}
 
// Driver Function
int main()
{
    //Number of frames
    int number_frames,size_pg;
    int random_limit = 8;
    int pg[];
    printf("Enter number of frames: ");
    scanf("%d", &number_frames);}
    printf("\n");
    printf("Enter size of Page Reference String: ");
    scanf("%d", &size_pg);
    printf("\n");
    
    int pg[] = generateReferenceString(size_pg,random_limit);
    printf("The randomized Reference String: ");
    for(i=0; i< size_pg; i++)
   {
       printf("%d ", pg[i]);       
   }
    
    int pn = sizeof(pg) / sizeof(pg[0]);
    optimalPage(pg, pn, number_frames);
    return 0;
}
