from enum import Enum
import json
from copy import deepcopy

import sys
sysargs = sys.argv

verbose_mode = False

# symbol string representations to be used for printing
symbol_str_representations = [
    ["       ",
     "       ",
     "       "],
    ["       ",
     "───────",
     "       "],
    ["   │   ",
     "   │   ",
     "   │   "],
    ["       ",
     "   ╭───",
     "   │   "],
    ["       ",
     "───╮   ",
     "   │   "],
    ["   │   ",
     "   ╰───",
     "       "],
    ["   │   ",
     "───╯   ",
     "       "],
    ["   │   ",
     "───────",
     "   │   "],
    ["   │   ",
     "───│───",
     "   │   "],
    [" ╭─╯   ",
     "─╯   ╭─",
     "   ╭─╯ "],
    ["   ╰─╮ ",
     "─╮   ╰─",
     " ╰─╮   "],
]

class Symbol(Enum):
    EMPTY = 0
    HORIZONTAL = 1
    VERTICAL = 2
    RIGHT_BOT_CORNER = 3
    LEFT_BOT_CORNER = 4
    RIGHT_TOP_CORNER = 5
    LEFT_TOP_CORNER = 6
    HOR_CROSS = 7
    VERT_CROSS = 8
    DIAG1 = 9
    DIAG2 = 10

    def __str__(self):
        return ' ─│┌┐└┘┴┤/\\'[self.value]

class Direction(Enum):
    NONE = (0, 0)
    RIGHT = (0, 1)
    LEFT = (0, -1)
    UP = (-1, 0)
    DOWN = (1, 0)

def opening(symbol: Symbol, dir: Direction) -> bool:
    match symbol:
        case Symbol.EMPTY: return False
        case Symbol.HORIZONTAL:
            if dir == Direction.RIGHT or dir == Direction.LEFT:
                return True
            return False
        case Symbol.VERTICAL:
            if dir == Direction.UP or dir == Direction.DOWN:
                return True
            return False
        case Symbol.RIGHT_BOT_CORNER:
            if dir == Direction.RIGHT or dir == Direction.DOWN:
                return True
            return False
        case Symbol.LEFT_BOT_CORNER:
            if dir == Direction.LEFT or dir == Direction.DOWN:
                return True
            return False
        case Symbol.RIGHT_TOP_CORNER:
            if dir == Direction.RIGHT or dir == Direction.UP:
                return True
            return False
        case Symbol.LEFT_TOP_CORNER:
            if dir == Direction.LEFT or dir == Direction.UP:
                return True
            return False
        case Symbol.HOR_CROSS: return True
        case Symbol.VERT_CROSS: return True
        case Symbol.DIAG1: return True
        case Symbol.DIAG2: return True

def opposite_dir(dir: Direction) -> Direction:
    match dir:
        case Direction.RIGHT: return Direction.LEFT
        case Direction.LEFT: return Direction.RIGHT
        case Direction.UP: return Direction.DOWN
        case Direction.DOWN: return Direction.UP
        case Direction.NONE: return Direction.NONE
     
