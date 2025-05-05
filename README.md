# Cognizant_Automation_Technical_challenge
Cognizant Internal Evaluation: Automation Technical Challenge 

Test Website URL: https://todomvc.com/examples/react/dist/
Test Report: https://docs.google.com/spreadsheets/d/1kZ7_Wj2E5C6W077AWMhYYH5cs_K0uK-9nlm3AI5Pnxc/edit?gid=0#gid=0


📖 About:
This project is an automated end-to-end testing suite using Playwright with TypeScript. It is designed to test functionality of the todo list website. 

🛠️ Technologies:
    Playwright
    TypeScript
    Node.js / npm
    VS Code
    Git

⚙️ Setup:
1. Open VScode
2. Under the terminal, Clone the repo:
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
3. Install dependencies:
    npm install
    npx playwright install

🚀 Running Tests
To run all tests:
    npx playwright test --config=playwright.config.ts

📊 Generating Reports
After running tests, to see the result:
locate test-results folder, openlast-run.json. This should show result pass is true. 

📁 Folder Structure
repo/
|   Acceptance Criteria.txt
|   package-lock.json
|   package.json
|   playwright.config.ts  # Playwright configuration
|   README.md
|   tsconfig.json
+---node_modules
|
+---test-results
|       .last-run.json
|       
\---tests
        todo.spec.ts    # Test files


👤 Author
Wu Weijie – https://github.com/WJ-wu/Cognizant_Automation_Technical_challenge/tree/main

