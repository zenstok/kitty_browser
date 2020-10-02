import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

it('renders no connection to eth net message', () => {
    const { getByText } = render(<App />);
    expect(getByText('This browser has no connection to the Ethereum network.')).toBeInTheDocument();
});