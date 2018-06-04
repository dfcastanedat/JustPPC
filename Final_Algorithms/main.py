
import xlsxwriter
import random, time
import itertools
from graph import *
from priority_queue import *



# returns a list of tuples where each tuple is (state, cost_edge)
def get_states(state, dict_states_predecessors):
    len_state, states = len(state), []

    for i in range(len_state):
        sub_list = state[0:i + 1]  # gets sublist
        len_sub_list = len(sub_list)  # gets lenght sublist
        # gets tail list
        tail_list = state[i + 1:len_state]
        # realizes the flip
        # remove the top element (first element)
        top_element = sub_list.pop(0)
        # invert "sub_list"
        sub_list = sub_list[::-1]
        # inserts element of top on end of list
        sub_list.append(top_element)
        # concatenates the two lists
        list_state = sub_list + tail_list
        # inserts the "states" and the edge's cost if the state no exists in "dict_states_predecessors"
        if str(list_state) not in dict_states_predecessors:
            states.append((sub_list + tail_list, i + 1))

    if len(states) > 0:
        states.pop(0)  # removes first state that is the same "state"
    return states  # return all states


# runs algorithm
def run(state, time_sleep=1):
    goal_state = state[:]  # copy the goal state
    goal_state.sort()  # ordering goal_state
    graph = Graph()  # creates graph

    # fringe of the graph, fringe is an priority queue, priority is the smaller cost
    fringe = PriorityQueue()

    # append in priority queue, each item is a tuple (node, cumulative_cost)
    fringe.insert((Node(state), 0), 0)

    while not fringe.is_empty():  # while fringe not is empty

        node, cost_node = fringe.remove()  # removes node of the fringe

        if node.getState() == goal_state:  # verifies if reached the goal

            return cost_node

        # expands the node (generates states), each neighbor is a tuple (state, cost_edge)
        neighbors = get_states(node.getState(), graph.getStatesPredecessors(node))

        if neighbors:



            for neighbor in neighbors:
                state_neighbor, cost_edge = neighbor  # unpack tuple (state, cost_edge)
                neighbor_node = Node(state_neighbor)  # creates neighbor node
                graph.setParent(node, neighbor_node, cost_edge)  # set parent
                cumulative_cost = cost_node + 1  # calculates cumulative cost
                fringe.insert((neighbor_node, cumulative_cost), cumulative_cost)  # adds neighbor node on the fringe


if __name__ == "__main__":

    size=int(raw_input())
    c=int(raw_input())
    lista=[]
    for i in range(size):
        lista.append(raw_input())
    permutations=(list(list(itertools.permutations(lista))))

    if(c==0):
        initial_state = lista
        if (initial_state):
            total_cost = run(initial_state, time_sleep=1)
            print('Cantidad de flips: %s\n' % total_cost)

    if(c==1):
        row = 0
        col = 0
        workbook = xlsxwriter.Workbook('pancakes.xlsx')
        worksheet = workbook.add_worksheet()

        initial_state = lista
        flips_ini = run(initial_state, time_sleep=1)
        print('Cantidad de flips: %s\n' % flips_ini)
        for i in range(len(permutations)):
            total_cost = run(list(permutations[i]), time_sleep=1)
            if(total_cost==flips_ini):
                worksheet.write(row, col, ''.join(permutations[i]))
                worksheet.write(row, col + 1, flips_ini)
                row += 1
        workbook.close()


    if (c == 2):
        row = 0
        col = 0
        workbook = xlsxwriter.Workbook('pancakes.xlsx')
        worksheet = workbook.add_worksheet()

        initial_state = lista
        flips_ini = run(initial_state, time_sleep=1)
        print('Cantidad de flips: %s\n' % flips_ini)
        for i in range(len(permutations)):
            inicial = list(permutations[i])
            flips = run(inicial,time_sleep=1)
            worksheet.write(row, col, ''.join(permutations[i]))
            worksheet.write(row, col + 1, flips)
            row += 1
        workbook.close()
