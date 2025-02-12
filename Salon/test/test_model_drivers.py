"""
Unit tests for the chat model driver factory and its concrete implementations.
Tests the creation of different model drivers and error handling for unknown types.
"""


from enum import Enum
import pytest
import google.generativeai as genai

from src.ChatModelDrivers import (
    SummariseModelType,
    SalonModelDriver,
    BraidApiModelDriver,
    LocalGeminiModelDriver
)

def test_create_braid_api_model_driver():
    """
    Test the creation of a Braid API model driver.
    """
    driver = SalonModelDriver.create(SummariseModelType.BRAID_API)
    assert isinstance(driver, BraidApiModelDriver)

def test_create_local_gemini_model_driver():
    """
    Test the creation of a local Gemini model driver.
    """
    driver = SalonModelDriver.create(SummariseModelType.LOCAL_GEMINI)
    assert isinstance(driver, LocalGeminiModelDriver)

def test_create_unknown_model_type():
    """
    Test the creation of an unknown model type.
    """
    class UnknownModelType(Enum):
        """
        Enum representing unknown model types.
        """
        UNKNOWN = "unknown"

    with pytest.raises(ValueError) as exc_info:
        SalonModelDriver.create(UnknownModelType.UNKNOWN)
    assert "Unknown model type" in str(exc_info.value)

def test_braid_api_model_driver_summarise():
    """
    Test that the Braid API model driver can summarize code and returns a reasonable length summary.
    """
    driver = BraidApiModelDriver()
    
    # Get the source code of this test module
    with open(__file__, 'r', encoding='utf-8') as f:
        source_code = f.read()
    
    summary = driver.summarise(source_code)
    assert summary is not None
    assert len(summary) >= 50, "Summary should be at least 50 characters long"

def test_local_gemini_model_driver_summarise():
    """
    Test that the Local Gemini model driver can summarize code and returns a reasonable length summary.
    """
    driver = LocalGeminiModelDriver()
    
    # Get the source code of this test module
    with open(__file__, 'r', encoding='utf-8') as f:
        source_code = f.read()
    
    summary = driver.summarise(source_code)
    assert summary is not None
    assert len(summary) >= 50, "Summary should be at least 50 characters long"

    def teardown_module(module):
        """
        Cleanup function that runs after all tests in this module.
        Shuts down the Google API client to clean up resources.
        """
        genai.close()
