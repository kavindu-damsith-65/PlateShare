// export const dishes = [{"_createdAt": "2023-02-12T20:09:25Z", "_id": "cda89636-582b-4c51-8634-4b38d88bf542", "_rev": "y9vPMxf9gLnmeHqu0wpdaK", "_type": "dish", "_updatedAt": "2023-02-12T20:09:25Z", "image": {"_type": "image", "asset": [Object]}, "name": "Sesame Noodles", "price": 245, "short_description": "A savory dish of Chinese-style noodles cooked with garlic, ginger, and sesame oil and served in a hot sizzling platter."}, {"_createdAt": "2023-02-10T16:53:58Z", "_id": "4ef33936-7846-4221-9c35-d527c6187a62", "_rev": "ldD1Qs3NBckfiopg82Rqij", "_type": "dish", "_updatedAt": "2023-02-12T19:16:27Z", "image": {"_type": "image", "asset": [Object]}, "name": "Toranino Taco", "price": 349, "short_description": "Toranino Taco is a Toronto-based Mexican food truck that offers a range of delicious tacos, burritos, quesadillas, and other Mexican-inspired dishes"}, {"_createdAt": "2023-02-17T19:02:22Z", "_id": "e3f1a156-001a-4fe6-ae87-a4c3cbd70fac", "_rev": "I13aVDhieoHVSVfjQjywRw", "_type": "dish", "_updatedAt": "2023-02-17T19:02:22Z", "image": {"_type": "image", "asset": [Object]}, "name": " Pesto Penne", "price": 238, "short_description": "A classic Italian dish of penne pasta mixed with a flavorful pest,o sauce."}]


// Initial requests data
export const requestsData = [
  { 
    id: '1', 
    title: 'Food Bank #1', 
    requestType: 'General',
    numberOfPeople: 30,
    preferredFoodTypes: ['Bread', 'Vegetables'],
    deliveryNeeded: true,
    requestByDateTime: '2023-11-30T18:00:00',
    additionalNotes: 'Please ensure food is packaged separately',
    visibility: 'Public',
    status: 'pending', 
    time: '2 hours ago' 
  },
  { 
    id: '2', 
    title: 'Shelter #42', 
    requestType: 'Specific',
    numberOfPeople: 15,
    preferredFoodTypes: ['Canned goods', 'Fruits'],
    deliveryNeeded: false,
    requestByDateTime: '2023-11-29T12:00:00',
    additionalNotes: 'Need vegetarian options',
    visibility: 'Private',
    status: 'pending', 
    time: '3 hours ago' 
  },
  { 
    id: '3', 
    title: 'Community Center', 
    requestType: 'Urgent',
    numberOfPeople: 50,
    preferredFoodTypes: ['Rice', 'Pasta'],
    deliveryNeeded: true,
    requestByDateTime: '2023-11-28T19:00:00',
    additionalNotes: '',
    visibility: 'Public',
    status: 'pending', 
    time: '5 hours ago' 
  },
];

// Function to add a new request
export const addRequest = (request) => {
  const newRequest = {
    id: Date.now().toString(),
    ...request,
    status: 'pending',
    time: 'just now'
  };
  requestsData.unshift(newRequest); // Add to beginning of array
  return newRequest;
};

// Function to update an existing request
export const updateRequest = (id, updatedData) => {
  const index = requestsData.findIndex(req => req.id === id);
  if (index !== -1) {
    requestsData[index] = { 
      ...requestsData[index], 
      ...updatedData,
      time: 'just now' 
    };
    return requestsData[index];
  }
  return null;
};

// Function to delete a request
export const deleteRequest = (id) => {
  const index = requestsData.findIndex(req => req.id === id);
  if (index !== -1) {
    requestsData.splice(index, 1);
    return true;
  }
  return false;
};
