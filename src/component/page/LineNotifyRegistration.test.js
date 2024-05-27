import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LineNotifyRegistration, { AccountForm } from './LineNotifyRegistration';
import * as api from '../../utility/api';

// Mock the API call function
jest.mock('../../utility/api', () => ({
  get: jest.fn(),
}));

describe('Test AccountForm', () => {
  test('renders loading and submit', async () => {
    render(<AccountForm />);
    const inputField = screen.getByPlaceholderText('請問你的名字');
    const submitButton = screen.getByText('註冊LINE通知');

    // Simulate user input
    fireEvent.change(inputField, { target: { value: 'testuser' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Verify that the loading element is shown
    const loadingElement = await screen.findByText('Loading...');
    expect(loadingElement).toBeInTheDocument();
  });

  beforeEach(() => {
    // Clear mocked function calls before each test
    api.get.mockClear();
  });

  test('submit success', async () => {
    // Mock the API response for a successful submission
    api.get.mockResolvedValueOnce({ success: true, data: { redirectUrl: 'https://example.com/redirect' } });

    render(<AccountForm />);

    // Simulate user input
    const usernameInput = screen.getByPlaceholderText('請問你的名字');
    fireEvent.change(usernameInput, { target: { value: 'validUsername' } });

    const submitButton = screen.getByText('註冊LINE通知');
    fireEvent.click(submitButton);

    // Wait for the loading state to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument(), { timeout: 2000 });

    // Assert the success message is displayed
    expect(screen.getByText(/Yes!! 成功了/i)).toBeInTheDocument();

    // Assert the redirect link is displayed
    expect(screen.getByText(/兩秒後沒有自動跳轉請點這/i)).toBeInTheDocument();
  });

  test('submit fail', async () => {
    // Mock the API response for a failed submission
    api.get.mockResolvedValueOnce({ success: true, data: { error: 'Invalid username' } });

    render(<AccountForm />);

    // Simulate user input
    const usernameInput = screen.getByPlaceholderText('請問你的名字');
    fireEvent.change(usernameInput, { target: { value: 'invalidUsername' } });

    // Submit the form
    const submitButton = screen.getByText('註冊LINE通知');
    fireEvent.click(submitButton);

    // Wait for the loading state to finish
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument(), { timeout: 2000 });

    // Assert the failure message is displayed
    expect(screen.getByText(/No~~ 失敗了/i)).toBeInTheDocument();
    expect(screen.getByText('Invalid username')).toBeInTheDocument();

    // Assert the input field regains focus
    await waitFor(() => expect(usernameInput).toHaveFocus(), { timeout: 2000 });
  });
});

// test('renders loading state', async () => {
//   const { container } = render(<AccountForm />);
//   const componentInstance = container.firstChild;

//   // 存取組件內部的 isLoading 狀態
//   const isLoadingState = componentInstance.isLoading;
//   expect(isLoadingState).toBe(false);
// });

describe('Test CallbackPage', () => {
  const validTokenInfo = {
    channel: 'validChannel',
    token: 'a123456',
    notifyEnabled: true,
    updateDate: '20240319',
  };

  const invalidTokenInfo = {
    channel: '',
    token: '',
    notifyEnabled: false,
    updateDate: '20240319',
  };

  const routes = [
    {
      path: '/line/registration/callback',
      element: <LineNotifyRegistration isCallbackPage={true} />,
      errorElement: <div>LineNotifyRegistration Error Page</div>,
    },
    {
      path: '/error',
      element: <div>Error Page</div>,
    },
  ];

  const renderWithRouter = (tokenInfo) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [`/line/registration/callback?tokenInfo=${encodeURIComponent(JSON.stringify(tokenInfo))}`],
    });
    render(<RouterProvider router={router} />);
  };

  test('renders success message with valid token info', () => {
    renderWithRouter(validTokenInfo);
    expect(screen.getByText(/註冊成功/i)).toBeInTheDocument();
    expect(screen.getByText(validTokenInfo.channel, { exact: false })).toBeInTheDocument();
  });

  test('navigates to error page with invalid token info', () => {
    renderWithRouter(invalidTokenInfo);
    expect(screen.getByText(/Error Page/i)).toBeInTheDocument();
  });
});
