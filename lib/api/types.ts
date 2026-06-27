import type { components } from "@/types/api";

// List DTO
export type ProductSummary =
  components["schemas"]["Commerce.Contracts.Products.ProductsResponse"];

// Detail DTO
export type Product =
  components["schemas"]["Commerce.Contracts.Products.ProductResponse"];

export type ProductImage =
  components["schemas"]["Commerce.Contracts.ProductImages.ProductImageResponse"];

export type ProductSpecification =
  components["schemas"]["Commerce.Contracts.Products.ProductSpecification"];

export type Order =
  components["schemas"]["Commerce.Contracts.Orders.OrderResponse"];

export type OrderItem =
  components["schemas"]["Commerce.Contracts.Orders.OrderItemResponse"];

export type Cart =
  components["schemas"]["Commerce.Contracts.Carts.CartResponse"];

export type CartItem =
  components["schemas"]["Commerce.Contracts.Carts.CartItemResponse"];

export type AuthResponse =
  components["schemas"]["Commerce.Contracts.Auth.AuthResponse"];

export type CheckoutResponse =
  components["schemas"]["Commerce.Contracts.Orders.CheckoutResponse"];

export type ErrorResponse =
  components["schemas"]["Commerce.Contracts.Common.ErrorResponse"];

// Pagination wrapper
export type PagedResponse<T> = {
  data?: T[] | null;
  pagination?: components["schemas"]["Commerce.Contracts.Common.PaginationMeta"];
};

export type User =
  components["schemas"]["Commerce.Contracts.Auth.UserResponse"];

export type LoginRequest =
  components["schemas"]["Commerce.Contracts.Auth.LoginRequest"];

export type RegisterRequest =
  components["schemas"]["Commerce.Contracts.Auth.RegisterRequest"];

export type Address =
  components["schemas"]["Commerce.Contracts.Addresses.AddressResponse"];

export type AddressRequest =
  components["schemas"]["Commerce.Contracts.Addresses.AddressRequest"];

export type RatingResponse = components['schemas']['Commerce.Contracts.Ratings.RatingResponse'];
