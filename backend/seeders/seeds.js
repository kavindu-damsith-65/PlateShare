'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
          profile_picture: `buyer${index + 1}.jpg`,
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
          location: `Seller Location ${index + 1}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

    await queryInterface.bulkInsert('seller_details', sellers);

    const restaurants = [];
    sellers.forEach((seller, index) => {
      const numberOfRestaurants = Math.floor(Math.random() * 3) + 1; // 1 to 3 restaurants per seller
      for (let i = 1; i <= numberOfRestaurants; i++) {
        restaurants.push({
          id: `restaurant_${seller.user_id}_${i}`,
          name: `Restaurant ${index + 1}-${i}`,
          user_id: seller.user_id, // Linking the restaurant to the seller
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert('restaurants', restaurants);

      const products = restaurants.flatMap(restaurant => [
          {
              id: `p1_${restaurant.id}`,
              name: 'Rice & Curry',
              type: false,
              available: true,
              quantity: 10,
              restaurant_id: restaurant.id, // Linking to the current restaurant
              has_subs: true,
              image: 'rice_curry.jpg',
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
              image: 'fried_rice.jpg',
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
              image: 'burger.jpg',
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
              image: 'pizza.jpg',
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
              image: 'pasta.jpg',
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
              image: 'rice.jpg',
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
              image: 'dhal.jpg',
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
              image: 'chicken_curry.jpg',
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
              image: 'mango_chutney.jpg',
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
              image: 'egg.jpg',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ]);

      await queryInterface.bulkInsert('sub_products', subProducts);

      const productSubProducts = [];

      restaurants.forEach(restaurant => {
          // Find all products and sub-products for the current restaurant
          const restaurantProducts = products.filter(product => product.restaurant_id === restaurant.id && product.has_subs === true);
          const restaurantSubProducts = subProducts.filter(subProduct => subProduct.restaurant_id === restaurant.id);

          // Loop through the products and sub-products to create combinations
          restaurantProducts.forEach(product => {
              restaurantSubProducts.forEach(subProduct => {
                  productSubProducts.push({
                      product_id: product.id, // Link to the product
                      subproduct_id: subProduct.id, // Link to the sub-product
                      quantity: Math.floor(Math.random() * 3) + 1, // Random quantity (1 to 3)
                      image: `${product.name.toLowerCase().replace(/\s+/g, '_')}_combo.jpg`, // Generate image based on product name
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
  },
};
