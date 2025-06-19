'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to get random picsum image URL
    const getRandomPicsumImage = () => `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`;
    // pass =1234
    const users = [
        { id: 'user_1', email:'buyer1@example.com',name:'Ross', role: 'buyer', profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_2', email:'seller1@example.com',name:'Monica', role: 'seller',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_3', email:'org1@example.com',name:'Rachel', role: 'org',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_4', email:'admin@example.com',name:'Pheobe', role: 'admin',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_5', email:'seller2@example.com',name:'Chandler', role: 'seller',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_6', email:'buyer2@example.com',name:'Joey', role: 'buyer',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_7', email:'seller3@example.com',name:'Ben', role: 'seller',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_8', email:'buyer3@example.com',name:'Paul', role: 'buyer',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_9', email:'seller4@example.com',name:'Riana', role: 'seller',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_10', email:'buyer4@example.com',name:'Ashka', role: 'buyer',profile_picture: getRandomPicsumImage(), verified: 1, password: '$2b$12$K3j3nRkfJW2JMxxxuPNkFO/TN0.XFLzWl5WbrW.vKZKtWBmlqoYLm', createdAt: new Date(), updatedAt: new Date() },
      ];

    await queryInterface.bulkInsert('users', users);

    const buyers = users
        .filter(user => user.role === 'buyer')
        .map((buyer, index) => ({
          user_id: buyer.id,
          // name: `Buyer ${index + 1}`,
          // email: `buyer${index + 1}@example.com`,
            email: buyer.email,
          phone: `123456789${index + 1}`,
          address: `Buyer Address ${index + 1}`,
          location: `Buyer Location ${index + 1}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

    await queryInterface.bulkInsert('buyer_details', buyers);

    const sellers = users
        .filter(user => user.role === 'seller')
        .map((seller, index) => ({
          user_id: seller.id,
          // name: `Seller ${index + 1}`,
          // email: `seller${index + 1}@example.com`,
            email: seller.email,
            phone: `987654321${index + 1}`,
            address: `Seller Address ${index + 1}`,
            additional_images: JSON.stringify([
                getRandomPicsumImage(),
                getRandomPicsumImage(),
                getRandomPicsumImage(),
                getRandomPicsumImage()
            ]),
            location: 'Buyer Location 1',
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

    await queryInterface.bulkInsert('seller_details', sellers);
      
      
      const restaurants = sellers.map((seller, index) => ({
          id: `restaurant_${seller.user_id}`, // Only one restaurant per seller
          name: `Restaurant ${index + 1}`,
          user_id: seller.user_id, // Linking the restaurant to the seller
          image: getRandomPicsumImage(),
          description: 'A cozy place where delicious food and a warm atmosphere.',
          createdAt: new Date(),
          updatedAt: new Date(),
      }));

    await queryInterface.bulkInsert('restaurants', restaurants);

    let ReviewId = 1;
    const reviews = restaurants.flatMap((restaurant, index) => [
        {
          id: ReviewId++,
          description: `Great food and excellent service at ${restaurant.name}.`,
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
          restaurant_id: restaurant.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          user_id: `user_${Math.floor(Math.random() * 10) + 1}`,
        },
        {
          id: ReviewId++,
          description: `The ambiance at ${restaurant.name} is amazing.`,
          rating: Math.floor(Math.random() * 5) + 1,
          restaurant_id: restaurant.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          user_id: `user_${Math.floor(Math.random() * 10) + 1}`,
        },
      ]);

    await queryInterface.bulkInsert("reviews", reviews);

      // Define categories
      const categories = [
          { id: 'cat_1', category: 'Pizza', image: getRandomPicsumImage() },
          { id: 'cat_2', category: 'Burgers', image: getRandomPicsumImage() },
          { id: 'cat_3', category: 'Salads', image: getRandomPicsumImage() },
          { id: 'cat_4', category: 'Pasta', image: getRandomPicsumImage() },
          { id: 'cat_5', category: 'Rice', image: getRandomPicsumImage() },
          { id: 'cat_6', category: 'Desserts', image: getRandomPicsumImage() },
          { id: 'cat_7', category: 'Drinks', image: getRandomPicsumImage() },
          { id: 'cat_8', category: 'Breakfast', image: getRandomPicsumImage() },
      ];

      // Insert categories
      await queryInterface.bulkInsert('categories', categories.map(cat => ({
          ...cat,
          createdAt: new Date(),
          updatedAt: new Date()
      })));

      // Updated products with categories
      const products = restaurants.flatMap(restaurant => [
          {
              id: `p1_${restaurant.id}`,
              name: 'Rice & Curry',
              type: false,
              available: true,
              quantity: 10,
              restaurant_id: restaurant.id,
              has_subs: true,
              image: getRandomPicsumImage(),
              price: 8.99,
              description: 'A traditional rice dish served with a variety of curries.',
              category_id: 'cat_5', // Rice category
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `p2_${restaurant.id}`,
              name: 'Fried Rice',
              type: false,
              available: true,
              quantity: 15,
              restaurant_id: restaurant.id,
              has_subs: true,
              image: getRandomPicsumImage(),
              price: 10.99,
              description: 'Delicious stir-fried rice with vegetables and protein.',
              category_id: 'cat_5', // Rice category
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `p3_${restaurant.id}`,
              name: 'Burger',
              type: false,
              available: true,
              quantity: 20,
              restaurant_id: restaurant.id,
              has_subs: false,
              image: getRandomPicsumImage(),
              price: 6.99,
              description: 'A juicy beef or chicken burger served with fresh toppings.',
              category_id: 'cat_2', // Burgers category
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `p4_${restaurant.id}`,
              name: 'Pizza',
              type: false,
              available: true,
              quantity: 8,
              restaurant_id: restaurant.id,
              has_subs: false,
              image: getRandomPicsumImage(),
              price: 12.99,
              description: 'Classic Italian-style pizza with various toppings.',
              category_id: 'cat_1', // Pizza category
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `p5_${restaurant.id}`,
              name: 'Pasta',
              type: false,
              available: true,
              quantity: 12,
              restaurant_id: restaurant.id,
              has_subs: false,
              image: getRandomPicsumImage(),
              price: 9.99,
              description: 'Creamy or tomato-based pasta with cheese and herbs.',
              category_id: 'cat_4', // Pasta category
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ]);

    await queryInterface.bulkInsert('products', products);

      const subProducts = restaurants.flatMap(restaurant => [
          {
              id: `s1_${restaurant.id}`,
              name: 'Rice',
              type: false,
              available: true,
              restaurant_id: restaurant.id,
              price: 2.00,
              image: getRandomPicsumImage(),
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `s2_${restaurant.id}`,
              name: 'Dhal',
              type: false,
              available: true,
              restaurant_id: restaurant.id,
              price: 1.50,
              image: getRandomPicsumImage(),
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `s3_${restaurant.id}`,
              name: 'Chicken Curry',
              type: false,
              available: true,
              restaurant_id: restaurant.id,
              price: 3.00,
              image: getRandomPicsumImage(),
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `s4_${restaurant.id}`,
              name: 'Mango Chutney',
              type: false,
              available: true,
              restaurant_id: restaurant.id,
              price: 1.00,
              image: getRandomPicsumImage(),
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          {
              id: `s5_${restaurant.id}`,
              name: 'Egg',
              type: false,
              available: true,
              restaurant_id: restaurant.id,
              price: 1.50,
              image: getRandomPicsumImage(),
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ]);
    await queryInterface.bulkInsert('sub_products', subProducts);

      const productSubProducts = [];

      let idCounter = 1; // Initialize an ID counter

      restaurants.forEach(restaurant => {
          // Find all products and sub-products for the current restaurant
          const restaurantProducts = products.filter(product => product.restaurant_id === restaurant.id && product.has_subs === true);
          const restaurantSubProducts = subProducts.filter(subProduct => subProduct.restaurant_id === restaurant.id);

          // Loop through the products and sub-products to create combinations
          restaurantProducts.forEach(product => {
              restaurantSubProducts.forEach(subProduct => {
                  productSubProducts.push({
                      id: idCounter++, // Assign a unique ID and increment
                      product_id: product.id, // Link to the product
                      subproduct_id: subProduct.id, // Link to the sub-product
                      quantity: Math.floor(Math.random() * 3) + 1, // Random quantity (1 to 3)
                      image: getRandomPicsumImage(),
                      createdAt: new Date(),
                      updatedAt: new Date(),
                  });
              });
          });
      });


    await queryInterface.bulkInsert('product_subproducts', productSubProducts);

    // Create organization details for the organization user
    const organizations = users
        .filter(user => user.role === 'org')
        .map((org, index) => ({
          user_id: org.id,
          email:org.email,
          phone: `555123456${index + 1}`,
          address: `Organization Address ${index + 1}`,
          location: `Organization Location ${index + 1}`,
          description: `A non-profit organization dedicated to helping the community.`,
          additional_images: JSON.stringify([
            getRandomPicsumImage(),
            getRandomPicsumImage(),
            getRandomPicsumImage(),
            getRandomPicsumImage()
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

    await queryInterface.bulkInsert('org_details', organizations);

    // Create food requests
    const foodRequests = [];
    let requestId = 1;

    organizations.forEach(org => {
      // Create 3 food requests for each organization
      for (let i = 1; i <= 3; i++) {
        foodRequests.push({
          id: requestId++,
          org_details_user_id: org.user_id,
          title: `Food Request ${i} from ${org.user_id}`,
          products: `Rice, Vegetables, Canned Goods`,
          quantity: Math.floor(Math.random() * 50) + 10,
          completed: i === 3, // Mark the last one as completed
          dateTime: new Date(new Date().getTime() + (i * 24 * 60 * 60 * 1000)), // Future dates
          notes: `Please deliver by ${i} PM if possible.`,
          visibility: true,
          urgent: i === 1, // First one is urgent
          delivery: i !== 2, // All except the second one need delivery
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert('food_requests', foodRequests);

    // Create donations linked to food requests and products
    const donations = [];
    let donationId = 1;

    foodRequests.forEach(request => {
      // Get random products to donate to this request
      const randomProducts = products
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, 3); // Take first 3 items

      randomProducts.forEach(product => {
        donations.push({
          id: donationId++,
          food_request_id: request.id,
          product_id: product.id,
          quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1-5
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    await queryInterface.bulkInsert('donations', donations);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('donations', null, {});
    await queryInterface.bulkDelete('food_requests', null, {});
    await queryInterface.bulkDelete('org_details', null, {});
    await queryInterface.bulkDelete('restaurants', null, {});
    await queryInterface.bulkDelete('seller_details', null, {});
    await queryInterface.bulkDelete('buyer_details', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('product_subproducts', null, {});
    await queryInterface.bulkDelete('sub_products', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
