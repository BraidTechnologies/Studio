** As an AI Engineer, I want Salon to be able to generate system summaries and diagrams for Braid client systems. **

Feature: Generate Documentation for Client Systems
  As an AI Engineer
  I want to generate comprehensive documentation for client repositories
  So that I can understand and explain their systems effectively

  Background:
    Given I have configured Salon for documentation generation
    And I have access to the client repositories
    And I have appropriate visitor patterns set up

  Scenario: Generate Documentation for Vodafone Repository
    Given I have access to a Vodafone repository
    And the repository contains source code files
    When I run Salon's documentation generator
    Then it should create a high-level system summary
    And generate component diagrams showing system architecture
    And create detailed README files for each major component
    And maintain consistent formatting across all documentation
    And preserve any existing documentation that is still current
    And include appropriate Vodafone branding elements
    And exclude any sensitive or proprietary information

  Scenario: Generate Documentation for BNY Repository
    Given I have access to a BNY repository
    And the repository contains source code files
    When I run Salon's documentation generator
    Then it should create a high-level system summary
    And generate component diagrams showing system architecture
    And create detailed README files for each major component
    And maintain consistent formatting across all documentation
    And preserve any existing documentation that is still current
    And include appropriate BNY branding elements
    And exclude any sensitive or proprietary information

  Scenario: Update Existing Documentation
    Given I have previously generated documentation for a client repository
    And there have been changes to the source code
    When I run Salon's documentation generator again
    Then it should identify changed components
    And update only the affected documentation
    And maintain version history of documentation changes
    And generate a change summary report


