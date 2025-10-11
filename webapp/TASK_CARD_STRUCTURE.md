# Task Card Visual Structure

## Complete Task Card Layout

```
╔════════════════════════════════════════════════════════════════════════════╗
║                         TASK CARD (Hover Effect)                          ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌────┐                                                                    ║
║  │ #1 │  Task Title (Bold, Large, Hover Color Change)                    ║
║  └────┘                                                                    ║
║                                                                            ║
║  Task description text providing details about what needs to be done.     ║
║  This section explains the full context of the task.                      ║
║                                                                            ║
║  ┌──────────┐  ┌──────────────┐  ┌──────────────┐                       ║
║  │ FRONTEND │  │ HIGH PRIORITY │  │ ⏱️  8h estimate │                      ║
║  └──────────┘  └──────────────┘  └──────────────┘                       ║
║    (Blue)         (Red)            (Gray)                                 ║
║                                                                            ║
║  ╔══════════════════════════════════════════════════════════════════╗    ║
║  ║ 📊 DEPENDENCIES (Amber Background)                               ║    ║
║  ╠══════════════════════════════════════════════════════════════════╣    ║
║  ║  ┌──────────┐  ┌──────────┐  ┌──────────┐                       ║    ║
║  ║  │  Task-2  │  │  Task-3  │  │  Task-4  │                       ║    ║
║  ║  └──────────┘  └──────────┘  └──────────┘                       ║    ║
║  ╚══════════════════════════════════════════════════════════════════╝    ║
║                                                                            ║
║  ╔══════════════════════════════════════════════════════════════════╗    ║
║  ║ ✅ ACCEPTANCE CRITERIA (Green Background)                        ║    ║
║  ╠══════════════════════════════════════════════════════════════════╣    ║
║  ║  ✓  Criteria 1: User can log in with email                       ║    ║
║  ║  ✓  Criteria 2: Session persists across page refreshes           ║    ║
║  ║  ✓  Criteria 3: Password validation with error messages          ║    ║
║  ║  ✓  Criteria 4: Logout functionality clears all session data     ║    ║
║  ╚══════════════════════════════════════════════════════════════════╝    ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

## Color Coding System

### Task Types
- 🔵 **Frontend** - Blue background/border
- 🟣 **Backend** - Purple background/border
- 🟢 **Database** - Green background/border
- 🟠 **Testing** - Orange background/border
- 🔴 **Deployment** - Red background/border
- 🔷 **DevOps** - Cyan background/border
- ⚪ **General** - Gray background/border

### Priority Levels
- 🔴 **High** - Red background with strong warning
- 🟡 **Medium** - Yellow/amber background
- 🟢 **Low** - Green background (calm)

### Special Sections
- 🟨 **Dependencies** - Amber background with border
- 🟩 **Acceptance Criteria** - Green background with checkmarks

## Field Breakdown

### Always Shown:
1. **Task Number** - Badge with gradient (#1, #2, etc.)
2. **Title** - Large, bold, prominent
3. **Description** - Full text explanation
4. **Type Badge** - Color-coded category
5. **Priority Badge** - Color-coded urgency

### Conditionally Shown:
6. **Estimated Hours** - Only if provided (shows clock icon)
7. **Dependencies** - Only if task has dependencies
8. **Acceptance Criteria** - Only if criteria defined (always shown from AI)

## Visual Features

### Hover Effects:
- Card shadow intensifies
- Border color changes to indigo
- Title color shifts to indigo
- Smooth transitions

### Typography:
- **Task Number**: Monospace font
- **Title**: Bold, 1.25rem
- **Description**: Regular, 15px, relaxed line height
- **Badges**: Uppercase, bold, small tracking

### Spacing:
- Generous padding (1.5rem)
- Section gaps (1.25rem)
- Tag spacing (0.5rem)
- List item spacing (0.625rem)

### Icons:
- ⏱️ Clock for time estimates
- 📊 Branch for dependencies
- ✅ Checkmark for acceptance criteria
- All icons from Lucide React

## Example Task Card

```typescript
Task {
  id: "task-001",
  title: "Implement User Authentication System",
  description: "Create a secure authentication system with JWT tokens, password hashing, and session management. Include email verification and password reset functionality.",
  type: "backend",
  priority: "high",
  estimatedHours: 12,
  dependencies: ["task-002", "task-003"],
  acceptance_criteria: [
    "Users can register with email and password",
    "Passwords are hashed using bcrypt",
    "JWT tokens are generated on successful login",
    "Email verification link is sent upon registration",
    "Password reset functionality is working",
    "Session expires after 24 hours"
  ]
}
```

### Renders As:

```
┌─────────────────────────────────────────────────────────────────┐
│  [#1]  Implement User Authentication System                     │
│                                                                  │
│  Create a secure authentication system with JWT tokens,         │
│  password hashing, and session management. Include email        │
│  verification and password reset functionality.                 │
│                                                                  │
│  [BACKEND]  [HIGH PRIORITY]  [⏱️ 12h estimate]                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ 📊 DEPENDENCIES                                      │       │
│  │ [task-002]  [task-003]                               │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ ✅ ACCEPTANCE CRITERIA                               │       │
│  │ ✓ Users can register with email and password         │       │
│  │ ✓ Passwords are hashed using bcrypt                  │       │
│  │ ✓ JWT tokens are generated on successful login       │       │
│  │ ✓ Email verification link is sent upon registration  │       │
│  │ ✓ Password reset functionality is working            │       │
│  │ ✓ Session expires after 24 hours                     │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Responsive Design

The cards are fully responsive:
- **Desktop**: Full width with comfortable padding
- **Tablet**: Stacked vertically with responsive text
- **Mobile**: Touch-friendly spacing, wrapped tags

## Accessibility

- Proper semantic HTML
- ARIA labels where needed
- Color is not the only indicator (icons + text)
- Keyboard navigation support
- Screen reader friendly structure
