import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as ReactRouterDom from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Home } from './Home';

const emit = vi.fn();
const navigate = vi.fn();

vi.mock('@/lib/socket', () => ({
  socket: {
    connected: true,
    connect: vi.fn(),
    emit: (...args: unknown[]) => emit(...args),
  },
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactRouterDom>()),
  useNavigate: () => navigate,
}));

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

describe('Home', () => {
  beforeEach(() => {
    emit.mockReset();
    navigate.mockReset();
  });

  it('asks for a username before joining', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: 'Join room' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a username');
    expect(emit).not.toHaveBeenCalled();
  });

  it('joins the selected room and goes to the chat', async () => {
    const user = userEvent.setup();
    emit.mockImplementation((_event, _payload, callback: (error?: string) => void) => {
      callback();
    });
    renderHome();

    await user.type(screen.getByLabelText('Username'), 'Ronny');
    await user.selectOptions(screen.getByLabelText('Room'), 'Movies');
    await user.click(screen.getByRole('button', { name: 'Join room' }));

    expect(emit).toHaveBeenCalledWith(
      'join',
      { username: 'Ronny', room: 'Movies' },
      expect.any(Function),
    );
    expect(navigate).toHaveBeenCalledWith('/chat?username=Ronny&room=Movies');
  });

  it('shows the error the server sends back', async () => {
    const user = userEvent.setup();
    emit.mockImplementation((_event, _payload, callback: (error?: string) => void) => {
      callback('That username is already taken in this room.');
    });
    renderHome();

    await user.type(screen.getByLabelText('Username'), 'Ronny');
    await user.click(screen.getByRole('button', { name: 'Join room' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('already taken');
    expect(navigate).not.toHaveBeenCalled();
  });
});
