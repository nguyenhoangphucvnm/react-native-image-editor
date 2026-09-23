name: 💡 Feature Request
description: Suggest an idea or enhancement for this library.
labels: ['enhancement']
body:

- type: markdown
  attributes:
  value: |
  Thank you for helping improve `@phucprime/react-native-image-editor`!

- type: textarea
  id: problem
  attributes:
  label: Is your feature request related to a problem?
  description: A clear description of what the problem is (e.g., "I'm frustrated when...").
  validations:
  required: true

- type: textarea
  id: solution
  attributes:
  label: Proposed Solution
  description: Describe the solution or feature API you would like to see added.
  placeholder: |
  Add a new option to `ImageEditor.open({ aspectRatio: '16:9' })` to lock cropping ratios.
  validations:
  required: true

- type: textarea
  id: alternatives
  attributes:
  label: Alternative Solutions
  description: Describe any alternative solutions or features you've considered.

- type: textarea
  id: additional-context
  attributes:
  label: Additional Context
  description: Add any other context, screenshots, or design mocks about the feature request here.
