import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobCard, { Job } from '../components/JobCard';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

const mockJob: Job = {
  image: '/test-image.jpg',
  title: 'Test Job',
  location: ['Addis Ababa', 'Adama'],
  description: 'This is a test job description.',
  opType: 'Inperson',
  categories: ['Engineering', 'Technology'],
  id: '1',
  isBookmarked: false,
};

describe('JobCard', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { accessToken: 'test-token' } },
      status: 'authenticated',
    });
  });

  it('should toggle bookmark status when clicked', async () => {
    // Mock the fetch function for bookmarking
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock a successful POST response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<JobCard {...mockJob} />);

    const bookmarkIcon = screen.getByTestId('bookmark-icon');

    // Initial state should be unbookmarked
    expect(bookmarkIcon).toHaveAttribute('fill', '#ffffff');

    // Click to bookmark
    fireEvent.click(bookmarkIcon);

    await waitFor(() => expect(bookmarkIcon).toHaveAttribute('fill', '#515B6F'));

    // Check if POST request was made to create a bookmark
    expect(mockFetch).toHaveBeenCalledWith(
      'https://akil-backend.onrender.com/bookmarks/1',
      expect.objectContaining({
        method: 'POST',
      })
    );

    // Mock a successful DELETE response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    // Click to unbookmark
    fireEvent.click(bookmarkIcon);

    await waitFor(() => expect(bookmarkIcon).toHaveAttribute('fill', '#ffffff'));

    // Check if DELETE request was made to remove the bookmark
    expect(mockFetch).toHaveBeenCalledWith(
      'https://akil-backend.onrender.com/bookmarks/1',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });

  it('should show an error message if API call fails', async () => {
    // Mock the fetch function to simulate an error
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Failed to bookmark' }),
    });

    render(<JobCard {...mockJob} />);

    const bookmarkIcon = screen.getByTestId('bookmark-icon');

    // Click to bookmark
    fireEvent.click(bookmarkIcon);

    // Wait for the error message to appear
    expect(await screen.findByText('Failed to bookmark')).toBeInTheDocument();
  });
});




