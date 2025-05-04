import { test, expect } from '@playwright/test';

const appUrl = 'https://todomvc.com/examples/react/dist/'; // Replace with your actual app URL

test.describe('Todo App Acceptance Criteria', () => {

  // Check the webpage connection if is ok
  test('Check if webpage is up', async ({ page }) => {
        const response = await page.goto(appUrl);
        // Check if the response status is OK
        expect(response?.status()).toBe(200);
  });
  
// TestCase: Create Todo list using Input -> Testcase ID :TC_001, TC_002
  test('1. Create Todo', async ({ page }) => {
    await page.goto(appUrl);
    const input = page.getByPlaceholder('What needs to be done?');
    // Valid todo // test case with valid input
    await input.fill('Buy milk from Fariprice');
    await input.press('Enter');
    // await page.waitForTimeout(1000);
    // Check the page footnote shows the number of items left.
    await expect(page.locator('span.todo-count')).toContainText('1 item left!');
    // Check the items add shows in the todo list below.
    await expect(page.getByText('Buy milk from Fariprice')).toBeVisible();

    // Invalid  todo //test case with invalid input
    await input.fill('');
    await input.press('Enter');
    // Check the page footnote shows the number of items left.
    await expect(page.locator('span.todo-count')).toContainText('1 item left!');
    // Check the items add shows in the todo list below.
    await expect(page.getByText('Buy milk from Fariprice')).toBeVisible(); // only have one item in the todo list
  });

// TestCase: View Todo list -> Testcase ID :TC_003
  test('2. View Todos', async ({ page }) => {
    await page.goto(appUrl);

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Walk dog');
    await input.press('Enter');
    await input.fill('Walk cat');
    await input.press('Enter');
    
    // Both items should be visible in 'All'
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByText('Walk dog')).toBeVisible();
    await expect(page.getByText('Walk cat')).toBeVisible();
    // Page footnote should show 2 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('2 items left!');
    // Both items should be visible in 'Active'
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByText('Walk dog')).toBeVisible();
    await expect(page.getByText('Walk cat')).toBeVisible();
    // Page footnote should show 2 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('2 items left!');
    // Both items should NOT be visible in 'Completed'
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByText('Walk dog')).not.toBeVisible();
    await expect(page.getByText('Walk cat')).not.toBeVisible();
    // await page.pause(); 
    // Page footnote should show 2 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('2 items left!');
  });

// TestCase: Complete Todo list -> Testcase ID :TC_004
  test('3. Complete Todo', async ({ page }) => {
    await page.goto(appUrl);
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Wash car');
    await input.press('Enter');
    // see if the checkbox can be ticked. 
    const todoCheckbox = page.locator('input[type="checkbox"]').first();
    await todoCheckbox.check();

    // After checkbox is ticked, under " All "tab, no items should be shown
    await page.getByRole('link', { name: 'All' }).click();
    // list element should place under completed.
    const todoItem = page.locator('li:has-text("Wash car")');
    await expect(todoItem).toHaveClass(/completed/);
    // to-do items should be strickthrough 
    const label = page.locator('li:has-text("Wash car") label');
    await expect(label).toHaveCSS('text-decoration-line', 'line-through');

    // After checkbox is ticked, under "Active"tab, no items should be shown
    await page.getByRole('link', { name: 'Active' }).click();
    // Assert that no element with the text "Wash car" exists
    const elementCheck = page.locator('li:has-text("Wash car")');
    // The element should not be found
    await expect(page.getByText('Wash car')).toHaveCount(0); 

    // After checkbox is ticked, under " Completed "tab, items should be shown
    await page.getByRole('link', { name: 'Completed' }).click();
    // list element should place under completed.
    const todoItem2 = page.locator('li:has-text("Wash car")');
    await expect(todoItem2).toHaveClass(/completed/);
    // to-do items should be strickthrough 
    const label2 = page.locator('li:has-text("Wash car") label');
    await expect(label2).toHaveCSS('text-decoration-line', 'line-through');

    // Page footnote should show 0 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('0 items left!');
  });

  
// TestCase: Edit Todo list -> Testcase ID :TC_005
  test('4. Edit Todo', async ({ page }) => {
    await page.goto(appUrl);
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Call mom');
    await input.press('Enter');
    // double click the existing to-do items 
    await page.getByText('Call mom').dblclick();
    // edit the existing to do items and change to-do items 
    await page.getByTestId('todo-list').getByTestId('text-input').fill('Call dad');
    await page.getByTestId('todo-list').getByTestId('text-input').press('Enter');
   //Check see if the orignal todo item should be gone and altered to-do item should be displayed in "All"tab 
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByText('Call dad')).toBeVisible();
    await expect(page.getByText('Call mom')).toHaveCount(0);
    // Page footnote should show 1 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('1 item left!');
  });

