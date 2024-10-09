'''Module to make a local file system path from an http: path '''
# Copyright (c) 2024 Braid Technologies Ltd

from urllib.parse import urlsplit


def make_local_file_path(url: str) -> str:
    '''
    Generates a fake file name based on the URL by replacing certain characters with underscores.
    '''
    split_url = urlsplit(url)
    # split_url.scheme   "http"
    # split_url.netloc   "127.0.0.1"
    # split_url.path     "/asdf/login.php"
    clean_path = str(split_url.netloc) + split_url.path + split_url.query

    fake_name = clean_path.replace("//", "_").replace("\\", "_").replace("/", "_").replace("=", "_").replace("&", "_").replace("%", "_")

    return fake_name[0:200]
