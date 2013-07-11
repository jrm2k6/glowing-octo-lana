__author__ = 'jrm2k6'

import random


class QuickSort(object):

    def __init__(self, _file):
        self.f = _file

    def pick_pivot(self, max_value):
        return random.randint(0, max_value)

    def quick_sort(self, l):
        if len(l) < 1:
            return l
        else:
            pivot_index = self.pick_pivot(len(l) - 1)
            pivot = l[pivot_index]

            self.write_state("pivot,{0}".format(str(pivot)))
            upper = []
            lower = []

            del l[pivot_index]

            for elem in l:
                if elem <= pivot:
                    lower.append(elem)
                else:
                    upper.append(elem)

            if len(lower) != 0:
                self.write_state("lower,{0}".format(str(lower)))

            if len(upper) != 0:
                self.write_state("upper,{0}".format(str(upper)))

            self.write_state("iteration,{0}".format(str(lower) + " [" +  str(pivot) + "] " + str(upper)))
            return self.quick_sort(lower) + [pivot] + self.quick_sort(upper)

    def write_state(self, state):
        if not self.f is None:
            self.f.write(state + "\n")


if __name__ == '__main__':
    f = open("test_output.txt", 'a')
    l = [2, 4, 6, 3, 8, 3, 1, 9, 5]
    f.write("initial_list,{} \n".format(str(l)))
    q = QuickSort(f)
    print q.quick_sort(l)