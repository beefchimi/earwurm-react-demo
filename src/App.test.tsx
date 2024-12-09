import {describe, it} from 'vitest';
import {render, screen} from '@testing-library/react';

function App() {
  return <p>Hello World!</p>;
}

describe('App', () => {
  it('renders the App component', () => {
    render(<App />);

    // Prints out the JSX in the App component.
    screen.debug();
  });
});
