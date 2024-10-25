# Interactive Storytelling Platform User Stories

## Sprint 1: Core Storytelling Functionality

```gherkin
Feature: Interactive Storytelling

  Scenario: Starting a New Story when no stories exist
    Given I am on the home page
    And there are no existing stories
    When I click on "Start New Story"
    Then I should be redirected to the story creation page

  Scenario: Starting a New Story when one story exists
    Given I am on the home page
    And there is one existing story
    When I click on "Start New Story"
    Then I should see the first segment of the existing story
    And I should see multiple choice options

  Scenario: Viewing Story List when multiple stories exist
    Given I am on the home page
    And there are multiple existing stories
    When I click on "Start New Story"
    Then I should see a list of available stories

  Scenario: Selecting a Story from the List
    Given I am on the story list page
    When I click on a story title
    Then I should see the first segment of the selected story
    And I should see multiple choice options

  Scenario: Making a Choice in the Story
    Given I am reading a story segment
    When I select a choice
    Then I should see the next story segment based on my choice
    And I should see new choice options

Feature: Story Creation

  Scenario: Creating a New Story Segment
    Given I am logged in as a story creator
    And I am on the story creation page
    When I enter the text for a new story segment
    And I add choices for the segment
    And I click "Save Segment"
    Then the new segment should be added to the story structure
    And I should see it in the story overview

  Scenario: Linking Story Segments
    Given I am logged in as a story creator
    And I have created multiple story segments
    When I select a choice from one segment
    And I link it to another segment
    Then the segments should be connected in the story structure
    And I should see the connection in the story overview

Feature: Story Visualization

  Scenario: Viewing Story Structure
    Given I am logged in as a story creator
    When I select "View Story Structure"
    Then I should see a visual representation of my story
    And I should see connections between segments and choices

Feature: Create and Edit Story Segments

  Background:
    Given I am on the "Create New Story Segment" page

  Scenario: Create a new segment with choices without next segments
    When I enter "First segment" in the "Segment Text" field
    And I enter "Choice 1" in the first "Choice" field
    And I enter "Choice 2" in the second "Choice" field
    And I click the "SAVE SEGMENT" button
    Then I should see a success message "Segment saved successfully"
    And the segment should appear in the "Created Segments" list

  Scenario: Save a segment with empty "Next Segment" fields
    When I enter "Second segment" in the "Segment Text" field
    And I enter "Option A" in the first "Choice" field
    And I leave the first "Next Segment" field empty
    And I enter "Option B" in the second "Choice" field
    And I leave the second "Next Segment" field empty
    And I click the "SAVE SEGMENT" button
    Then I should see a success message "Segment saved successfully"
    And the segment should appear in the "Created Segments" list

  Scenario: Edit an existing segment to add a "Next Segment"
    Given I have created a segment "Third segment" with choices "Yes" and "No" without next segments
    When I click on "Edit" for "Third segment" in the "Created Segments" list
    And I select "First segment" as the "Next Segment" for the "Yes" choice
    And I click the "SAVE SEGMENT" button
    Then I should see a success message "Segment updated successfully"
    And the "Yes" choice should have "First segment" as its "Next Segment"
    And the "No" choice should still have an empty "Next Segment"

  Scenario: Add a new choice to an existing segment
    Given I have created a segment "Fourth segment" with one choice "Continue"
    When I click on "Edit" for "Fourth segment" in the "Created Segments" list
    And I click the "ADD CHOICE" button
    And I enter "Go back" in the new "Choice" field
    And I click the "SAVE SEGMENT" button
    Then I should see a success message "Segment updated successfully"
    And the segment should now have two choices: "Continue" and "Go back"

  Scenario: Remove a choice from an existing segment
    Given I have created a segment "Fifth segment" with choices "Left" and "Right"
    When I click on "Edit" for "Fifth segment" in the "Created Segments" list
    And I click the "Remove" button next to the "Right" choice
    And I click the "SAVE SEGMENT" button
    Then I should see a success message "Segment updated successfully"
    And the segment should now have only one choice: "Left"

  Scenario: Attempt to save a segment without any choices
    When I enter "Empty segment" in the "Segment Text" field
    And I don't enter any choices
    And I click the "SAVE SEGMENT" button
    Then I should see an error message "At least one choice is required"
    And the segment should not be saved

  Scenario: Navigate between segments in the story
    Given I have created multiple segments with next segments defined
    When I view the "Story Overview" page
    Then I should see a visual representation of how segments are connected
    And I should be able to click on any segment to edit it
