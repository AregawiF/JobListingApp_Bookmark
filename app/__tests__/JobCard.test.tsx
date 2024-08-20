
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSession } from 'next-auth/react';
import JobCard, { Job } from '../components/JobCard';

jest.mock('next-auth/react');

const mockJob: Job = {
  image: '/test-logo.jpg',
  title: 'Software Engineer',
  location: ['Addis Ababa', 'Adama'],
  description: 'Job description for Software Engineer',
  opType: 'In-person',
  categories: ['Engineering', 'Full-time'],
  id: '1',
  isBookmarked: false,
};

describe('JobCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders job card with correct details', () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { accessToken: 'fake-token' } }, status: 'authenticated' });

    render(<JobCard {...mockJob} />);

    // Check if the job title is rendered
    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    
    const locationElement = screen.getByTestId('job-location');
    expect(locationElement).toHaveTextContent('Addis Ababa | Adama');

    // Check if the job description is rendered
    expect(screen.getByText(mockJob.description)).toBeInTheDocument();

    // Check if the job type (opType) is rendered
    expect(screen.getByText(mockJob.opType)).toBeInTheDocument();

    // Check if the category buttons are rendered
    mockJob.categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });

    // Check if the bookmark icon is present
    expect(screen.getByTestId('bookmark-icon')).toBeInTheDocument();
  });

});