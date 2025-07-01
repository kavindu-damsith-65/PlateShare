import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { act } from 'react-test-renderer';
import RequestCard from '../../../components/organisation/RequestCard';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock heroicons
jest.mock('react-native-heroicons/outline', () => ({
  TrashIcon: () => 'TrashIcon',
  PencilIcon: () => 'PencilIcon',
}));

// Custom render function that wraps component with TailwindProvider
const customRender = (ui, options) => 
  render(
    <TailwindProvider platform="ios">
      {ui}
    </TailwindProvider>,
    options
  );

describe('RequestCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  const mockRequest = {
    id: 'request_1',
    title: 'Food Request',
    urgent: true,
    products: 'Rice, Vegetables',
    quantity: 25,
    notes: 'Please deliver before noon',
    delivery: true,
    visibility: true, // Public
    dateTime: '2023-06-15T10:30:00.000Z',
    donations: [
      {
        id: 'donation_1',
        product: {
          name: 'Rice',
          image: 'https://example.com/rice.jpg'
        },
        quantity: 10
      },
      {
        id: 'donation_2',
        product: {
          name: 'Vegetables',
          image: 'https://example.com/vegetables.jpg'
        },
        quantity: 5
      }
    ]
  };

  const mockRequestWithoutDonations = {
    ...mockRequest,
    donations: []
  };

  const mockRequestWithManyDonations = {
    ...mockRequest,
    donations: [
      ...mockRequest.donations,
      {
        id: 'donation_3',
        product: {
          name: 'Bread',
          image: 'https://example.com/bread.jpg'
        },
        quantity: 3
      },
      {
        id: 'donation_4',
        product: {
          name: 'Fruits',
          image: 'https://example.com/fruits.jpg'
        },
        quantity: 7
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with all request details', () => {
    const { getByText, getAllByText } = customRender(
      <RequestCard 
        request={mockRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Check basic request details
    expect(getByText('Food Request')).toBeTruthy();
    expect(getByText('Urgent')).toBeTruthy();
    expect(getByText('Needs: Rice, Vegetables')).toBeTruthy();
    expect(getByText('Quantity: 25')).toBeTruthy();
    expect(getByText('"Please deliver before noon"')).toBeTruthy();
    
    // Check tags
    expect(getByText('Delivery Needed')).toBeTruthy();
    expect(getByText('Public')).toBeTruthy();
    
    // Check date
    expect(getByText(/Needed by:/)).toBeTruthy();
    
    // Check action buttons
    expect(getByText('Edit')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
    
    // Check donations
    expect(getByText('Donations (2):')).toBeTruthy();
    expect(getAllByText(/\d+x/).length).toBe(2); // Check for quantity indicators
  });

  test('renders correctly without donations', () => {
    const { queryByText } = customRender(
      <RequestCard 
        request={mockRequestWithoutDonations} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Donations section should not be present
    expect(queryByText(/Donations/)).toBeNull();
  });

  test('renders correctly with many donations and shows +N more', () => {
    const { getByText } = customRender(
      <RequestCard 
        request={mockRequestWithManyDonations} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Check donations count
    expect(getByText('Donations (4):')).toBeTruthy();
    
    // Check for +1 more indicator (showing 3 out of 4)
    expect(getByText('+1')).toBeTruthy();
  });

  test('renders general request tag correctly', () => {
    const generalRequest = {
      ...mockRequest,
      urgent: false
    };
    
    const { getByText, queryByText } = customRender(
      <RequestCard 
        request={generalRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(getByText('General')).toBeTruthy();
    expect(queryByText('Urgent')).toBeNull();
  });

  test('renders private visibility tag correctly', () => {
    const privateRequest = {
      ...mockRequest,
      visibility: false
    };
    
    const { getByText, queryByText } = customRender(
      <RequestCard 
        request={privateRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(getByText('Private')).toBeTruthy();
    expect(queryByText('Public')).toBeNull();
  });

  test('renders without delivery tag when delivery not needed', () => {
    const noDeliveryRequest = {
      ...mockRequest,
      delivery: false
    };
    
    const { queryByText } = customRender(
      <RequestCard 
        request={noDeliveryRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(queryByText('Delivery Needed')).toBeNull();
  });

  test('renders without notes when notes are empty', () => {
    const noNotesRequest = {
      ...mockRequest,
      notes: ''
    };
    
    const { queryByText } = customRender(
      <RequestCard 
        request={noNotesRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Should not find any text in quotes (the notes)
    expect(queryByText(/^".*"$/)).toBeNull();
  });

  test('calls onEdit when Edit button is pressed', () => {
    const { getByText } = customRender(
      <RequestCard 
        request={mockRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Find the Edit button by its text and press it
    fireEvent.press(getByText('Edit'));
    
    // Check that onEdit was called with the request object
    expect(mockOnEdit).toHaveBeenCalledWith(mockRequest);
  });

  test('calls onDelete when Delete button is pressed', () => {
    const { getByText } = customRender(
      <RequestCard 
        request={mockRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Find the Delete button by its text and press it
    fireEvent.press(getByText('Delete'));
    
    // Check that onDelete was called with the request ID
    expect(mockOnDelete).toHaveBeenCalledWith(mockRequest.id);
  });

  test('formats date correctly', () => {
    const { getByText } = customRender(
      <RequestCard 
        request={mockRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // The exact format depends on the implementation, but we can check for the date prefix
    expect(getByText(/Needed by: \d{4}\/\d{2}\/\d{2}/)).toBeTruthy();
  });

  test('navigates to RequestDetails when card is pressed', () => {
    const { getByText } = customRender(
      <RequestCard 
        request={mockRequest} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Find the card by its title and press it
    // We're using the title as a way to identify the card's touchable area
    fireEvent.press(getByText('Food Request'));
    
    // Check that navigation.navigate was called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('RequestDetails', { requestId: mockRequest.id });
  });
});
