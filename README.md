# 📦 Product API – Express.js Assignment

## 🚀 How to Run the Server

1. **Install dependencies**  
   ```sh
   npm install
   ```

2. **Start MongoDB**  
   Make sure MongoDB is running locally on `mongodb://localhost:27017/productsdb`.

3. **Run the server**  
   ```sh
   npm start
   ```
   The server will run at [http://localhost:3000](http://localhost:3000).

---

## 📚 API Endpoints

All endpoints require API key in the header:  
`x-api-key: my-secret-api-key`

### Root

- **GET /**  
  Returns a welcome message.

---

### Products

- **GET /api/products**  
  List all products (supports pagination and filtering by category).
  - Query params:  
    - `page` (number, optional)  
    - `limit` (number, optional)  
    - `category` (string, optional)

- **GET /api/products/:id**  
  Get a product by ID.

- **POST /api/products**  
  Create a new product.  
  - Body:  
    ```json
    {
      "name": "Product Name",
      "description": "Description",
      "price": 99.99,
      "category": "Category",
      "inStock": true
    }
    ```

- **PUT /api/products/:id**  
  Update an existing product.  
  - Body: same as POST.

- **DELETE /api/products/:id**  
  Delete a product.

---

### Advanced

- **GET /api/products/search?name=term**  
  Search products by name.

- **GET /api/products/stats**  
  Get product count by category.

---

## 🧪 Example Requests & Responses

### Create a Product

**Request**
```sh
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{"name":"Laptop","description":"A fast laptop","price":1200,"category":"Electronics","inStock":true}'
```

**Response**
```json
{
  "_id": "665f1c7e2e8b8c0012a3b456",
  "name": "Laptop",
  "description": "A fast laptop",
  "price": 1200,
  "category": "Electronics",
  "inStock": true,
  "createdAt": "2024-06-06T12:00:00.000Z",
  "updatedAt": "2024-06-06T12:00:00.000Z",
  "__v": 0
}
```

---

### Get All Products (Paginated)

**Request**
```sh
curl -H "x-api-key: my-secret-api-key" http://localhost:3000/api/products?page=1&limit=2
```

**Response**
```json
{
  "page": 1,
  "limit": 2,
  "total": 5,
  "totalPages": 3,
  "products": [
    {
      "_id": "665f1c7e2e8b8c0012a3b456",
      "name": "Laptop",
      "description": "A fast laptop",
      "price": 1200,
      "category": "Electronics",
      "inStock": true,
      "createdAt": "2024-06-06T12:00:00.000Z",
      "updatedAt": "2024-06-06T12:00:00.000Z",
      "__v": 0
    }
    // ...
  ]
}
```

---

### Error Example (Missing API Key)

**Response**
```json
{
  "error": "ValidationError",
  "message": "Invalid or missing API key"
}
```

---

## 📝 Notes

- All endpoints require the `x-api-key` header.
- For more advanced usage, see `/api/products/search` and `/api/products/stats`.
- For development, use [Postman](https://www.postman.com/) or `curl` for testing.