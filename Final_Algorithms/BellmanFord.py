"""
https://github.com/prakhar1989/Algorithms/blob/master/dp/bellman_ford.py
http://www.programming-algorithms.net/article/47389/Bellman-Ford-algorithm

"""
G = { 
    's' : {'t':6, 'y':7},
    't' : {'x':5, 'z':-4, 'y':8 },
    'y' : {'z':9, 'x':-3},
    'z' : {'x':7, 's': 2},
    'x' : {'t':-2}
}

inf = float("inf")

dist = {}
predecessor = {}

def initialize_single_source(graph, start):
    for v in graph:
        dist[v] = inf
        predecessor[v] = None
    dist[start] = 0

def relax(graph, u, v):
    if dist[v] > dist[u] + graph[u][v]:
        dist[v] = dist[u] + graph[u][v]
        predecessor[v] = u

def bellman_ford(graph, start):
    initialize_single_source(graph, start)
    n = len(graph)
    edges = [(u, v) for u in graph for v in graph[u].keys()]

    for i in range(n-1):
        for (u,v) in edges:
            relax(graph, u, v)
    for (u,v) in edges:
        if dist[v] > dist[u] + graph[u][v]:
            return False # there exists a negative cycle
    return True

def get_distances(graph, start):
    if bellman_ford(graph, start):
        return dist
    return "Graph contains a negative cycle"

print(get_distances(G, 's'))