'''Classes shared across the entire workflow'''
# Copyright (c) 2024 Braid Technologies Ltd

import functools


class Freezable(object):
    '''Class that can be frozen to stop it being given new attributes'''
    _is_frozen = False

    def __setattr__(self, key, value):
        if self._is_frozen and not hasattr(self, key):
            raise TypeError(f'%r is frozen ' % self) # pylint: disable=f-string-without-interpolation
        object.__setattr__(self, key, value)

    def _freeze(self):
        self._is_frozen = True


@functools.total_ordering
class PipelineItem(Freezable):
    '''A work item that is passed along the processsing pipeline'''
    def __init__(self):
        '''
        Initializes the PipelineItem class with attributes path, summary, and embedding. Freeze the object to prevent adding spurious variables.
        '''
        self.path = None
        self.text = None
        self.chunk = 0
        self.summary = None
        self.embedding = None
        self.embedding_as_float = None
        self.cluster = None

        self._freeze()

    def _is_valid_operand(self, other):
        return (hasattr(other, 'path') and
                hasattr(other, 'long_description'))

    # https://stackoverflow.com/questions/5824382/enabling-comparison-for-classes
    def __eq__(self, other):
        if not self._is_valid_operand(other):
            return NotImplemented
        return ((self.path.lower(), self.summary.lower()) ==
                (other.path.lower(), other.summary.lower()))

    def __lt__(self, other):
        if not self._is_valid_operand(other):
            return NotImplemented
        return ((self.path.lower(), self.summary.lower()) <
                (other.path.lower(), other.summary.lower()))


def get_embeddings_as_float(items: list[PipelineItem]) -> list[list[float]]:
    embeddings_as_float: list[list[float]] = []
    for item in items:
        embeddings_as_float.append(item.embedding_as_float)
    return embeddings_as_float


@functools.total_ordering
class Theme(Freezable):
    '''A theme is a fully documented cluster of items '''

    def __init__(self):
        '''Initialize the Theme object with default attributes and freeze the object. Freeze the object to prevent adding spurious variables.'''
        self.short_description = None
        self.long_description = None
        self.example_pipeline_items = None
        self.member_pipeline_items = None

        self._freeze()

    def _is_valid_operand(self, other):
        return (hasattr(other, 'short_description') and
                hasattr(other, 'long_description'))

    # https://stackoverflow.com/questions/5824382/enabling-comparison-for-classes
    def __eq__(self, other):
        if not self._is_valid_operand(other):
            return NotImplemented
        return ((self.short_description.lower(), self.long_description.lower()) ==
                (other.short_description.lower(), other.long_description.lower()))

    def __lt__(self, other):
        if not self._is_valid_operand(other):
            return NotImplemented
        return ((self.short_description.lower(), self.long_description.lower()) <
                (other.short_description.lower(), other.long_description.lower()))


class PipelineSpec(Freezable):
    '''The spec for a full run of the Waterfall workflow'''

    def __init__(self):
        '''
        Initialize the Theme object with default attributes and freeze the object. Freeze the object to prevent adding spurious variables.
        '''
        self.pages = 1  # default is to pull back one page
        self.clusters = 2
        self.clusters_in_summary = 2
        self.search_key = None
        self.description = None
        self.mail_to = None
        self.themes = None
        self.output_chart_name = None
        self.output_data_name = None

        self._freeze()


class PipelineStep ():
    def __init__(self, output_location: str):
        '''
        Initialize the PipelineStep with the specified output location.

        Parameters:
        output_location (str): The location where the output will be stored.
        '''
        self.output_location = output_location
