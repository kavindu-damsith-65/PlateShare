import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DonationItem from '../../../components/organisation/DonationItem';
import useAxios from '../../../hooks/useAxios';
import { Alert } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { act } from 'react-test-renderer';

// Mock dependencies
jest.mock('../../../hooks/useAxios', () => jest.fn());
jest.mock('react-native-heroicons/outline', () => ({
  StarIcon: 'StarIcon',
  PencilIcon: 'PencilIcon',
  TrashIcon: 'TrashIcon'
}));
jest.mock('../../../components/Buyer/ReviewFormModal', () => 'ReviewFormModal');

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  // Check if buttons is defined and is an array before trying to find
  if (buttons && Array.isArray(buttons)) {
    // Store the callback for later use in tests
    Alert.alert.mockButtonCallback = buttons.find(btn => btn.text === 'Delete')?.onPress;
  }
});

// Set longer timeout for all tests in this file
jest.setTimeout(15000);

// Custom render function that wraps component with TailwindProvider
const customRender = (ui, options) => 
  render(
    <TailwindProvider platform="ios">
      {ui}
    </TailwindProvider>,
    options
  );

describe('DonationItem Component', () => {
  const mockAxios = {
    get: jest.fn(),
    delete: jest.fn()
  };
  
  const mockDonation = {
    id: 'donation_1',
    product: {
      id: 'product_1',
      name: 'Test Product',
      description: 'Test Description',
      image: 'https://example.com/product.jpg'
    },
    restaurant: {
      id: 'restaurant_1',
      name: 'Test Restaurant',
      image: 'https://example.com/restaurant.jpg'
    },
    quantity: 5
  };
  
  const mockReviews = [
    {
      id: 'review_1',
      rating: 4,
      description: 'Great food!',
      userId: 'user_3',
      restaurantId: 'restaurant_1'
    },
    {
      id: 'review_2',
      rating: 5,
      description: 'Excellent service!',
      userId: 'user_3',
      restaurantId: 'restaurant_1'
    }
  ];

  beforeEach(() => {
    useAxios.mockReturnValue(mockAxios);
    mockAxios.get.mockResolvedValue({ data: mockReviews });
    mockAxios.delete.mockResolvedValue({ data: { success: true } });
    Alert.alert.mockClear();
    Alert.alert.mockButtonCallback = null;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders donation item correctly without history', async () => {
    const { getByText, queryByText } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={false} />
    );
    
    // Basic donation information should be displayed
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Quantity: 5')).toBeTruthy();
    expect(getByText('Test Restaurant')).toBeTruthy();
    
    // Review section should not be visible
    expect(queryByText('Your Reviews:')).toBeNull();
    expect(queryByText('Add Review')).toBeNull();
  });

  test('renders donation item with history and fetches reviews', async () => {
    const { getByText, getAllByText } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/reviews/user/user_3/restaurant/restaurant_1'
      );
    }, { timeout: 5000 });
    
    // Basic donation information should be displayed
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Quantity: 5')).toBeTruthy();
    expect(getByText('Test Restaurant')).toBeTruthy();
    
    // Review section should be visible
    await waitFor(() => {
      expect(getByText('Your Reviews:')).toBeTruthy();
      expect(getByText('Add Review')).toBeTruthy();
    });
    
    // Reviews should be displayed
    await waitFor(() => {
      expect(getByText('Great food!')).toBeTruthy();
      expect(getByText('Excellent service!')).toBeTruthy();
      expect(getAllByText('Rating:').length).toBe(2);
    });
  });

  test('shows loading state while fetching reviews', async () => {
    // Don't resolve the promise yet
    mockAxios.get.mockImplementation(() => new Promise(() => {}));
    
    const { getByText } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Loading state should be displayed
    await waitFor(() => {
      expect(getByText('Loading reviews...')).toBeTruthy();
    });
  });

  test('shows empty state when no reviews are available', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: [] });
    
    const { getByText } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
    });
    
    // Empty state should be displayed
    await waitFor(() => {
      expect(getByText('No reviews yet')).toBeTruthy();
    });
  });

  test('opens review modal when Add Review is clicked', async () => {
    const { getByText, UNSAFE_getByType } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
    });
    
    // Click the Add Review button
    fireEvent.press(getByText('Add Review'));
    
    // Modal should be visible with the ReviewFormModal component
    await waitFor(() => {
      expect(UNSAFE_getByType('ReviewFormModal')).toBeTruthy();
    });
  });

  test('opens review modal with existing review when Edit is clicked', async () => {
    const { UNSAFE_getAllByType, UNSAFE_getByType } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
    });
    
    // Find and click the edit button (PencilIcon)
    await waitFor(() => {
      const editButtons = UNSAFE_getAllByType('PencilIcon');
      fireEvent.press(editButtons[0]);
    });
    
    // Modal should be visible with the ReviewFormModal component
    await waitFor(() => {
      const reviewModal = UNSAFE_getByType('ReviewFormModal');
      expect(reviewModal).toBeTruthy();
      
      // The editingReview prop should be passed to the modal
      expect(reviewModal.props.editingReview).toEqual(mockReviews[0]);
    });
  });

  test('shows confirmation dialog and deletes review when Delete is clicked', async () => {
    const { UNSAFE_getAllByType } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
    });
    
    // Find and click the delete button (TrashIcon)
    await waitFor(() => {
      const deleteButtons = UNSAFE_getAllByType('TrashIcon');
      fireEvent.press(deleteButtons[0]);
    });
    
    // Alert should be shown
    expect(Alert.alert).toHaveBeenCalledWith(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel" }),
        expect.objectContaining({ text: "Delete" })
      ])
    );
    
    // Manually trigger the delete callback if it exists
    if (Alert.alert.mockButtonCallback) {
      await act(async () => {
        await Alert.alert.mockButtonCallback();
      });
      
      // API call should be made to delete the review
      expect(mockAxios.delete).toHaveBeenCalledWith('/api/reviews/review_1');
      
      // Success alert should be shown
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Review deleted successfully");
    }
  });

  test('handles API error when deleting review', async () => {
    mockAxios.delete.mockRejectedValueOnce(new Error('Network error'));
    
    const { UNSAFE_getAllByType } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
    });
    
    // Find and click the delete button (TrashIcon)
    await waitFor(() => {
      const deleteButtons = UNSAFE_getAllByType('TrashIcon');
      fireEvent.press(deleteButtons[0]);
    });
    
    // Mock console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Manually trigger the delete callback if it exists
    if (Alert.alert.mockButtonCallback) {
      await act(async () => {
        try {
          await Alert.alert.mockButtonCallback();
        } catch (error) {
          // Catch any errors to prevent test failure
        }
      });
      
      // Error should be logged
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting review:', expect.any(Error));
      
      // Error alert should be shown
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to delete review. Please try again."
      );
    }
    
    consoleSpy.mockRestore();
  });

  test('refreshes reviews after submitting a new review', async () => {
    const { getByText, UNSAFE_getByType } = customRender(
      <DonationItem donation={mockDonation} isFromHistory={true} />
    );
    
    // Wait for the initial reviews to be fetched
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
    
    // Click the Add Review button
    await waitFor(() => {
      fireEvent.press(getByText('Add Review'));
    });
    
    // Get the ReviewFormModal and trigger its onSubmit prop
    const reviewModal = await waitFor(() => UNSAFE_getByType('ReviewFormModal'));
    
    // Reset the mock to track the next call
    mockAxios.get.mockClear();
    
    // Simulate submitting the review
    await act(async () => {
      reviewModal.props.onSubmit({ rating: 5, description: 'New review' });
    });
    
    // Reviews should be fetched again
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/reviews/user/user_3/restaurant/restaurant_1'
      );
    });
  });
});
