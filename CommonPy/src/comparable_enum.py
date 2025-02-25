'''
Module providing enhanced enum functionality with comparison operations.

This module defines an EnumComparable base class that extends Python's built-in Enum
to support rich comparison operations between enum members, numbers, and strings.
The comparison is based on the enum's value for numeric comparisons and name for string equality.

Example:
    class MyEnum(EnumComparable):
        ONE = 1
        TWO = 2
        
    MyEnum.ONE < MyEnum.TWO  # True
    MyEnum.TWO > 1  # True
    MyEnum.ONE >= "ONE"  # True
'''


import enum
import numbers


class EnumComparable(enum.Enum):
    '''
    A class that allows enums to be compared to each other.
    '''
    def __gt__(self, other):
        try:
            return self.value > other.value
        except AttributeError:
            pass
        try:
            if isinstance(other, numbers.Real):
                return self.value > other
        except AttributeError:
            pass
        return NotImplemented

    def __lt__(self, other):
        try:
            return self.value < other.value
        except AttributeError:
            pass
        try:
            if isinstance(other, numbers.Real):
                return self.value < other
        except AttributeError:
            pass
        return NotImplemented

    def __ge__(self, other):
        try:
            return self.value >= other.value
        except AttributeError:
            pass
        try:
            if isinstance(other, numbers.Real):
                return self.value >= other
            if isinstance(other, str):
                return self.name == other
        except AttributeError:
            pass
        return NotImplemented

    def __le__(self, other):
        try:
            return self.value <= other.value
        except AttributeError:
            pass
        try:
            if isinstance(other, numbers.Real):
                return self.value <= other
            if isinstance(other, str):
                return self.name == other
        except AttributeError:
            pass
        return NotImplemented

    def __eq__(self, other):
        if self.__class__ is other.__class__:
            return self is other
        try:
            return self.value == other.value
        except AttributeError:
            pass
        try:
            if isinstance(other, numbers.Real):
                return self.value == other
            if isinstance(other, str):
                return self.name == other
        except AttributeError:
            pass
        return NotImplemented
