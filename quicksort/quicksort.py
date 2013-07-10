__author__ = 'jrm2k6'

import random


class QuickSort(object):

    def __init__(self, _filename):
        self.filename = _filename
        self.f = None

        self.open_file_for_output()

    def open_file_for_output(self):
        self.f = open(self.filename, 'a')

    def pick_pivot(self, max):
        return random.randint(0, max)

    def quick_sort(self, l):
        if len(l) < 1:
            return l
        else:
            pivot_index = self.pick_pivot(len(l) - 1)
            pivot = l[pivot_index]
            
            self.write_state("pivot : " + str(pivot))
            upper = []
            lower = []

            del l[pivot_index]

            for elem in l:
                if elem <= pivot:
                    lower.append(elem)
                else:
                    upper.append(elem)

            if len(lower) != 0:
                self.write_state("lower " + str(lower))

            if len(upper) != 0:
                self.write_state("upper " + str(upper))

            self.write_state("iteration " + (str(lower)) + " [" +  str(pivot) + "] " + str(upper))
            return self.quick_sort(lower) + [pivot] + self.quick_sort(upper)

    def write_state(self, state):
        self.f.write(state + "\n")


if __name__ == '__main__':
    q = QuickSort("test_output")
    print q.quick_sort([2,4,6,3,8,3,1,9,5])