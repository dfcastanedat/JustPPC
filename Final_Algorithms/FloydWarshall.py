"""
https://github.com/prakhar1989/Algorithms/blob/master/dp/floyd.py
https://github.com/TheAlgorithms/Python/blob/master/data_structures/Graph/FloydWarshall.py
http://www.programming-algorithms.net/article/45708/Floyd-Warshall-algorithm
https://www.geeksforgeeks.org/dynamic-programming-set-16-floyd-warshall-algorithm/
"""
inf = float("inf")

G = [
    [0, 3, 8, inf, -4], 
    [inf, 0, inf, 1, 7], 
    [inf, 4, 0, inf, inf], 
    [2, inf, -5, 0, inf], 
    [inf, inf, inf, 6, 0]
]

G2 = [
    [0,5,inf,10],
    [inf,0,3,inf],
    [inf, inf, 0,   1],
    [inf, inf, inf, 0]
]

def floydWarshall(graph):
    n = len(graph)
    D = graph # D is a matrix of lengths
    P = []
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if i == j:
                    D[i][j] = 0
                else:
                    D[i][j] = min(D[i][j], D[i][k] + D[k][j])
    return D


def printFW(Dist):
    n = len(Dist)
    print("Following matrix shows the shortest distances between every pair of vertices")
    for i in range(n):
        for j in range(n):
            if(Dist[i][j] == inf):
                print("%7s," % ("INF"), end=("\t"))
            else:
                print("%7d," % (Dist[i][j]), end=("\t"))
            if j == n-1:
                print("")

printFW(floydWarshall(G2))
