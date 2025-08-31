---
description: Start working on a ticket from tickets/active/ folder with progress tracking
argument-hint: TICKET-ID (e.g., FEAT-001, BUG-002, ENH-003)
---

I want to start working on ticket **$ARGUMENTS**. Please follow this workflow:

## Step 1: Find and Load Ticket

- Search `tickets/active/` folder for any `.md` file containing "$ARGUMENTS" in the filename
- Read and fully understand the ticket requirements, acceptance criteria, and technical notes

## Step 2: Add Progress Section

Before starting implementation, add this progress tracking section to the END of the ticket file:

```markdown
---

## 🔄 Progress Tracking

**Status**: In Progress  
**Started**: [Current Date/Time]  
**Assigned**: Claude Code

### Implementation Steps

- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] Step 3: [Description]

### Progress Notes

- **[Timestamp]**: Started working on ticket
- **[Timestamp]**: [What was accomplished]

### Next Actions

- [ ] Action item 1
- [ ] Action item 2
```

## Step 3: Create Implementation Plan

Based on the ticket requirements:

- Break down work into concrete, actionable steps
- Update the "Implementation Steps" checklist in the ticket
- Ask for my approval before proceeding with implementation

## Step 4: Implement Step by Step

- Work on ONE step at a time
- Update progress in the ticket file after each step
- Ask for approval before moving to the next major step
- Keep detailed progress notes with timestamps

**Important**: Always update the ticket file with progress after each significant change. Wait for my approval before proceeding to implementation.
