// Exemples d'utilisation du proxy API via les routes Next.js
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-proxy';

// === EXEMPLES AVEC MICROSERVICE USER ===

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Exemples d'utilisation
export const userServiceExamples = {
  // GET /api/users -> va appeler localhost:8080/users
  async getAllUsers() {
    return await apiGet<User[]>('/users');
  },

  // GET /api/users/123 -> va appeler localhost:8080/users/123
  async getUserById(id: string) {
    return await apiGet<User>(`/users/${id}`);
  },

  // GET /api/users/me -> va appeler localhost:8080/users/me
  async getCurrentUser() {
    return await apiGet<User>('/users/me');
  },

  // POST /api/users -> va appeler localhost:8080/users
  async createUser(userData: CreateUserRequest) {
    return await apiPost<User>('/users', userData);
  },

  // PUT /api/users/123 -> va appeler localhost:8080/users/123
  async updateUser(id: string, userData: Partial<User>) {
    return await apiPut<User>(`/users/${id}`, userData);
  },

  // DELETE /api/users/123 -> va appeler localhost:8080/users/123
  async deleteUser(id: string) {
    return await apiDelete(`/users/${id}`);
  },

  // GET /api/users?page=1&size=10 -> va appeler localhost:8080/users?page=1&size=10
  async getUsersWithPagination(page: number = 1, size: number = 10) {
    return await apiGet<{ users: User[]; total: number }>(`/users?page=${page}&size=${size}`);
  }
};

// === EXEMPLE AVEC AUTRES MICROSERVICES ===

export const productServiceExamples = {
  // GET /api/products -> va appeler localhost:8080/products
  async getAllProducts() {
    return await apiGet('/products');
  },

  // POST /api/products -> va appeler localhost:8080/products
  async createProduct(productData: any) {
    return await apiPost('/products', productData);
  }
};

export const orderServiceExamples = {
  // GET /api/orders -> va appeler localhost:8080/orders
  async getAllOrders() {
    return await apiGet('/orders');
  },

  // POST /api/orders -> va appeler localhost:8080/orders
  async createOrder(orderData: any) {
    return await apiPost('/orders', orderData);
  }
};

// Export par défaut
export default userServiceExamples;