def walk_symbol(symbol: Symbol, dir: Direction) -> Direction:
    """
    Returns the direction in which the walk should continue after encountering the given symbol in the given direction.

    This function assumes that the walk is coming from the opposite direction of the given direction.

    :param symbol: The symbol encountered during the walk.
    :param dir: The direction from which the walk encountered the symbol.

    :return: The direction in which the walk should continue. If the walk should stop, returns Direction.NONE.
    """
    if not opening(symbol, opposite_dir(dir)):
        return Direction.NONE

    match symbol, dir:
        case Symbol.HORIZONTAL, Direction.RIGHT:
            return Direction.RIGHT
        case Symbol.HORIZONTAL, Direction.LEFT:
            return Direction.LEFT
        
        case Symbol.VERTICAL, Direction.UP:
            return Direction.UP
        case Symbol.VERTICAL, Direction.DOWN:
            return Direction.DOWN
        
        case Symbol.RIGHT_BOT_CORNER, Direction.UP: 
            return Direction.RIGHT
        case Symbol.RIGHT_BOT_CORNER, Direction.LEFT:
            return Direction.DOWN
        
        case Symbol.LEFT_BOT_CORNER, Direction.UP:
            return Direction.LEFT
        case Symbol.LEFT_BOT_CORNER, Direction.RIGHT:
            return Direction.DOWN
        
        case Symbol.RIGHT_TOP_CORNER, Direction.DOWN:
            return Direction.RIGHT
        case Symbol.RIGHT_TOP_CORNER, Direction.LEFT:
            return Direction.UP
        
        case Symbol.LEFT_TOP_CORNER, Direction.DOWN:
            return Direction.LEFT
        case Symbol.LEFT_TOP_CORNER, Direction.RIGHT:
            return Direction.UP

        case Symbol.HOR_CROSS, _: return dir
        case Symbol.VERT_CROSS, _: return dir

        case Symbol.DIAG1, Direction.RIGHT:
            return Direction.UP
        case Symbol.DIAG1, Direction.LEFT:
            return Direction.DOWN
        case Symbol.DIAG1, Direction.DOWN:
            return Direction.LEFT
        case Symbol.DIAG1, Direction.UP:
            return Direction.RIGHT

        case Symbol.DIAG2, Direction.RIGHT:
            return Direction.DOWN
        case Symbol.DIAG2, Direction.LEFT:
            return Direction.UP
        case Symbol.DIAG2, Direction.DOWN:
            return Direction.RIGHT
        case Symbol.DIAG2, Direction.UP:
            return Direction.LEFT
        
        case Symbol.EMPTY: return Direction.NONE

        case _: return Direction.NONE
        

def find_possible_dir(symbol: Symbol) -> Direction:
    for dir in Direction:
        if opening(symbol, dir) and dir != Direction.NONE:
            return dir

    return Direction.NONE

def coords_in_dir(coords: tuple[int, int], dir: Direction) -> tuple[int, int]:
    return coords[0] + dir.value[0], coords[1] + dir.value[1]

def dir_from_to(from_coords: tuple[int, int], to_coords: tuple[int, int]) -> Direction:
    return Direction((to_coords[0] - from_coords[0], to_coords[1] - from_coords[1]))

def get_direct_neighbours(coords: tuple[int, int]) -> list[tuple[int, int]]:
    return [coords_in_dir(coords, dir) for dir in Direction][1:] #might cause pb on edges



