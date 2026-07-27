/**
 * Shared TypeScript Types and Interfaces
 * Common types used across infrastructure files
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { QueryClient } from '@tanstack/react-query';
import type { User, UserCredential, ConfirmationResult, Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { RecaptchaVerifier as FirebaseRecaptchaVerifier } from 'firebase/auth';

/**
 * Firebase Configuration
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * API Client Types
 */
export type ApiClient = AxiosInstance;

export interface ApiRequestConfig extends AxiosRequestConfig {
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> extends AxiosResponse<T> {
  data: T;
}

export interface ApiError extends AxiosError {
  code?: string;
  originalError?: Error;
}

/**
 * Authentication Types
 */
export type RecaptchaVerifier = FirebaseRecaptchaVerifier;

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export type AuthStateCallback = (user: User | null) => void;
export type UnsubscribeFunction = () => void;

/**
 * Firebase Auth Helper Types
 */
export interface FirebaseAuthError extends Error {
  code?: string;
  originalError?: Error;
}

export interface OTPVerificationResult {
  confirmationResult: ConfirmationResult;
  verificationId?: string;
}

/**
 * Store Types (for interceptors)
 */
export interface StoreState {
  // Generic store state - can be extended as needed
  [key: string]: unknown;
}

/**
 * Recaptcha Callback Types
 */
export interface RecaptchaCallbacks {
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

/**
 * Query Client Configuration Types
 */
export interface QueryClientConfig {
  defaultOptions?: {
    queries?: {
      retry?: number | boolean;
      refetchOnWindowFocus?: boolean;
      staleTime?: number;
      gcTime?: number;
      enabled?: boolean;
    };
    mutations?: {
      retry?: number | boolean;
      gcTime?: number;
    };
  };
}

/**
 * API Service Response Types
 */
export interface ApiSuccessResponse<T = unknown> {
  status: string;
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  status: string;
  error?: string;
  message?: string;
}

/**
 * Authentication Service Types
 */
export interface CheckPhoneRequest {
  phone: string;
}

export interface CheckPhoneResponse {
  status: string;
  exists?: boolean;
  data?: unknown;
}

export interface SendOTPRequest {
  phone: string;
}

export interface SendOTPResponse {
  status: string;
  data?: unknown;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface VerifyOTPResponse {
  status: string;
  data?: {
    registrationToken?: string;
    token?: string;
  };
}

export interface CompleteRegistrationRequest {
  name: string;
  registrationToken: string;
}

export interface CompleteRegistrationResponse {
  status: string;
  data?: unknown;
}

/**
 * Cart Service Types
 */
export interface AddToCartRequest {
  productId: string;
  quantity?: number;
  storeId?: string;
}

export interface AddToCartResponse {
  status: string;
  data?: unknown;
}

export interface CartUpdateRequest {
  productId: string;
  quantity: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface GetCartResponse {
  status: string;
  data?: {
    items?: CartItem[];
    total?: number;
  };
}

export interface CheckoutSessionResponse {
  status: string;
  data?: unknown;
}

/**
 * Orders Service Types
 */
export interface GetOrdersParams {
  [key: string]: unknown;
}

export interface Order {
  _id: string;
  status: string;
  total: number;
  items?: CartItem[];
  [key: string]: unknown;
}

export interface GetOrdersResponse {
  data: Order[];
}

export interface OrderDetails {
  _id: string;
  status: string;
  total: number;
  items?: CartItem[];
  [key: string]: unknown;
}

export interface GetOrderByIdResponse {
  data: OrderDetails;
}

/**
 * User API Types
 */
export interface UserProfile {
  _id?: string;
  name: string;
  phoneNumber: string;
  email?: string;
  profileImage?: {
    url: string;
  };
  preferences?: {
    language?: string;
    notificationsEnabled?: boolean;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
  };
  loyaltyBalance?: {
    points: number;
    validUntil?: string;
  };
  savedPaymentMethods?: Array<{
    _id: string;
    cardLast4: string;
    expiryDate: string;
  }>;
}

export interface GetUserProfileResponse {
  status: string;
  data?: {
    user?: UserProfile;
    data?: {
      user?: UserProfile;
    };
  };
}

export interface UpdateLanguageRequest {
  language: string;
}

export interface UpdateNotificationsRequest {
  [key: string]: unknown;
}

export interface AddPaymentMethodRequest {
  cardLast4: string;
  expiryDate: string;
  cardholderName: string;
  isDefault?: boolean;
}

export interface UploadProfileImageRequest {
  file: File;
}

/**
 * MSG91 OTP Types
 */
export interface MSG91WidgetConfig {
  widgetId: string;
  tokenAuth: string;
  identifier: string;
  exposeMethods: boolean;
  success: (data: MSG91SuccessData) => void;
  failure: (error: MSG91ErrorData) => void;
}

export interface MSG91SuccessData {
  message: string;
  [key: string]: unknown;
}

export interface MSG91ErrorData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface SendOTPInitConfig {
  phoneNumber: string;
  onSuccess: (accessToken: string) => void;
  onFailure: (error: MSG91ErrorData) => void;
}

/**
 * Redux State Types
 */
export interface FirebaseUserData {
  uid: string;
  phoneNumber?: string;
  createdAt?: string;
}

export interface AuthStateType {
  user: unknown | null;
  token: string | null;
  firebaseUser: FirebaseUserData | null;
  isAuthenticated: boolean;
}

export interface ActiveStore {
  storeId: string;
  name?: string;
  storeName?: string;
  logo?: string;
  currency?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  phone?: string;
  phoneNumber?: string;
  status?: string;
}

export interface StoreStateType {
  activeStore: ActiveStore | null;
}

/**
 * Staff (Security Guard / Employee) auth state — kept fully separate from
 * the customer `auth` slice per the mobile app's "separate auth flows" requirement
 */
export interface StaffUser {
  actorType: 'guard' | 'employee';
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  shift?: string;
  storeId: string;
  storeName: string;
}

export interface StaffAuthStateType {
  staffUser: StaffUser | null;
  staffToken: string | null;
  isStaffAuthenticated: boolean;
}

export interface SetStaffAuthPayload {
  staffUser: StaffUser;
  staffToken: string;
}

export interface RootState {
  auth: AuthStateType;
  store: StoreStateType;
  staffAuth: StaffAuthStateType;
}

/**
 * Redux Action Payload Types
 */
export interface SetAuthPayload {
  user: unknown;
  token: string;
  firebaseUser?: FirebaseUserData;
}

export interface SetActiveStorePayload {
  storeId: string;
  name?: string;
  storeName?: string;
  logo?: string;
  currency?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  phone?: string;
  phoneNumber?: string;
  status?: string;
}

/**
 * Hook Types
 */

/**
 * Barcode Scanner Hook Types
 */
export type ScanSuccessCallback = (barcode: string) => void;
export type ScanErrorCallback = (error: Error) => void;

export interface BarcodeScannerHookResult {
  isInitialized: boolean;
  isScanning: boolean;
  error: string | null;
  torchOn: boolean;
  toggleTorch: () => Promise<void>;
  initializeScanner: () => Promise<void>;
  stopScanner: () => Promise<void>;
  restartScanner: () => Promise<void>;
}

/**
 * Cart Mutation Hook Params
 */
export interface AddToCartParams {
  productId: string;
  quantity?: number;
  storeId?: string;
}

export interface UpdateCartParams {
  productId: string;
  quantity: number;
}

/**
 * React Query Hook Config Types
 */
export interface BarcodeSearchOptions {
  [key: string]: unknown;
}

export interface ScanStoreOptions {
  [key: string]: unknown;
}

/**
 * Component Types
 */

/**
 * ProtectedRoute Component Props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * BottomNav Component Types
 */
export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  featured?: boolean;
}

export interface BottomNavItemProps {
  item: NavItem;
  active: boolean;
  cartCount?: number;
}

/**
 * Product Types
 */
export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  barcode?: string;
  sku?: string;
  brand?: string;
  price: number;
  costPrice?: number;
  discountPrice?: number;
  description?: string;
  category: string;
  unit?: string;
  tax?: number;
  currency?: string;
  storeId?: string;
  image?: string;
  stock?: number;
  status?: 'active' | 'inactive' | 'discontinued';
  createdBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ProductCardProps {
  product: Product | null;
  onAddToCart?: (quantity: number) => void;
  isAdding?: boolean;
  onScanAnother?: () => void;
}

/**
 * ProfileImageUpload Component Types
 */
export interface ProfileImage {
  url: string;
  [key: string]: unknown;
}

export interface ProfileImageUploadProps {
  profileImage?: ProfileImage;
  onImageChange?: (imageData: ProfileImage | undefined) => void;
}

/**
 * ScannerOverlay Component Types
 */
export interface ScannerOverlayProps {
  isScanning?: boolean;
  scannedBarcode?: string | null;
}

/**
 * Page Component Types
 */

/**
 * Route parameters and page-specific types
 */
export interface OrderDetailsParams {
  orderId: string;
}

export interface PaymentSuccessParams {
  session_id: string;
}

/**
 * Form types for Login/Onboarding
 */
export interface LoginFormData {
  phoneNumber: string;
  otp: string;
  name: string;
}

/**
 * Dialog and Modal types
 */
export interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  color?: string;
  showChevron?: boolean;
  onClick?: () => void;
}

/**
 * Export types for Firebase instances
 */
export type FirebaseAppInstance = FirebaseApp;
export type AuthInstance = Auth;
export type QueryClientInstance = QueryClient;
export type UserInstance = User;
export type UserCredentialInstance = UserCredential;
export type ConfirmationResultInstance = ConfirmationResult;
