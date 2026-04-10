import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('supports the main exploration flow', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /^model observatory$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /focus gpt-5\.1-codex-max/i }));
    expect(screen.getByTestId('atlas-focus')).toHaveTextContent('GPT-5.1-Codex-Max');

    await user.selectOptions(screen.getByLabelText(/x-axis metric/i), 'plannerScore');
    await user.selectOptions(screen.getByLabelText(/y-axis metric/i), 'maxOutputTokens');
    expect(screen.getByLabelText(/x-axis metric/i)).toHaveValue('plannerScore');
    expect(screen.getByLabelText(/y-axis metric/i)).toHaveValue('maxOutputTokens');

    await user.click(screen.getByRole('button', { name: /inspect focus sources/i }));
    expect(screen.getByRole('heading', { name: /gpt-5\.1-codex-max focus sources/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/y-axis metric/i), 'budget-swarms');
    expect(screen.getByLabelText(/y-axis metric/i)).toHaveValue('budget-swarms');

    await user.click(screen.getByRole('button', { name: /swarm mode/i }));
    expect(screen.getByLabelText(/budget swarms/i)).toHaveValue('100');
  });
});
