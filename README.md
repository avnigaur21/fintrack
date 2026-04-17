<<<<<<< HEAD
# FinTrack — Finance Dashboard

A clean, interactive finance dashboard, FinTrack helps users track financial activity, understand spending patterns, and manage savings goals, with role-based access control and a polished dark-mode UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State Management | Redux Toolkit + React Context (RoleContext) |
| Form Handling | React Hook Form |
| UI Components | Radix UI + shadcn/ui |
| Date Utilities | date-fns |
| Animations | CSS keyframes + Tailwind transitions |

---

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fintrack-main

# Install dependencies
pnpm install
# or
npm install
```

### Running the App

```bash
# Development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
fintrack-main/
├── app/                        # Next.js App Router pages
│   ├── dashboard/              # Dashboard overview page
│   ├── expenses/               # Expense tracking page
│   ├── goals/                  # Financial goals page
│   ├── habits/                 # Financial habits analysis page
│   ├── profile/                # User profile page
│   ├── layout.tsx              # Root layout with providers
│   └── globals.css             # Global styles
├── components/                 # Reusable components
│   ├── ui/                     # Base UI primitives (Radix/shadcn)
│   ├── app-layout.tsx          # Navbar + page wrapper
│   ├── dashboard-page.tsx      # Dashboard with charts + summary cards
│   ├── expenses-page.tsx       # Expense tracking + transactions
│   ├── goals-list.tsx          # Goals with progress bars
│   ├── habits-page.tsx         # Financial habits analysis
│   ├── financial-habit-score.tsx
│   ├── balance-trend-chart.tsx
│   ├── expense-chart.tsx
│   ├── category-distribution-chart.tsx
│   ├── recent-expenses.tsx
│   ├── role-context.tsx        # RBAC context provider
│   ├── theme-provider.tsx      # Dark/light mode provider
│   └── notification-manager.tsx
├── hooks/
│   ├── use-count-up.ts         # Animated number counter hook
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
└── styles/
    └── components.json
