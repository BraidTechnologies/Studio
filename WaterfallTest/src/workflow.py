# Copyright (c) 2024 Braid Technologies Ltd

class Freezable(object):
    __isfrozen = False
    def __setattr__(self, key, value):
        if self.__isfrozen and not hasattr(self, key):
            raise TypeError( "%r is frozen " % self )
        object.__setattr__(self, key, value)

    def _freeze(self):
        self.__isfrozen = True

class PipelineItem(Freezable):

   def __init__(self):
      '''
      Initializes the PipelineItem class with attributes path, summary, and embedding. Freeze the object to prevent adding spurious variables.
      '''
      self.path = None
      self.summary = None
      self.embedding = None  
      self.embedding_as_float = None

      self._freeze()   

def get_embeddings_as_float (items: list[PipelineItem]) -> list[list[float]]:
   embeddings_as_float : list [ list [float]] = []
   for item in items:
      embeddings_as_float.append(item.embedding_as_float) 
   return embeddings_as_float

class Theme(Freezable):

   def __init__(self):
      """Initialize the Theme object with default attributes and freeze the object. Freeze the object to prevent adding spurious variables."""
      self.short_description = None
      self.long_description = None
      self.example_pipeline_items = None  
      self.member_pipeline_items = None

      self._freeze()   

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