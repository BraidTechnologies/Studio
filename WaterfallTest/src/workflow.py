# Copyright (c) 2024 Braid Technologies Ltd

import functools

class Freezable(object):
    __isfrozen = False
    def __setattr__(self, key, value):
        if self.__isfrozen and not hasattr(self, key):
            raise TypeError( "%r is frozen " % self )
        object.__setattr__(self, key, value)

    def _freeze(self):
        self.__isfrozen = True

@functools.total_ordering
class PipelineItem(Freezable):

   def __init__(self):
      '''
      Initializes the PipelineItem class with attributes path, summary, and embedding. Freeze the object to prevent adding spurious variables.
      '''
      self.path = None
      self.text = None
      self.summary = None
      self.embedding = None  
      self.embedding_as_float = None
      self.cluster = None

      self._freeze()   

   def _is_valid_operand(self, other):
        return (hasattr(other, "path") and
                hasattr(other, "long_description"))

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
   
def get_embeddings_as_float (items: list[PipelineItem]) -> list[list[float]]:
   embeddings_as_float : list [ list [float]] = []
   for item in items:
      embeddings_as_float.append(item.embedding_as_float) 
   return embeddings_as_float


@functools.total_ordering
class Theme(Freezable):

   def __init__(self):
      """Initialize the Theme object with default attributes and freeze the object. Freeze the object to prevent adding spurious variables."""
      self.short_description = None
      self.long_description = None
      self.example_pipeline_items = None  
      self.member_pipeline_items = None

      self._freeze()   

   def _is_valid_operand(self, other):
        return (hasattr(other, "short_description") and
                hasattr(other, "long_description"))

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

   def __init__(self):
      '''
      """Initialize the Theme object with default attributes and freeze the object. Freeze the object to prevent adding spurious variables."""
      '''
      self.pages = 1 #default is to pull back one page
      self.clusters = 2
      self.search_key = None
      self.description = None
      self.themes = None  
      self.output_chart_name = None

      self._freeze()      


class PipelineStep ():
   def __init__(self, output_location: str):
      """
      Initialize the PipelineStep with the specified output location.

      Parameters:
      output_location (str): The location where the output will be stored.
      """
      self.output_location = output_location 