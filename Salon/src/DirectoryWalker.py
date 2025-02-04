
visitor_list = []

from .DirectoryVisitor import DirectoryVisitor

class DirectoryOptions:
    def __init__(self):
        self.include_hidden = False
        self.recursive = True
        self.max_depth = None




def add_visitor(self, visitor: DirectoryVisitor):
   
     visitor_list.append(visitor)


class DirectorWalker:
    def __init__(self, path: str, options: DirectoryOptions):
        self.path = path



    def walk(self):
        

        # for each directory in the path
        #for directory in os.listdir(self.path):
        #    if not self.options.is_skip_dir ():
        #        get all file names abd date stamps
        #        for visitor in self.visitors:
        #            visitor.visit(directory, optio)
        #        continue


