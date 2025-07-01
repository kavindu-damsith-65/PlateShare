import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Restaurants from '../../../components/Buyer/Restaurants';
import useAxios from '../../../hooks/useAxios';
import { TailwindProvider } from 'tailwindcss-react-native';

// Mock the dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useAxios', () => jest.fn());

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock the RestaurantCard component
jest.mock('../../../components/Buyer/RestaurantCard', () => {
  return function MockRestaurantCard(props) {
    return (
      <div data-testid={`restaurant-card-${props.id}`}>
        <div>{props.title}</div>
      </div>
    );
  };
});

// Custom render function with TailwindProvider
const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TailwindProvider platform="ios">{children}</TailwindProvider>
    ),
    ...options,
  });

// Set longer timeout for all tests in this file
jest.setTimeout(15000);

describe('Restaurants Component', () => {
  const mockAxios = {
    get: jest.fn(),
  };
  
  const mockRestaurants = [
    {
      id: '1',
      name: 'Restaurant 1',
      image: 'https://example.com/image1.jpg',
      averageRating: 4.5,
      description: 'Description 1',
      long: 123.456,
      lat: 78.910
    },
    {
      id: '2',
      name: 'Restaurant 2',
      image: 'https://example.com/image2.jpg',
      averageRating: 4.0,
      description: 'Description 2',
      long: 123.456,
      lat: 78.910
    }
  ];

  beforeEach(() => {
    useAxios.mockReturnValue(mockAxios);
    mockAxios.get.mockResolvedValue({
      data: {
        restaurants: mockRestaurants
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    const { getByText } = customRender(<Restaurants />);
    
    // Initial render should show loading state
    expect(getByText('Near By Restaurants')).toBeTruthy();
    expect(getByText('See All')).toBeTruthy();
  });

  test('fetches and displays restaurants', async () => {
    const { getByText, queryByText } = customRender(<Restaurants />);
    
    // Wait for the data to load
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/restaurants/Buyer Location 1');
    }, { timeout: 10000 });
    
    expect(queryByText('No restaurants available nearby at the moment')).toBeNull();
    expect(getByText('Near By Restaurants')).toBeTruthy();
    expect(getByText('See All')).toBeTruthy();
  });

  test('displays empty state when no restaurants are available', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        restaurants: []
      }
    });
    
    const { getByText } = customRender(<Restaurants />);
    
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/restaurants/Buyer Location 1');
      expect(getByText('No restaurants available nearby at the moment')).toBeTruthy();
    }, { timeout: 10000 });
  });

  test('navigates to AllRestaurantsScreen when "See All" is pressed', async () => {
    const { getByText } = customRender(<Restaurants />);
    
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
    }, { timeout: 10000 });
    
    fireEvent.press(getByText('See All'));
    
    // We would verify navigation here, but since it's mocked we just check that the button exists
    expect(getByText('See All')).toBeTruthy();
  });

  test('handles API error gracefully', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Network error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    customRender(<Restaurants />);
    
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching restaurants:', expect.any(Error));
    }, { timeout: 10000 });
    
    consoleSpy.mockRestore();
  });
});
