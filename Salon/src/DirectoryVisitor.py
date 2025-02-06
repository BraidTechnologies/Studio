






from .DirectoryWalker import add_visitor

class DirectoryData:
    def __init__(self):
        self.has_readme = False
        self.source_files = []



class DirectoryVisitor:
    def __init__(self, path):
        self.path = path

    def visit(self, directory_data: DirectoryData):
        
        return



class DirectoryVisitorForNotebookLM (DirectoryVisitor):
    def __init__(self, path):
        super().__init__(path)

    def visit(self, directory_data: DirectoryData):
       # This class will concatenate files until it reachs the limit, then write the output to a text fiile specified by the options



class DirectoryVisitorForReadme (DirectoryVisitor):
    def __init__(self, path):
        super().__init__(path)

    def visit(self, directory_data: DirectoryData):
       # This class will looks at date smaples on files, if any source file is newer than the ReadMe.salon.md, it generates a new readme 



readme_visitor : DirectoryVisitorForReadme = DirectoryVisitorForReadme(".")

add_visitor(readme_visitor)
