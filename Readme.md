# Generic E-Commerce App (Express)
This is the backend implementation of a generic e-commerce app, designed to handle CRUD operations on **products, categories, carts, orders, and users**. Database integration is handled by **Node-Postgres**. **Passport** is used for local authentication. This backend will eventually be integrated with a front-end to showcase my backend skills.

## Database Schema
A database is not provided in this repo. Users can create their own database to work with this API. The schema must be as follows:

**CARTS**
- id
- user_id
- items (a string representation of the items in the cart.)

**CATEGORIES**
- id
- name

**ORDERS**
- id
- user_id
- items (a string representation of the items in the cart.)
- delivery_address
- price

**PRODUCTS**
- id
- name
- price
- description
- category_id
- quantity_available
- image

**USERS**
- id
- username
- password (hashed)
- address
- admin (boolean)

## Priveleges
Certain users in this app can have admin privileges, meaning that they can perform certain actions such as adding new products, categories, etc. Admin users can also access the orders and carts of users other than themselves.

## OpenAPI Spec
The file `/server/openapi.yaml` contains the API specification for this app. More information about specific endpoints and their usage can be found there.

## Next Steps
- Refine the processes of input validation and error handling.
