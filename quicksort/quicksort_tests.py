__author__ = 'jrm2k6'

import unittest
from quicksort import QuickSort


class TestQuicksort(unittest.TestCase):

    def setUp(self):
        self.q = QuickSort()

    def test_quick_sort_ordered_on_regular_list(self):
        l = [9, 6, 7, 3, 0, 1, 5, 2, 8, 4]
        r = self.q.quick_sort(l)

        self.assertEquals(r, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestQuicksort)
    unittest.TextTestRunner(verbosity=2).run(suite)
