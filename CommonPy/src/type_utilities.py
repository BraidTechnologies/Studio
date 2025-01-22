"""
Utility to change a dictionary to an object - used in mapping from JSON back to object types after web requests
"""


class DictToObject:
    """
    Converts a dictionary into an object by setting attributes for each key-value pair.

    Attributes are dynamically created based on the dictionary's keys, allowing
    for easy access to the dictionary's data as object attributes.

    Parameters:
       dictionary (dict): The dictionary to be converted into an object.
    """

    def __init__(self, dictionary):
        if dictionary:
            for key, value in dictionary.items():
                setattr(self, key, value)


def safe_dict_to_object(val, default=None) -> object:
    """
    Safely converts a dictionary into an object by setting attributes for each key-value pair.

    Attributes are dynamically created based on the dictionary's keys, allowing
    for easy access to the dictionary's data as object attributes.

    Parameters:
       dictionary (dict): The dictionary to be converted into an object. If this is None, None is returned
    """

    obj = default

    try:
        if val:
            obj = DictToObject(val)
    except (ValueError, TypeError):
        return obj

    return obj


def safe_cast(val, to_type, default=None) -> object:
    """
    Safely casts a value to a specified type, returning a default value if casting fails.

    Parameters:
       val: The value to be cast.
       to_type: The type to which the value should be cast.
       default: The value to return if casting fails (default is None).

    Returns:
       The value cast to the specified type, or the default value if casting fails.
    """

    obj = default

    try:
        if val:
            return to_type(val)
    except (ValueError, TypeError):
        return obj