class Knot:
    """
    Represents a knot using a matrix of symbols.

    The Knot class provides methods to manipulate and analyze a knot diagram,
    represented as a matrix of symbols.

    :param matrix: A 2D list representing the knot diagram using symbols.
    
    Attributes:
        matrix (list[list[int]]): A 2D list representing the knot diagram using symbols.
    """

    def __init__(self, matrix: list[list[int]] = []):
        """:param matrix: A 2D list representing the knot diagram using symbols."""
        self.matrix: list[list[int]] = matrix

    def get_cell_at(self, coords: tuple[int, int]):
        return self.matrix[coords[0]][coords[1]]

    def get_size(self):
        return (len(self.matrix), len(self.matrix[0]))


    def first_crossing_coords(self) -> tuple[int, int]:
        size = self.get_size()
        for i in range(size[0]):
            for j in range(size[1]):
                sym = self.matrix[i][j]
                if sym == 7 or sym == 8:
                    return i, j
        return -1, -1
    
    def uncross(self, crossing_coords: tuple[int, int]) -> tuple["Knot", "Knot"]:
        """
        Returns two new knots, each one resulting from a different resolution of the crossing at the given coordinates, following the rules of Kauffman's bracket.

        :param crossing_coords: The coordinates of the crossing to be resolved.
        :return: A tuple of two knots, each one resulting from a different resolution of the crossing.
        """

        crossing = self.get_cell_at(crossing_coords)

        matrix1 = deepcopy(self.matrix)
        matrix2 = deepcopy(self.matrix)

        if crossing == Symbol.HOR_CROSS.value:
            matrix1[crossing_coords[0]][crossing_coords[1]] = Symbol.DIAG1.value
            matrix2[crossing_coords[0]][crossing_coords[1]] = Symbol.DIAG2.value
        elif crossing == 8:
            matrix1[crossing_coords[0]][crossing_coords[1]] = Symbol.DIAG2.value
            matrix2[crossing_coords[0]][crossing_coords[1]] = Symbol.DIAG1.value

        return Knot(matrix1), Knot(matrix2)
    
    def walk_from(self, start_coords: tuple[int, int], start_dir: Direction = Direction.NONE) -> list[tuple[int, int]]:
        """
        Walks through the knot, starting from the given start position and direction.

        :param start_coords: The coordinates of the starting position.
        :param start_dir: The direction to go from the starting position. If not specified, the function tries to find a possible direction.

        :returns: A list of all the coordinates in the order they are encountered during the walk.
        """

        first_cell = self.get_cell_at(start_coords)
        knot_cells = [start_coords]
        
        start_dir = start_dir if start_dir != Direction.NONE else find_possible_dir(Symbol(first_cell))
        current_dir = start_dir
        if current_dir == Direction.NONE: return []

        next_coords = coords_in_dir(start_coords, current_dir)

        while next_coords != start_coords or start_dir != walk_symbol(Symbol(self.get_cell_at(next_coords)), current_dir):
            next_cell = self.get_cell_at(next_coords)
            knot_cells.append(next_coords)

            current_dir = walk_symbol(Symbol(next_cell), current_dir)
            if current_dir == Direction.NONE: 
                return []

            next_coords = coords_in_dir(next_coords, current_dir)

        return knot_cells


    def find_first_symbol(self) -> tuple[int, int]:
        size = self.get_size()
        for i in range(size[0]):
            for j in range(size[1]):
                if self.matrix[i][j] != Symbol.EMPTY.value:
                    return i, j
        return -1, -1

    def remove_unknot(self, coords_list: list[tuple[int, int]]) -> "Knot":
        """
        Removes an unknot from the knot matrix based on the given coordinates list.

        :param coords_list: A list of coordinates representing the positions of the 
                            unknot in the matrix.
        :returns: A new Knot instance with the unknot removed.
        """

        dup_matrix = deepcopy(self.matrix)

        for i, coords in enumerate(coords_list):
            symbol = Symbol(self.get_cell_at(coords))

            next_coords = coords_list[i+1 if i+1 < len(coords_list) else 0]
            dir_to_next = dir_from_to(coords, next_coords)

            replacement_symbol = Symbol.EMPTY.value


            if (symbol == Symbol.DIAG1 or symbol == Symbol.DIAG2) \
                and all(n_coords in coords_list for n_coords in get_direct_neighbours(coords)) \
                and set(self.walk_from(coords, Direction.LEFT)) == set(self.walk_from(coords, Direction.RIGHT)):
                pass

            elif symbol == Symbol.DIAG1:
                if dir_to_next == Direction.DOWN or dir_to_next == Direction.RIGHT:
                    replacement_symbol = Symbol.LEFT_TOP_CORNER.value
                else:
                    replacement_symbol = Symbol.RIGHT_BOT_CORNER.value

            elif symbol == Symbol.DIAG2:
                if dir_to_next == Direction.DOWN or dir_to_next == Direction.LEFT:
                    replacement_symbol = Symbol.RIGHT_TOP_CORNER.value
                else:
                    replacement_symbol = Symbol.LEFT_BOT_CORNER.value


            dup_matrix[coords[0]][coords[1]] = replacement_symbol

        return Knot(dup_matrix)
            
            

    def count_unknots(self):
        """
        Returns the number of disjoint unknots in the given knot.

        This function assumes that self is only disjoint unknots.
        """
        
        unknots_count = 0
        k = self
        while (first_symbol_coords := k.find_first_symbol()) != (-1, -1):
            k = k.remove_unknot(k.walk_from(first_symbol_coords))

            unknots_count += 1
        return unknots_count
    
    def __str__(self):
        size = self.get_size()
        str_rep = [[" " for _ in range(size[1]*7)] for _ in range(size[0]*3)]

        for i in range(size[0]):
            for j in range(size[1]):
                sym = symbol_str_representations[self.matrix[i][j]]
                for k in range(3):
                    for l in range(7):
                        str_rep[i*3+k][j*7+l] = sym[k][l]

    
        return '\n'.join([''.join(row) for row in str_rep])




