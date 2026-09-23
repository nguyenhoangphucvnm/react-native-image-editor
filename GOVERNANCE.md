# Project Governance

This document outlines the governance model for **`@phucprime/react-native-image-editor`**.

---

## 🏛️ Governance Model

This project uses a **Benevolent Dictator / Lead Maintainer** governance model:

- **Lead Maintainer**: [@phucprime](https://github.com/phucprime)
  - Retains final decision-making authority over architecture, releases, dependency management, and API design.
  - Oversees npm package releases and GitHub administrative permissions.

---

## 👥 Community Roles

### 1. Contributors

Anyone who interacts with the project by submitting PRs, reporting issues, improving documentation, or answering community questions.

### 2. Core Maintainers

Trusted community members who have demonstrated long-term commitment and deep technical understanding of the codebase. Core Maintainers are granted:

- Triage & Label permissions on GitHub.
- Ability to review and approve Pull Requests.

---

## 🎯 Decision-Making Process

1. **Minor Changes & Bug Fixes**: Can be reviewed, approved, and merged by any Maintainer.
2. **Major Architectural Changes & Breaking API Changes**: Must be proposed as a GitHub Discussion or RFC issue first and require approval from the Lead Maintainer.
3. **Release Schedule**: Version bumps follow [Semantic Versioning (SemVer)](https://semver.org/):
   - `MAJOR`: Breaking API or native build changes.
   - `MINOR`: Backward-compatible new features.
   - `PATCH`: Backward-compatible bug fixes and documentation updates.
