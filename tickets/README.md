# 🎫 Tickets System

This folder is used to organize all development tickets in the project.

## 📁 Folder Structure

```
tickets/
├── templates/          # Template files
│   ├── bug-template.md
│   ├── feature-template.md
│   ├── enhancement-template.md
│   └── task-template.md
├── active/            # Currently active tickets
├── completed/         # Completed tickets
└── README.md         # This file
```

## 🚀 How to Use

### 1. Creating New Ticket

```bash
# Copy template
cp tickets/templates/feature-template.md tickets/active/FEAT-001-user-authentication.md

# Edit the file
code tickets/active/FEAT-001-user-authentication.md
```

### 2. Working with Claude Code

```bash
# Start Claude Code in terminal
claude-code

# Reference the ticket file
"Please implement the feature described in tickets/active/FEAT-001-user-authentication.md"
```

### 3. Ticket Lifecycle

- **Active**: Currently being worked on
- **Completed**: Development done, being tested
- **Archived**: Completely finished and archived

## 📝 Template Guide

### 🐛 Bug Template

Use for bug reports. Production issues, unexpected behaviors.

### ✨ Feature Template

For new feature development. Includes user stories, UI/UX requirements.

### 🔄 Enhancement Template

For improving existing features. Performance, UX, code quality improvements.

### 📋 Task Template

For refactoring, documentation, general development tasks.

## 🏷️ Naming Convention

```
[TYPE-XXX] Descriptive Title

Types:
- BUG: Bug fixes
- FEAT: New features
- ENH: Enhancements
- TASK: General tasks
```

**Examples:**

- `BUG-001-login-validation-error.md`
- `FEAT-002-user-dashboard.md`
- `ENH-003-api-performance.md`
- `TASK-004-code-refactoring.md`

## ⚡ Quick Start

1. Choose appropriate template
2. Copy to `active/` folder
3. Update filename
4. Fill in content
5. Implement with Claude Code
6. Move to `completed/` when done

## 💡 Tips

- **Be detailed**: So Claude Code can understand better
- **Use acceptance criteria**: Set clear goals
- **Add technical notes**: Give implementation hints
- **Specify file paths**: Tell which files will be affected
- **Set priority**: Determine priority order

## 🔄 Example Workflow

```bash
# 1. Copy template
cp tickets/templates/bug-template.md tickets/active/BUG-001-navigation-issue.md

# 2. Edit ticket
code tickets/active/BUG-001-navigation-issue.md

# 3. Work with Claude Code
claude-code
> "Fix the bug described in tickets/active/BUG-001-navigation-issue.md"

# 4. Move when completed
mv tickets/active/BUG-001-navigation-issue.md tickets/completed/
```

This system will keep all your development processes organized! 🎉
