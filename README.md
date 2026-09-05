<div align="center">

# PlateShare

**A multi-role mobile platform for redistributing food instead of wasting it.**

<img src="https://img.shields.io/badge/University_mobile--application_project-4F86FF?style=flat-square&labelColor=0B1224" alt="University mobile-application project" /> <img src="https://img.shields.io/badge/Public_repository-4F86FF?style=flat-square&labelColor=0B1224" alt="Public repository" />

[Portfolio](https://kavindudamsith.tech/) &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/kavindu-damsith-86696722a/) &nbsp;|&nbsp; [Email](mailto:kavindudamsith65@gmail.com)

</div>

---

## Overview

PlateShare connects food sellers and donors with buyers, delivery partners, and charity organisations. The Expo application and Express API cover discovery, requests, orders, delivery, communication, maps, media, and payment workflows.

## My contribution

I primarily developed the buyer module and fully implemented the organisation and delivery functionality.

## What it does

| Area | Details |
| --- | --- |
| **Buyer experience** | Nearby food, restaurants, search, basket, checkout, profiles, recommendations, and reviews. |
| **Seller and donor tools** | Menus, donations, orders, requests, and dashboard views. |
| **Organisation workflows** | Donation requests, request history, and organisation-specific actions. |
| **Delivery operations** | Available orders, delivery status, history, profile, and navigation. |
| **Platform services** | Authentication, uploads, mail, Stripe, Sanity media, and MySQL data. |

## Repository map

| Path | Purpose |
| --- | --- |
| `app/screens/` | Role-specific mobile screens for buyers, sellers, organisations, and delivery users. |
| `app/components/` | Reusable cards, forms, menus, reviews, and request components. |
| `app/navigation/` | Application and role navigation. |
| `backend/controllers/ and routes/` | Account, food, order, organisation, delivery, mail, upload, and payment services. |
| `backend/models/` | Sequelize data models backed by MySQL. |

## Technology

- **React Native**
- **Expo**
- **Node.js**
- **Express**
- **Sequelize**
- **MySQL**
- **Stripe**
- **Sanity**

## Local setup

```bash
cd backend && npm install
npm run dev
# In another terminal
cd app && npm install
npm start
```

### Configuration notes

Set local API, database, JWT, Stripe, mail, media, and map-related values before running the complete application.

## Status

University mobile-application project.

## Links

- [Portfolio case study](https://kavindudamsith.tech/#work)

---

Questions about this repository? [Email me](mailto:kavindudamsith65@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/kavindu-damsith-86696722a/).
