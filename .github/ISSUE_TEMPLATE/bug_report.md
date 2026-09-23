name: 🐛 Bug Report
description: Create a report to help us reproduce and fix an issue.
labels: ['bug', 'triage']
body:

- type: markdown
  attributes:
  value: |
  Thanks for taking the time to fill out this bug report! Please search existing issues before submitting to ensure it hasn't already been reported.

- type: textarea
  id: description
  attributes:
  label: Bug Description
  description: A clear and concise description of what the bug is.
  placeholder: Describe the problem...
  validations:
  required: true

- type: textarea
  id: reproduction
  attributes:
  label: Steps To Reproduce
  description: Steps to reproduce the behavior.
  placeholder: | 1. Open image editor with `ImageEditor.open(...)` 2. Tap on the crop tool 3. Observe crash on Android device
  validations:
  required: true

- type: textarea
  id: expected
  attributes:
  label: Expected Behavior
  description: A clear description of what you expected to happen.
  validations:
  required: true

- type: dropdown
  id: platform
  attributes:
  label: Affected Platform(s)
  multiple: true
  options: - iOS - Android - Both
  validations:
  required: true

- type: input
  id: environment
  attributes:
  label: Environment Info
  description: Please provide relevant environment versions.
  placeholder: "React Native: 0.78.2 | React: 19.0.0 | New Architecture: Enabled | OS: iOS 18 / Android 15"
  validations:
  required: true

- type: textarea
  id: logs
  attributes:
  label: Crash Logs or Screenshots
  description: Add relevant error stack traces, Xcode / Logcat output, or video clips demonstrating the issue.
  render: shell
