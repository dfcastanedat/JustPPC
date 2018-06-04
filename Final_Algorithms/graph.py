# encoding:utf-8

# Author: Marcos Castro
# This file implements graphs

# class that represents the node
class Node:

    def __init__(self, state):
        self.__state, self.__parent = state, None

    def getState(self):
        return self.__state

    def setParent(self, parent):
        self.__parent = parent

    def getParent(self):
        return self.__parent


# class that represents the graph
class Graph:

    def setParent(self, source, destination, cost):
        destination.setParent(source)

    def getStatesPredecessors(self, node):
        predecessors, current_parent = {}, node.getParent()
        while(current_parent):
            predecessors[str(current_parent.getState())] = current_parent.getState()
            current_parent = current_parent.getParent()
        return predecessors