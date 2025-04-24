'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Helper function to get random picsum image URL
    const getRandomPicsumImage = () => `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`;

    const users = [
        { id: 'user_1', role: 'buyer', verified: 1, password: 'hashedpassword1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_2', role: 'seller', verified: 1, password: 'hashedpassword2', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_3', role: 'organization', verified: 1, password: 'hashedpassword3', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_4', role: 'admin', verified: 1, password: 'hashedpassword4', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_5', role: 'seller', verified: 1, password: 'hashedpassword5', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_6', role: 'buyer', verified: 1, password: 'hashedpassword6', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_7', role: 'seller', verified: 1, password: 'hashedpassword7', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_8', role: 'buyer', verified: 1, password: 'hashedpassword8', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_9', role: 'seller', verified: 1, password: 'hashedpassword9', createdAt: new Date(), updatedAt: new Date() },
        { id: 'user_10', role: 'buyer', verified: 1, password: 'hashedpassword10', createdAt: new Date(), updatedAt: new Date() },
      ];  

    await queryInterface.bulkInsert('users', users);

    const buyers = users
        .filter(user => user.role === 'buyer')
        .map((buyer, index) => ({
          user_id: buyer.id,
          name: `Buyer ${index + 1}`,
          email: `buyer${index + 1}@example.com`,
          phone: `123456789${index + 1}`,
          address: `Buyer Address ${index + 1}`,
          location: `Buyer Location ${index + 1}`,
          profile_picture: getRandomPicsumImage(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

    await queryInterface.bulkInsert('buyer_details', buyers);

    const sellers = users
        .filter(user => user.role === 'seller')
        .map((seller, index) => ({
          user_id: seller.id,
          name: `Seller ${index + 1}`,
          email: `seller${index + 1}@example.com`,
          phone: `987654321${index + 1}`,
          address: `Seller Address ${index + 1}`,
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

      const products = restaurants.flatMap(restaurant => [
          {
              id: `p1_${restaurant.id}`,
              name: 'Rice & Curry',
              type: false,
              available: true,
              quantity: 10,
              restaurant_id: restaurant.id, // Linking to the current restaurant
              has_subs: true,
              image: getRandomPicsumImage(),
              price: 8.99,
              description: 'A traditional rice dish served with a variety of curries.',
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

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurants', null, {});
    await queryInterface.bulkDelete('seller_details', null, {});
    await queryInterface.bulkDelete('buyer_details', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('product_subproducts', null, {});
    await queryInterface.bulkDelete('sub_products', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
  },
};