```

---

## Features

### Dashboard Overview
- **4 Summary Cards** — Total Savings, Monthly Expenses, Active Goals, Habit Score — each with animated count-up numbers on load
- **Financial Analytics** section with 3 switchable chart views:
  - Spending Overview — monthly bar chart
  - Balance Trend — line chart showing net balance over 7 months
  - Income vs Expenses — grouped bar chart comparing income and expenses side by side, with total summary row
- **Goal Progress** panel — top 3 goals with live progress bars
- **Financial Habits** mini panel — habit score, top 2 category scores, and link to full analysis

### Transactions Section (Expenses Page)
- Full transactions table with columns: Description, Date, Category, Type, Amount
- **Search** — live filter by description or category name
- **Filter** — dropdown filters for Category and Type (Income / Expense)
- **Sort** — click Date or Amount column headers to toggle ascending/descending sort
- Income rows shown in green with `+` prefix; expense rows in default color with `-` prefix
- **Empty state** — shown when filters return no results, with a "Clear filters" button
- Admin role sees Edit and Delete buttons per row
- Analyst role sees Export CSV button

### Financial Goals
- Goals displayed with progress bars, current/target amounts, and deadlines
- **Admin only:** New Goal button, Add Savings button per goal, Delete goal button
- Goals that reach 100% show a "Completed ✅" badge instead of the progress bar
- Progress bars animate from 0 to target on page load

### Financial Habits Analysis
- Overall habit score (74/100) with animated progress bar and donut chart
- **Category Breakdown** — individual scores for Food, Housing, Transportation, Entertainment, Shopping, Utilities with trend arrows
- **Detailed Analysis** section:
  - Spending Efficiency card — per-category progress bars with color-coded scores and change vs last month indicators
  - Improvement Tips card — expandable tips with priority badges (Action Needed / Keep It Up / Suggestion)
- AI Analysis summary paragraph
- Month-over-month score comparison (Last month: 62/100 → This month: 74/100)

### Role-Based UI (RBAC)
See full details in the RBAC section below.

### Additional Features
- **Dark / Light mode** toggle in navbar
- **Expense Reminders** toggle on dashboard
- **Categories tab** — horizontal bar chart showing spending breakdown by category with summary cards
- **Page transition animations** — fade-in + slide-up on navigation
- **Card hover effects** — subtle lift on dashboard cards
- **Staggered row animations** — transaction rows fade in sequentially on load
- **Modal animations** — scale-in on open for Add/Edit modals

---

## Role-Based UI (RBAC)

Roles are simulated entirely on the frontend using React Context. No backend or authentication is involved.

### Switching Roles
A role switcher dropdown is located in the top-right navbar, next to the theme toggle. It shows the current role with a colored indicator dot.

### Role Permissions

| Feature | Viewer | Admin | Analyst |
|---|---|---|---|
| View all data | ✅ | ✅ | ✅ |
| Add Expense | ❌ | ✅ | ❌ |
| Edit Transaction | ❌ | ✅ | ❌ |
| Delete Transaction | ❌ | ✅ | ❌ |
| Add Goal | ❌ | ✅ | ❌ |
| Add Savings to Goal | ❌ | ✅ | ❌ |
| Delete Goal | ❌ | ✅ | ❌ |
| Export CSV | ❌ | ❌ | ✅ |
| Mode banner | 👁 Viewer mode — read only | None | 📊 Analyst mode — export enabled |

### Default Role
The app opens in **Viewer mode** by default so the RBAC behavior is immediately visible to anyone evaluating the project.

### Implementation
- `role-context.tsx` — creates `RoleContext` with `role` and `setRole`
- `RoleProvider` wraps the entire app in `layout.tsx`
- Any component uses `useRole()` hook to read current role and conditionally render elements

---

## State Management

The app uses two complementary state approaches:

### Redux Toolkit (Global App State)
Manages data that needs to persist across pages and be shared between multiple components:
- Transactions array (add, edit, delete)
- Goals array (add, update savings, delete)
- Active filters (search query, category filter, type filter)
- Selected sort key and direction

Filters are stored in Redux so they persist when navigating between tabs and back — the user does not lose their filter state.

### React Context (UI State)
- `RoleContext` — current role (Viewer / Admin / Analyst)
- `ThemeProvider` — dark/light mode preference

### Local Component State
Used only for ephemeral UI state like modal open/closed, tab selection, and form inputs.

---

## Assumptions

- All data is mock/static — no real backend or API integration
- Currency is Indian Rupees (₹) throughout
- "This Month" refers to March 2024 based on the mock transaction data
- Financial habit scores and improvement tips are hardcoded to simulate an AI-generated analysis
- The "Export CSV" feature generates a download from the current in-memory transactions array
- Dark mode is the default theme as it fits the fintech aesthetic better
- The app is optimized for desktop (1280px+) but is responsive down to tablet width

---

## Screenshots

| Page | Description |
|---|---|
| Dashboard | Summary cards, Financial Analytics (3 chart views), Goal Progress |
| Expenses → Overview | Monthly spending bar chart |
| Expenses → Transactions | Full table with search, filter, sort |
| Expenses → Categories | Horizontal bar chart by category |
| Goals | Progress bars, Add/Edit/Delete (Admin) |
| Financial Habits | Habit scores, Detailed Analysis, Improvement Tips |

---

## Features

- **Income and Expense Tracking**: Record and categorize your income and expenses to monitor your financial health.
- **Data Visualization**: Gain insights into your spending habits through intuitive charts and graphs.
- **Budget Management**: Set budgets for different categories and track your adherence over time.
- **Responsive Design**: Access your financial data seamlessly across devices with a responsive interface.

## Technologies Used

- **Frontend**: Developed using [Next.js](https://nextjs.org/), a React-based framework for server-rendered applications.
- **Styling**: Styled with [Tailwind CSS](https://tailwindcss.com/) for a modern and responsive design.
- **State Management**: Utilizes React hooks for efficient state management.

## Getting Started

To set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/OmSatpute/fintrack.git
>>>>>>> d167bed0 (Remove node_modules, add gitignore)
