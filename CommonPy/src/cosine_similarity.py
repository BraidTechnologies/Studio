'''
Utility function

This module provides a functions vector similarity calculations.

Functions:
    cosine_similarity: Calculates cosine similarity between two vectors
'''

def cosine_similarity(vector1: list[float], vector2: list[float]) -> float:
    '''
    Calculate the cosine similarity between two vectors.

    Parameters:
        vector1: First vector as list of floats
        vector2: Second vector as list of floats

    Returns:
        float: Cosine similarity between the vectors
    '''
    # Check if vectors have same length
    if len(vector1) != len(vector2):
        raise ValueError("Vectors must have the same length")

    # Calculate dot product
    dot_product = sum(a * b for a, b in zip(vector1, vector2))

    # Calculate magnitudes
    magnitude1 = sum(a * a for a in vector1) ** 0.5
    magnitude2 = sum(b * b for b in vector2) ** 0.5

    # Handle zero magnitude edge case
    if magnitude1 == 0 or magnitude2 == 0:
        return 0

    # Return cosine similarity
    return dot_product / (magnitude1 * magnitude2)