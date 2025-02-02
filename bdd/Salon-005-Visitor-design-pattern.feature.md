**As an AI engineer, I want Salon to be well structured, using the 'Visitor' design pattern so I can easily change the prompts and approaches for code and documentation generation, and I can add more sophisticated logic to speed up runtime performance.**

Feature: Directory Walker with Visitor Pattern
  As an AI engineer
  I want to recursively process directories using a visitor pattern
  So that I can flexibly analyze and generate documentation for source code

  Background:
    Given I have a configuration file specifying source file extensions
    And I have a list of directories to skip
    And I have a chain of directory visitors configured

  Scenario: Walking an empty directory structure
    Given I have an empty root directory
    When I run the directory walker
    Then no visitors should be called
    And the walker should complete successfully

  Scenario: Walking a directory with no source files
    Given I have a directory containing only non-source files
    When I run the directory walker
    Then the visitors should be notified of an empty source file list
    And the walker should continue to the next directory

  Scenario: Walking a directory with one source file
    Given I have a directory containing one ".py" source file
    When I run the directory walker
    Then the visitors should receive a list with one source file
    And each visitor should process the single file

  Scenario: Walking a directory with multiple source files
    Given I have a directory containing multiple source files
      | filename   | extension |
      | test1     | .py       |
      | test2     | .ts       |
      | test3     | .js       |
    When I run the directory walker
    Then the visitors should receive a list with all source files
    And each visitor should process all files in order

  Scenario: Skipping excluded directories
    Given I have a directory structure containing excluded directories
    When I run the directory walker
    Then the walker should skip the excluded directories
    And visitors should not receive any files from excluded directories

  Scenario: Processing a directory with no README
    Given I have a directory containing source files
    But the directory has no README.md file
    When I run the directory walker
    Then the visitors should be notified of missing README
    And visitors should process source files in documentation generation mode

  Scenario: Processing a directory with outdated README
    Given I have a directory containing source files
    And the directory has a README.md file
    And the README is older than some source files
    When I run the directory walker
    Then the visitors should be notified of outdated README
    And visitors should process files in README update mode

  Scenario: Processing a directory with current README
    Given I have a directory containing source files
    And the directory has a README.md file
    And the README is newer than all source files
    When I run the directory walker
    Then the visitors should be notified of current README
    And visitors should process files in validation mode

  Scenario: Handling errors during directory walk
    Given I have a directory structure with an inaccessible subdirectory
    When I run the directory walker
    Then the walker should log the access error
    And continue processing other directories
    And report the error in the final results

  Scenario: Generating C4 schematics from collected READMEs
    Given I have a SchematicGeneratorVisitor configured
    And I have a directory structure with multiple README.md files
    When I run the directory walker
    Then the visitor should accumulate all README.md files
    And when the walker signals completion
    Then the visitor should check for existing C4 schematic files
    And if the newest schematic is older than any README
    Then the visitor should generate new C4 diagrams
    But if the newest schematic is newer than all READMEs
    Then the visitor should skip diagram generation