# data structure: kauffman polynomial is represented by
# by a dictionary where keys are powers of the indeterminate a and the values are the coefficients
# of a^key
class KauffmanPol:
    """
    Represents a Kauffman polynomial.

    Implements addition, subtraction and multiplication for Kauffman polynomials.
    """
    def __init__(self, pol: dict[int, int] = {}):
        self.pol = pol

    def __add__(self: "KauffmanPol", p: "KauffmanPol"):
        sum = self.pol.copy()
        pol2 = p.pol.copy()
        for exp in pol2:
            coef = 0 if not exp in sum else sum[exp]
            sum[exp] = coef + pol2[exp]
        
        return KauffmanPol(sum)
    
    def __sub__(self: "KauffmanPol", p: "KauffmanPol"):
        dif = self.pol.copy()
        pol2 = p.pol.copy()
        for exp in pol2:
            coef = 0 if not exp in dif else dif[exp]
            dif[exp] = coef - pol2[exp]
        
        return KauffmanPol(dif)

    def __mul__(self: "KauffmanPol", p: "KauffmanPol"):
        pol1 = self.pol.copy()
        pol2 = p.pol.copy()
        prod: dict[int, int] = {}
        for exp1 in pol1:
            for exp2 in pol2:
                exp = exp1 + exp2
                coeff = 0 if not exp in prod else prod[exp]

                prod[exp] = coeff + pol1[exp1] * pol2[exp2]
        return KauffmanPol(prod)
    
    def __rmul__(self: "KauffmanPol", coeff: int):
        return KauffmanPol({key: coeff * val for key, val in self.pol.items()})
    
    def __eq__(self, value: object) -> bool:
        if not isinstance(value, KauffmanPol): return False
        return self.pol == value.pol

    def pow(self, exp: int):
        res = KauffmanPol({0: 1})
        for _ in range(exp):
            res *= self
        return res
    
    
    def __str__(self: "KauffmanPol"):
        pol_list = [(key, self.pol[key]) for key in self.pol]
        pol_list.sort(key=(lambda elt: elt[0]))

        def coeff_str(coeff: int, exp: int) -> str:
            sign_str = "+" if coeff > 0 else "-"
            pos_coeff_nb = abs(coeff) if abs(coeff) != 1 or exp == 0 else ""
            if exp == 0: return f"{sign_str} {pos_coeff_nb}"
            return f"{sign_str} {pos_coeff_nb}A"

        def exp_str(exp: int, coeff: int) -> str:
            if exp == 1 or exp == 0: return ""
            exp_nb_str = "⁰¹²³⁴⁵⁶⁷⁸⁹"

            exp_str = ''.join([exp_nb_str[int(i_str)] for i_str in str(abs(exp))])

            exp_sign = chr(8315) if exp < 0 else ""

            return f"{exp_sign}{exp_str}"

        pol_str_list = [f"{coeff_str(term[1], term[0])}{exp_str(term[0], term[1])} " if term[1] != 0 else "" for term in pol_list]

        return ''.join(pol_str_list)


# Kauffman's polynomial indeterminate
a = KauffmanPol({1:1})
b = KauffmanPol({-1:1})
d = KauffmanPol({-2:-1, 2:-1})


