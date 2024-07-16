import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LineNotifyRegistration, { AccountForm } from '../page/LineNotifyRegistration';
import * as api from '../../utility/api';

// Mock the API call function
jest.mock('../../utility/api', () => ({
  get: jest.fn(),
}));

describe('Test AccountForm', () => {
  test('renders loading and submit', async () => {
    render(<AccountForm />);
    const inputField = screen.getByRole('textbox', { name: '請問你的名字' });
    const submitButton = screen.getByText('註冊LINE通知');

    // Simulate user input
    fireEvent.change(inputField, { target: { value: 'testuser' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Verify that the loading element is shown
    const loadingElement = screen.getByRole('progressbar');
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
    const usernameInput = screen.getByRole('textbox', { name: '請問你的名字' });
    fireEvent.change(usernameInput, { target: { value: 'validUsername' } });

    const submitButton = screen.getByText('註冊LINE通知');
    fireEvent.click(submitButton);

    // Wait for the loading state to finish
    const loadingElement = screen.getByRole('progressbar');
    await waitFor(() => expect(loadingElement).not.toBeInTheDocument(), { timeout: 2000 });

    const successButton = screen.getByRole('button', { name: /Yes!! 成功了/i });
    expect(successButton).toBeInTheDocument();
    expect(successButton).toBeDisabled();
    expect(successButton).toHaveClass('success');

    // Assert the redirect link is displayed
    await waitFor(
      () => {
        const box = screen.getByText(/兩秒後沒有自動跳轉請點這/).closest('div');
        expect(box).toBeInTheDocument();
        expect(box).toHaveStyle('display: block');
        const link = screen.getByRole('link', { name: /兩秒後沒有自動跳轉請點這/ });
        expect(link).toBeInTheDocument();
        expect(link.getAttribute('href')).toBe('https://example.com/redirect');
      },
      { timeout: 3000 }
    );
  });

  test('submit fail', async () => {
    // Mock the API response for a failed submission
    api.get.mockResolvedValueOnce({ success: true, data: { error: 'Invalid username' } });

    render(<AccountForm />);

    // Simulate user input
    const usernameInput = screen.getByRole('textbox', { name: '請問你的名字' });
    fireEvent.change(usernameInput, { target: { value: 'invalidUsername' } });

    // Submit the form
    const submitButton = screen.getByText('註冊LINE通知');
    fireEvent.click(submitButton);

    // Wait for the loading state to finish
    const loadingElement = screen.getByRole('progressbar');
    await waitFor(() => expect(loadingElement).not.toBeInTheDocument(), { timeout: 2000 });

    const button = screen.getByRole('button', { name: /No~~ 失敗了/i });
    expect(button).toBeInTheDocument();
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