// TestCase: Delete Todo list -> Testcase ID :TC_006
  test('5. Delete Todo', async ({ page }) => {
    await page.goto(appUrl);
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Delete me');
    await input.press('Enter');
    // under the "All" tab , should already have 1 exiting items
    await page.getByRole('link', { name: 'All' }).click();
    // Page footnote should show 1 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('1 item left!');
    // delete the existing item
    await page.getByText('Delete me', { exact: true }).click();
    await page.getByRole('button', { name: '×' }).click();
    // Check the to-do list should be empty
    await expect(page.getByText('Delete me')).toHaveCount(0);
    // the only one item is deleted, the All, Active and Completed tab should be disappear.
    await expect(page.locator('role=link[name="All"]')).not.toBeVisible();
    await expect(page.locator('role=link[name="Active"]')).not.toBeVisible();
    await expect(page.locator('role=link[name="Completed"]')).not.toBeVisible();
    
  });

  // TestCase: Delete Todo list -> Testcase ID :TC_007,TC_008,TC_009
  test('6. Filter Todos', async ({ page }) => {
    await page.goto(appUrl);

    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Active Task 1');
    await input.press('Enter');
    await input.fill('Active Task 2');
    await input.press('Enter');
    await input.fill('Compeleted Task 1');
    await input.press('Enter');
    await input.fill('Compeleted Task 2');
    await input.press('Enter');

    // Page footnote should show 4 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('4 items left!');

    // mark some task as compeleted 
    await page.getByRole('link', { name: 'All' }).click();
    await page.getByRole('listitem').filter({ hasText: 'Compeleted Task 1' }).getByTestId('todo-item-toggle').check();
    await page.getByRole('listitem').filter({ hasText: 'Compeleted Task 2' }).getByTestId('todo-item-toggle').check();
    
    // Under " All " Tab should show every compeleted and active todo task
    await page.getByRole('link', { name: 'All' }).click();
    // Active to do items should be visibe 
    await expect(page.getByText('Active Task 1')).toBeVisible();
    await expect(page.getByText('Active Task 1')).toBeVisible();
    // completed todo items should place under completed and strickthrough 
    const todoItem = page.locator('li:has-text("Compeleted Task 1")');
    await expect(todoItem).toHaveClass(/completed/);
    const label = page.locator('li:has-text("Compeleted Task 1") label');
    await expect(label).toHaveCSS('text-decoration-line', 'line-through');
    const todoItem2 = page.locator('li:has-text("Compeleted Task 2")');
    await expect(todoItem2).toHaveClass(/completed/);
    const label2 = page.locator('li:has-text("Compeleted Task 2") label');
    await expect(label2).toHaveCSS('text-decoration-line', 'line-through');
    // Page footnote should show 2 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('2 items left!');

    // Under " Active " Tab should show every active todo task
    await page.getByRole('link', { name: 'Active' }).click();
    // Active to do items should be visibe 
    await expect(page.getByText('Active Task 1')).toBeVisible();
    await expect(page.getByText('Active Task 1')).toBeVisible();
    // Page footnote should show 2 itmes in count
    await expect(page.locator('span.todo-count')).toContainText('2 items left!');

    // Under " Compeleted " Tab should show every compeleted todo task
    await page.getByRole('link', { name: 'Completed' }).click();
     // completed todo items should place under completed and strickthrough 
     const compeletedtodoItem = page.locator('li:has-text("Compeleted Task 1")');
     await expect(compeletedtodoItem).toHaveClass(/completed/);
     const compeletedlabel = page.locator('li:has-text("Compeleted Task 1") label');
     await expect(compeletedlabel).toHaveCSS('text-decoration-line', 'line-through');
     const compeletedtodoItem2 = page.locator('li:has-text("Compeleted Task 2")');
     await expect(compeletedtodoItem2).toHaveClass(/completed/);
     const compeletedlabel2 = page.locator('li:has-text("Compeleted Task 2") label');
     await expect(compeletedlabel2).toHaveCSS('text-decoration-line', 'line-through');
     // Page footnote should show 2 itmes in count
     await expect(page.locator('span.todo-count')).toContainText('2 items left!');

    
  });

    // TestCase: Clear Completed list -> Testcase ID :TC_0010
    test('7. Clear Completed Todos', async ({ page }) => {
      await page.goto(appUrl);
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Active Task 1');
      await input.press('Enter');
      await input.fill('Compeleted Task 1');
      await input.press('Enter');
      await input.fill('Compeleted Task 2');
      await input.press('Enter');
      // Page footnote should show 3 itmes in count
      await expect(page.locator('span.todo-count')).toContainText('3 items left!');

      // mark some task as completed 
      await page.getByRole('link', { name: 'All' }).click();
      await page.getByRole('listitem').filter({ hasText: 'Compeleted Task 1' }).getByTestId('todo-item-toggle').check();
      await page.getByRole('listitem').filter({ hasText: 'Compeleted Task 2' }).getByTestId('todo-item-toggle').check();
      // Page footnote should show 1 itmes in count
      await expect(page.locator('span.todo-count')).toContainText('1 item left!');
      // Click the "Clear completed" button to delete completed tasks.
      await page.getByRole('button', { name: 'Clear completed' }).click();

      //  under "All", only active to do list will shown
      await page.getByRole('link', { name: 'All' }).click();
      await expect(page.getByText('Active Task 1')).toBeVisible();
      await expect(page.getByText('Compeleted Task 1')).toHaveCount(0);
      await expect(page.getByText('Compeleted Task 2')).toHaveCount(0);
      // Page footnote should show 1 itmes in count
      await expect(page.locator('span.todo-count')).toContainText('1 item left!');

      // under "completed", list will be empty.
      await page.getByRole('link', { name: 'Completed' }).click();
      await expect(page.getByText('Compeleted Task 1')).toHaveCount(0);
      await expect(page.getByText('Compeleted Task 2')).toHaveCount(0);
      // Page footnote should show 1 itmes in count
      await expect(page.locator('span.todo-count')).toContainText('1 item left!');

    });

});
