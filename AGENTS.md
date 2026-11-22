# Real-Time Operational Visibility & Transparency Guidelines

## Continuous Progress Reporting
- **Visible Action Updates**: Do not perform prolonged silent tool-execution sequences. Before or alongside executing commands, file operations, or complex multi-step tasks, provide clear, concise visible updates in the conversation explaining:
  - Exactly what action is being undertaken (e.g., inspecting a specific component, reading a configuration file, running a verification build).
  - Why the action is being performed and what is expected.
  - Immediate findings, progress milestones, or next operational steps.
- **Prevent Long Silent Collapses**: Avoid letting the UI sit in long collapsed states (e.g., "Thinking...", "Editing files...") without human-readable progress updates in the chat stream.
- **Informative Summaries**: When inspecting, modifying, or creating files, briefly state which files are being touched and what changes or analyses are occurring.
