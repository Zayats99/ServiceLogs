# MediDrive Service Logs

A React application for managing service logs with draft autosave functionality, built with Redux Toolkit, TypeScript, and Material-UI.

## 🚀 Features

- **Service Log Creation Form**
  - Create and manage multiple drafts
  - Auto-save drafts as you type (debounced)
  - Form validation with React Hook Form + Yup
  - Automatic end date calculation (start date + 1 day)
  - Draft status indicators (saving/saved)

- **Service Logs Management**
  - Display logs in a searchable table
  - Filter by service type (planned/unplanned/emergency)
  - Filter by date range
  - Edit existing logs via dialog
  - Delete logs

- **Data Persistence**
  - All drafts and logs persist after page reload using Redux Persist
  - LocalStorage-based persistence

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React Hook Form** - Form handling
- **Yup** - Schema validation
- **Material-UI (MUI)** - UI components
- **Day.js** - Date manipulation
- **Vite** - Build tool
- **UUID** - Unique ID generation

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "New project"
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or the port shown in terminal).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── app/
│   ├── hooks.ts          # Typed Redux hooks
│   └── store.ts          # Redux store configuration
├── features/
│   ├── drafts/
│   │   ├── components/
│   │   │   └── DraftsPanel.tsx
│   │   └── draftsSlice.ts
│   └── serviceLogs/
│       ├── components/
│       │   ├── EditServiceLogDialog.tsx
│       │   ├── ServiceLogFormCard.tsx
│       │   ├── ServiceLogsTable.tsx
│       │   └── renderTypeChip.tsx
│       ├── serviceLogValidation.ts
│       └── serviceLogsSlice.ts
├── types/
│   └── serviceLog.ts     # TypeScript type definitions
├── utils/
│   └── date.ts           # Date utility functions
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

## 📝 Form Fields

- **Provider ID** (required) - Provider identifier
- **Service Order** (required) - Service order number
- **Car ID** (required) - Car identifier
- **Odometer (mi)** (required, number ≥ 0) - Mileage in miles
- **Engine Hours** (required, number ≥ 0) - Engine hours
- **Start Date** (required) - Service start date (defaults to today)
- **End Date** (required, auto-calculated) - Service end date (defaults to tomorrow)
- **Service Type** (required) - One of: `planned`, `unplanned`, `emergency`
- **Service Description** (required) - Service description text

## 🎯 Usage

1. **Create a Draft**: Click "Create Draft" to start a new draft
2. **Fill the Form**: Enter service log information (auto-saves as you type)
3. **Switch Drafts**: Click on any draft in the sidebar to switch between drafts
4. **Create Service Log**: Submit the form to create a final service log
5. **View Logs**: All created logs appear in the table below
6. **Search & Filter**: Use the search bar and filters to find specific logs
7. **Edit/Delete**: Use the action buttons in the table to edit or delete logs

## 🔧 Configuration

The application uses Redux Persist with localStorage for data persistence. All drafts and service logs are automatically saved and restored on page reload.

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development Notes

- The project uses TypeScript strict mode
- All components are typed with TypeScript
- Form validation is handled by Yup schemas
- State management follows Redux Toolkit best practices
- UI components use Material-UI with CSS-in-JS styling
