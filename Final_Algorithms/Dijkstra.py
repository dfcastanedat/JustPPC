"""
https://github.com/prakhar1989/Algorithms/blob/master/dp/dijkstra.py
"""

graph = { 
    's' : {'t':6, 'y':7},
    't' : {'x':5, 'z':4, 'y':8 },
    'y' : {'z':9, 'x':3},
    'z' : {'x':7, 's': 2},
    'x' : {'t':2}
}

inf = float('inf')
def dijkstra(graph, start):
    n = len(graph.keys())
    dist = dict()
    Q = list()
    
    for v in graph:
        dist[v] = inf
    dist[start] = 0
    
    heappush(Q, (dist[start], start))

    while Q:
        d, u = heappop(Q)
        if d < dist[u]:
            dist[u] = d
        for v in graph[u]:
            if dist[v] > dist[u] + graph[u][v]:
                dist[v] = dist[u] + graph[u][v]
                heappush(Q, (dist[v], v))
    return dist


print dijkstra(graph, "s")
