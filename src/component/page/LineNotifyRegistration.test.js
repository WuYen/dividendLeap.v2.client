import { render, fireEvent, screen } from '@testing-library/react';
import LineNotifyRegistration, { AccountForm } from './LineNotifyRegistration';

test('renders test', async () => {
  render(<AccountForm />);
  const inputField = screen.getByLabelText('你是誰👇');
  const submitButton = screen.getByRole('button', { name: '👉 GO GO' });

  // Simulate user input
  fireEvent.change(inputField, { target: { value: 'testuser' } });

  // Simulate form submission
  fireEvent.click(submitButton);

  // Verify that the loading element is shown
  const loadingElement = await screen.findByText('Loading...');
  expect(loadingElement).toBeInTheDocument();
});

// test('renders loading state', async () => {
//   const { container } = render(<AccountForm />);
//   const componentInstance = container.firstChild;

//   // 存取組件內部的 isLoading 狀態
//   const isLoadingState = componentInstance.isLoading;
//   expect(isLoadingState).toBe(false);
// });
