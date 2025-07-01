import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { act } from 'react-test-renderer';
import Requests from '../../../components/organisation/Requests';
import { Alert, View, Text, TouchableOpacity } from 'react-native';

// Mock dependencies
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    // Don't auto-execute the callback immediately
    useFocusEffect: jest.fn(),
  };
});

jest.mock('react-native-heroicons/outline', () => ({
  PlusIcon: () => 'PlusIcon',
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  // For confirmation dialogs, automatically trigger the "Delete" button callback
  if (title === 'Confirm Delete' && buttons) {
    const deleteButton = buttons.find(btn => btn.text === 'Delete');
    if (deleteButton && deleteButton.onPress) {
      setTimeout(() => deleteButton.onPress(), 0);
    }
  }
});

// Mock axios hook
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

jest.mock('../../../hooks/useAxios', () => () => ({
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
}));

// Mock RequestCard component
jest.mock('../../../components/organisation/RequestCard', () => {
  return function MockRequestCard(props) {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    
    return (
      <View testID={`request-card-${props.request.id}`}>
        <TouchableOpacity testID="edit-button" onPress={() => props.onEdit(props.request)}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="delete-button" onPress={() => props.onDelete(props.request.id)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Mock RequestFormModal component
jest.mock('../../../components/organisation/RequestFormModal', () => {
  return function MockRequestFormModal(props) {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    
    if (!props.visible) return null;
    
    return (
      <View testID="request-form-modal">
        <TouchableOpacity testID="modal-close-button" onPress={props.onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          testID="modal-submit-button"
          onPress={() => props.onSubmit({
            title: props.editingRequest ? `Updated ${props.editingRequest.title}` : 'New Request',
            requestType: 'General',
            numberOfPeople: '10',
            preferredFoodTypes: ['Rice', 'Vegetables'],
            deliveryNeeded: false,
            requestByDateTime: '2023-06-15T10:30:00.000Z',
            additionalNotes: 'Test notes',
            visibility: 'Public'
          })}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

// Custom render function that wraps component with TailwindProvider
const customRender = (ui, options) => 
  render(
    <TailwindProvider platform="ios">
      {ui}
    </TailwindProvider>,
    options
  );

describe('Requests Component', () => {
  const mockRequests = [
    {
      id: 'request_1',
      title: 'Food Request 1',
      urgent: true,
      products: 'Rice, Vegetables',
      quantity: 25,
      notes: 'Please deliver before noon',
      delivery: true,
      visibility: true,
      dateTime: '2023-06-15T10:30:00.000Z',
      donations: []
    },
    {
      id: 'request_2',
      title: 'Food Request 2',
      urgent: false,
      products: 'Bread, Fruits',
      quantity: 15,
      notes: 'For elderly home',
      delivery: false,
      visibility: false,
      dateTime: '2023-06-20T14:00:00.000Z',
      donations: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    mockGet.mockResolvedValue({
      data: {
        foodRequests: mockRequests
      }
    });
    
    mockPost.mockResolvedValue({
      data: {
        foodRequest: {
          id: 'new_request_id',
          title: 'New Request',
          urgent: false,
          products: 'Rice, Vegetables',
          quantity: 10,
          notes: 'Test notes',
          delivery: false,
          visibility: true,
          dateTime: '2023-06-15T10:30:00.000Z',
          donations: []
        }
      }
    });
    
    mockPut.mockResolvedValue({
      data: {
        foodRequest: {
          ...mockRequests[0],
          title: 'Updated Food Request 1'
        }
      }
    });
    
    mockDelete.mockResolvedValue({ data: { success: true } });
  });

  test('renders loading state initially', async () => {
    // Delay the API response
    mockGet.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => {
      resolve({
        data: {
          foodRequests: mockRequests
        }
      });
    }, 100)));
    
    const { getByText, queryAllByTestId } = customRender(<Requests />);
    
    // Should show loading state
    expect(getByText('Donation Requests')).toBeTruthy();
    expect(queryAllByTestId(/request-card/).length).toBe(0);
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/orgrequests/requests/incomplete/user_3');
    });
  });

  test('renders requests after loading', async () => {
    const { getAllByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      const requestCards = getAllByTestId(/request-card/);
      expect(requestCards).toHaveLength(2);
    });
    
    // Verify API was called
    expect(mockGet).toHaveBeenCalledWith('/api/orgrequests/requests/incomplete/user_3');
  });

  test('handles API error', async () => {
    // Mock API error
    mockGet.mockRejectedValueOnce(new Error('Network error'));
    
    const { findByText } = customRender(<Requests />);
    
    // Should show error message
    const errorMessage = await findByText('Failed to load food requests. Please try again.');
    expect(errorMessage).toBeTruthy();
  });

  test('opens create modal when new request button is clicked', async () => {
    const { getByText, findByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalled();
    });
    
    // Click the new request button
    fireEvent.press(getByText('New Request'));
    
    // Modal should be visible
    await waitFor(() => {
      const modal = getByText('Submit');
      expect(modal).toBeTruthy();
    });
  });

  test('creates new request successfully', async () => {
    const { getByText, getByTestId, getAllByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalled();
    });
    
    // Reset Alert mock before the test
    Alert.alert.mockClear();
    
    // Click the new request button
    await act(async () => {
      fireEvent.press(getByText('New Request'));
    });
    
    // Wait for modal to appear
    await waitFor(() => {
      const modal = getByTestId('request-form-modal');
      expect(modal).toBeTruthy();
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('modal-submit-button'));
      
      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verify API call
    expect(mockPost).toHaveBeenCalledWith('/api/orgrequests/requests', {
      title: 'New Request',
      products: 'Rice, Vegetables',
      quantity: 10,
      dateTime: '2023-06-15T10:30:00.000Z',
      notes: 'Test notes',
      urgent: false,
      delivery: false,
      visibility: true,
      orgUserId: 'user_3'
    });
    
    // Alert should be shown
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'New request created successfully');
    
    // Request list should be updated
    await waitFor(() => {
      const requestCards = getAllByTestId(/request-card/);
      expect(requestCards.length).toBeGreaterThan(0);
    });
  });

  test('edits request successfully', async () => {
    const { getAllByTestId, getByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      const requestCards = getAllByTestId(/request-card/);
      expect(requestCards.length).toBeGreaterThan(0);
    });
    
    // Reset Alert mock before the test
    Alert.alert.mockClear();
    
    // Find and click edit button on first request
    const editButtons = getAllByTestId('edit-button');
    await act(async () => {
      fireEvent.press(editButtons[0]);
    });
    
    // Modal should be visible with editing data
    await waitFor(() => {
      const modal = getByTestId('request-form-modal');
      expect(modal).toBeTruthy();
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.press(getByTestId('modal-submit-button'));
      
      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verify API call
    expect(mockPut).toHaveBeenCalledWith('/api/orgrequests/requests/request_1', expect.any(Object));
    
    // Alert should be shown
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Request updated successfully');
  });

  test('deletes request successfully', async () => {
    const { getAllByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      const requestCards = getAllByTestId(/request-card/);
      expect(requestCards.length).toBeGreaterThan(0);
    });
    
    // Reset the Alert mock to clear previous calls
    Alert.alert.mockClear();
    
    // Find and click delete button on first request
    const deleteButtons = getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.press(deleteButtons[0]);
      
      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verify API call was made
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('/api/orgrequests/requests/request_1');
    });
    
    // Success alert should be shown
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Request deleted successfully');
  });

  test('handles delete error when request has donations', async () => {
    // Mock API error for deletion
    mockDelete.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: 'Cannot delete request with donations' }
      }
    });
    
    const { getAllByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      const requestCards = getAllByTestId(/request-card/);
      expect(requestCards.length).toBeGreaterThan(0);
    });
    
    // Reset the Alert mock to clear previous calls
    Alert.alert.mockClear();
    
    // Find and click delete button on first request
    const deleteButtons = getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.press(deleteButtons[0]);
    });
    
    // Get the delete callback from the confirmation dialog
    const deleteCallback = Alert.alert.mock.calls[0][2].find(btn => btn.text === 'Delete').onPress;
    
    // Reset the Alert mock again before triggering the callback
    Alert.alert.mockClear();
    
    // Manually trigger the delete callback which will fail with our mocked error
    await act(async () => {
      await deleteCallback();
    });
    
    // Now check that the error alert was shown
    expect(Alert.alert).toHaveBeenCalledWith(
      'Cannot Delete',
      'This request already has donations. Consider marking it as completed instead.'
    );
  });

  test('handles general delete error', async () => {
    // Mock general API error for deletion
    mockDelete.mockRejectedValueOnce(new Error('Network error'));
    
    const { getAllByTestId } = customRender(<Requests />);
    
    // Wait for requests to load
    await waitFor(() => {
      const requestCards = getAllByTestId(/request-card/);
      expect(requestCards.length).toBeGreaterThan(0);
    });
    
    // Reset the Alert mock to clear previous calls
    Alert.alert.mockClear();
    
    // Find and click delete button on first request
    const deleteButtons = getAllByTestId('delete-button');
    await act(async () => {
      fireEvent.press(deleteButtons[0]);
    });
    
    // Get the delete callback from the confirmation dialog
    const deleteCallback = Alert.alert.mock.calls[0][2].find(btn => btn.text === 'Delete').onPress;
    
    // Reset the Alert mock again before triggering the callback
    Alert.alert.mockClear();
    
    // Manually trigger the delete callback which will fail with our mocked error
    await act(async () => {
      await deleteCallback();
    });
    
    // Now check that the error alert was shown
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete request. Please try again.');
  });

  test('refreshes requests when screen comes into focus', async () => {
    const { useFocusEffect } = require('@react-navigation/native');
    
    // Render the component
    customRender(<Requests />);
    
    // Wait for initial data load
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
    
    // Reset the mock to check for the second call
    mockGet.mockClear();
    
    // Get the callback that was passed to useFocusEffect
    const callback = useFocusEffect.mock.calls[0][0];
    
    // Manually invoke the callback to simulate screen focus
    act(() => {
      callback();
    });
    
    // Verify that fetchRequests was called again
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });
});