def kauffman(k: Knot) -> KauffmanPol:
    """
        implementation of kauffman algorithm

        :param k: any knot
        :returns: the kauffman polynomial of the given knot
    """
    def kauffmanR(k: Knot, i: int = 0) -> KauffmanPol:
        # recursive implementation of kauffman algorithm
        # i is the current recursion level, used for verbose printing

        first_cross_coords = k.first_crossing_coords()
        if first_cross_coords == (-1, -1):
            unknots_count = k.count_unknots()
            if verbose_mode: # verbose print
                print(f"╭─ i={i} ───────────")
                print(f"│ found {unknots_count} unknots")
                print("╰─────────────────")

            return d.pow(unknots_count-1)

        k1, k2 = k.uncross(first_cross_coords)

        if verbose_mode: # verbose print
            print(f"╭─ i={i} ─────────")
            print(f"│ a. \n")
            print(k1)
            print(f"\n│ b. \n")
            print(k2)
            print("╰─────────────────")

        return a*kauffmanR(k1, i+1) + b*kauffmanR(k2, i+1)
    return kauffmanR(k)

    


def test():
    """used only for testing things"""

    k1 = Knot([
        [0, 3, 4, 0, 0],
        [3, 7, 8, 4, 0],
        [5, 8, 7, 8, 4],
        [0, 5, 8, 6, 2],
        [0, 0, 5, 1, 6]
    ])

    k2 = Knot([
        [3, 1, 4, 0, 0],
        [2, 0, 2, 0, 0],
        [5, 1, 10, 1, 4],
        [0, 0, 2, 0, 2],
        [0, 0, 5, 1, 6]
    ])

    right_trefoil = Knot([
        [0, 3, 4, 0],
        [3, 7, 8, 4],
        [2, 5, 7, 6],
        [5, 1, 6, 0]
    ])

    left_trefoil = Knot([
        [0, 3, 4, 0],
        [3, 8, 7, 4],
        [5, 7, 6, 2],
        [0, 5, 1, 6]   
    ])

    unknot = Knot([
        [3, 4],
        [5, 6]
    ])

    k3 = Knot([[3,1,1,4,0],[2,0,3,8,4],[2,3,8,6,2],[5,8,6,0,2],[0,5,1,1,6]])
    
    pr = kauffman(right_trefoil)
    print(right_trefoil)
    print("Noeud de trèfle à droite: <K1> = ", pr)

    pl = kauffman(left_trefoil)
    print(left_trefoil)
    print(f"Noeud de trèfle à gauche: <K2> = {pl}")

    left_and_right_trefoil = Knot([[0,3,4,0,0,0,3,4,0],[3,8,7,1,1,1,7,8,4],[5,7,6,0,0,0,5,7,6],[0,5,1,1,1,1,1,6,0]])

    prl = kauffman(left_and_right_trefoil)
    print(left_and_right_trefoil)
    print("<K1#K2> = ", prl)

    print("")
    print(f"<K1><K2> = ({pl})*({pr})")
    print(f"         = {pl*pr}")
    print( "<K1><K2> = <K1#K2>")
    print(pr*pl == prl)


    # figure8 = Knot([[0,0,3,4,0],[3,1,8,7,4],[2,3,7,6,2],[5,7,6,0,2],[0,5,1,1,6]])

    # print(kauffman(figure8))

    # print(k1, k2, k3, unknot, right_trefoil)


if __name__ == "__main__":
    if sysargs.count("-v") > 0: # toggle verbose mode
        verbose_mode = True

    if sysargs.count("-t") > 0: # run tests
        test()

    elif (i := sysargs.index("-k")) != -1: # run kauffman on specified knot
        try:
            k = Knot(json.loads(sysargs[i+1]))
            print(kauffman(k))
            if verbose_mode:
                print(k)
        except:
            print("Error: invalid knot")

    elif (i := sysargs.index("-d")) != -1: # draw specified knot
        try:
            k = Knot(json.loads(sysargs[i+1]))
            print(k)
        except:
            print("Error: invalid knot")
 