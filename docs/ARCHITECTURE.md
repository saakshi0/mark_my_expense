# Mark My Expense - Architecture Guide

This document provides a comprehensive overview of the application's architecture, database schema, component structure, and data flow.

## Table of Contents

1. [Application Overview](#application-overview)
2. [Database Schema](#database-schema)
3. [Component Architecture](#component-architecture)
4. [Screen Workflows](#screen-workflows)
5. [Data Flow](#data-flow)
6. [Services](#services)

---

## Application Overview

Mark My Expense is a React Native application built with Expo that follows a layered architecture:

```mermaid
graph TD
    subgraph UI Layer
        A[Screens] --> B[Components]
        B --> C[ThemeContext]
    end
    
    subgraph Business Layer
        D[Repositories] --> E[Services]
    end
    
    subgraph Data Layer
        F[(SQLite Database)]
    end
    
    A --> D
    D --> F
    E --> D
```

### Architecture Layers

| Layer | Purpose | Location |
|-------|---------|----------|
| **UI Layer** | React components, screens, navigation | `src/screens/`, `src/components/` |
| **Business Layer** | Data repositories, notification services | `src/database/repositories/`, `src/services/` |
| **Data Layer** | SQLite database operations | `src/database/` |

---

## Database Schema

The application uses SQLite with two main tables:

### Entity Relationship Diagram

```mermaid
erDiagram
    ACCOUNTS ||--o{ EXPENSES : "has many"
    
    ACCOUNTS {
        INTEGER id PK "Auto-increment"
        TEXT name "Account name"
        TEXT type "bank | card"
        TEXT icon "Optional icon path"
        DATETIME created_at "Auto timestamp"
    }
    
    EXPENSES {
        INTEGER id PK "Auto-increment"
        INTEGER account_id FK "References accounts.id"
        REAL amount "Expense amount"
        TEXT category "Category ID"
        TEXT description "Optional notes"
        DATE date "Expense date"
        DATETIME created_at "Auto timestamp"
    }
```

### Table: `accounts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `name` | TEXT | NOT NULL | Account display name |
| `type` | TEXT | CHECK('bank', 'card') | Account type |
| `icon` | TEXT | DEFAULT NULL | Custom icon path |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Table: `expenses`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `account_id` | INTEGER | NOT NULL, FOREIGN KEY | Reference to accounts |
| `amount` | REAL | NOT NULL | Expense amount |
| `category` | TEXT | NOT NULL | Category identifier |
| `description` | TEXT | - | Optional description |
| `date` | DATE | NOT NULL | Date of expense |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Indexes

```sql
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_account ON expenses(account_id);
CREATE INDEX idx_expenses_category ON expenses(category);
```

---

## Component Architecture

### Component Hierarchy

```mermaid
graph TD
    App[App.tsx] --> ThemeProvider
    ThemeProvider --> AppContent
    AppContent --> NavigationContainer
    NavigationContainer --> AppNavigator
    
    AppNavigator --> Dashboard[DashboardScreen]
    AppNavigator --> Expenses[ExpensesScreen]
    AppNavigator --> Accounts[AccountsScreen]
    AppNavigator --> Settings[SettingsScreen]
    
    Dashboard --> ExpensePieChart[ExpensePieChart<br/>Horizontal Bar Chart]
    Dashboard --> ExpenseListItem
    Dashboard --> AddExpenseModal
    
    Expenses --> DateRangePicker
    Expenses --> AccountPicker
    Expenses --> CategoryFilter
    Expenses --> SpendingGraph
    Expenses --> ExpensePieChart
    Expenses --> ExpenseListItem
    
    Accounts --> AccountCard
    Accounts --> AddAccountModal
    Accounts --> EditAccountModal
    
    Settings --> NotificationToggles
    Settings --> EraseDataModal
```

### Component Details

| Component | Location | Purpose |
|-----------|----------|---------|
| `ExpensePieChart` | `components/ExpensePieChart.tsx` | Horizontal bar chart showing category breakdown |
| `SpendingGraph` | `components/SpendingGraph.tsx` | Line chart for 6-month spending trends |
| `CategoryFilter` | `components/CategoryFilter.tsx` | Dropdown picker for category filtering |
| `CategoryPicker` | `components/CategoryPicker.tsx` | Category selection in expense forms |
| `AccountPicker` | `components/AccountPicker.tsx` | Account selection dropdown |
| `DateRangePicker` | `components/DateRangePicker.tsx` | Date range selection with presets |
| `AddExpenseModal` | `components/AddExpenseModal.tsx` | Form for adding/editing expenses |
| `ExpenseListItem` | `components/ExpenseListItem.tsx` | Individual expense row display |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Dark/Light mode toggle button |
| `AccountCard` | `components/AccountCard.tsx` | Account display card |

---

## Screen Workflows

### Dashboard Screen Flow

```mermaid
flowchart TD
    A[Open Dashboard] --> B[Load Data]
    B --> C{Data Loaded?}
    C -->|Yes| D[Display Charts]
    C -->|No| E[Show Loading]
    E --> B
    
    D --> F[Weekly Chart]
    D --> G[Monthly Chart]
    D --> H[Recent Expenses]
    
    I[Tap FAB Button] --> J[Open Add Modal]
    J --> K[Fill Form]
    K --> L[Submit]
    L --> M[Save to DB]
    M --> B
    
    N[Tap Expense] --> O[Open Edit Modal]
    O --> P[Edit/Delete]
    P --> M
```

### Expenses Screen Flow

```mermaid
flowchart TD
    A[Open Expenses] --> B[Load Default Data<br/>Last 7 Days]
    
    B --> C[Display Filters]
    C --> D[Date Range Picker]
    C --> E[Account Picker]
    C --> F[Apply Button]
    
    F --> G[Fetch Filtered Data]
    G --> H[Update Charts]
    G --> I[Update Expense List]
    
    H --> J[Spending Graph]
    H --> K[Category Bar Chart]
    
    I --> L[Category Filter Dropdown]
    L --> M[Filter Locally]
    M --> N[Display Filtered List]
    
    O[Tap Expense] --> P[Open Edit Modal]
    P --> Q[Edit/Delete]
    Q --> G
```

### Settings Screen Flow

```mermaid
flowchart TD
    A[Open Settings] --> B[Load Notification Status]
    
    B --> C[Display Settings]
    C --> D[Notification Toggles]
    C --> E[Test Buttons]
    C --> F[Danger Zone]
    
    D --> G{Toggle Daily?}
    G -->|On| H[Schedule Daily 9PM]
    G -->|Off| I[Cancel Daily]
    
    D --> J{Toggle Weekly?}
    J -->|On| K[Schedule Sunday 9PM]
    J -->|Off| L[Cancel Weekly]
    
    F --> M[Tap Erase]
    M --> N[Show Confirmation Modal]
    N --> O{Type DELETE?}
    O -->|Yes| P[Clear All Data]
    O -->|No| Q[Stay Disabled]
```

---

## Data Flow

### Expense Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Screen
    participant M as Modal
    participant R as Repository
    participant DB as SQLite
    
    U->>S: Tap Add Button
    S->>M: Open AddExpenseModal
    U->>M: Fill form & submit
    M->>R: expenseRepository.create()
    R->>DB: INSERT INTO expenses
    DB-->>R: Return lastInsertRowId
    R-->>M: Success
    M->>S: Close & refresh
    S->>R: loadData()
    R->>DB: SELECT queries
    DB-->>R: Return data
    R-->>S: Update state
    S->>U: Display updated UI
```

### Data Repository Pattern

```mermaid
classDiagram
    class expenseRepository {
        +getAll() ExpenseWithAccount[]
        +getByDateRange(start, end, accountId?) ExpenseWithAccount[]
        +getById(id) ExpenseWithAccount
        +create(accountId, amount, category, date, description?) number
        +update(id, accountId, amount, category, date, description?) void
        +delete(id) void
        +getCategorySummary(start, end, accountId?) CategorySummary[]
        +getTotalSpend(start, end, accountId?) number
        +getMonthlyTrend(start, end, accountId?) MonthlyData[]
        +getRecent(limit) ExpenseWithAccount[]
        +bulkCreate(expenses) number
    }
    
    class accountRepository {
        +getAll() Account[]
        +getById(id) Account
        +getByName(name) Account
        +create(name, type, icon?) number
        +update(id, name, type, icon?) void
        +delete(id) void
    }
```

---

## Services

### Notification Service

The notification service handles scheduled push notifications:

```mermaid
flowchart LR
    A[App Start] --> B[Request Permissions]
    B --> C{Granted?}
    C -->|Yes| D[Schedule Notifications]
    C -->|No| E[Skip]
    
    D --> F[Daily Reminder<br/>9 PM Every Day]
    D --> G[Weekly Summary<br/>Sunday 9 PM]
    
    F --> H[Trigger]
    H --> I[Show Notification]
    
    G --> J[Trigger]
    J --> K[Fetch Weekly Data]
    K --> L[Show Summary]
```

### Notification Service API

| Method | Description |
|--------|-------------|
| `requestPermissions()` | Request notification permissions |
| `scheduleDailyReminder()` | Schedule daily 9 PM reminder |
| `scheduleWeeklySummary()` | Schedule Sunday 9 PM summary |
| `scheduleAllNotifications()` | Schedule both notifications |
| `cancelNotification(id)` | Cancel specific notification |
| `cancelAllNotifications()` | Cancel all scheduled notifications |
| `sendTestNotification()` | Send immediate test notification |
| `sendWeeklySummaryWithData()` | Send summary with actual spending data |

---

## Categories

The app includes 20 predefined expense categories:

| ID | Name | Icon | Color |
|----|------|------|-------|
| `food` | Food & Dining | 🍽️ restaurant | #22C55E |
| `rent` | Rent | 🏠 home | #14B8A6 |
| `family` | Family | 👨‍👩‍👧 people | #F97316 |
| `emi` | EMI & Loans | 💳 card | #EF4444 |
| `transport` | Travel | ✈️ airplane | #06B6D4 |
| `shopping` | Shopping | 🛍️ bag-handle | #8B5CF6 |
| `entertainment` | Entertainment | 🎮 game-controller | #EC4899 |
| `bills` | Bills & Utilities | ⚡ flash | #F59E0B |
| `health` | Health & Fitness | 💪 fitness | #10B981 |
| `education` | Education | 🎓 school | #3B82F6 |
| `personal` | Personal Care | 🧍 body | #A855F7 |
| `groceries` | Groceries | 🧺 basket | #84CC16 |
| `gadgets` | Gadgets | 📱 phone-portrait | #6366F1 |
| `trip` | Trip | 🗺️ map | #0EA5E9 |
| `investment` | Investment | 📈 trending-up | #059669 |
| `leisure` | Leisure | ☕ cafe | #D946EF |
| `office` | Office | 💼 briefcase | #78716C |
| `fuel` | Fuel | ⛽ speedometer | #EA580C |
| `kids` | Kids | 😊 happy | #FB7185 |
| `others` | Others | ⋯ ellipsis-horizontal | #64748B |

---

## Theme System

The app uses a context-based theming system:

```typescript
interface ThemeColors {
  primary: string;      // Main accent color
  background: string;   // Screen background
  surface: string;      // Card backgrounds
  surfaceVariant: string;
  text: string;         // Primary text
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  tabBarInactive: string;
}
```

### Usage

```typescript
const { colors, isDark, toggleTheme } = useTheme();

// Apply colors
<View style={{ backgroundColor: colors.surface }}>
  <Text style={{ color: colors.text }}>Hello</Text>
</View>
```

---

## File Structure Summary

```
src/
├── components/          # 10 reusable UI components
├── constants/           # Categories, theme colors
├── context/             # ThemeContext provider
├── database/
│   ├── database.ts      # DB connection & utilities
│   ├── schema.ts        # Table definitions
│   └── repositories/    # Data access layer
│       ├── accountRepository.ts
│       └── expenseRepository.ts
├── navigation/          # Tab navigator setup
├── screens/             # 4 main screens
│   ├── DashboardScreen.tsx
│   ├── ExpensesScreen.tsx
│   ├── AccountsScreen.tsx
│   └── SettingsScreen.tsx
├── services/
│   └── notificationService.ts
├── types/               # TypeScript interfaces
└── utils/               # Helper functions
    ├── bankIcons.ts
    ├── csvUtils.ts
    └── dateUtils.ts
```
