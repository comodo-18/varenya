import { useSyncExternalStore } from "react";
import type { Order } from "./types";

const ORDER_URL = process.env.NEXT_PUBLIC_ORDER_URL;

export interface AuthUser {
  username: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

let state: AuthState = { user: null, token: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): AuthState {
  return state;
}

function getServerSnapshot(): AuthState {
  return { user: null, token: null };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function parseJwtPayload(token: string): { sub: string; email?: string } | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function setSession(token: string) {
  const payload = parseJwtPayload(token);
  state = {
    token,
    user: payload
      ? { username: payload.sub, email: payload.email ?? "" }
      : null,
  };
  emit();
}

export async function login(
  username: string,
  password: string
): Promise<void> {
  const res = await fetch(`${ORDER_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Login failed");
  }
  const data = await res.json();
  setSession(data.token);
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${ORDER_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Registration failed");
  }
  const data = await res.json();
  setSession(data.token);
}

export function logout() {
  state = { user: null, token: null };
  emit();
}

export function getToken(): string | null {
  return state.token;
}

export interface OrderResult {
  ok: boolean;
  status: number;
  latencyMs: number;
  body?: Record<string, unknown>;
}

export async function placeOrder(
  productId: number,
  quantity: number
): Promise<OrderResult> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const start = Date.now();
  const res = await fetch(`${ORDER_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  const latencyMs = Date.now() - start;

  let body: Record<string, unknown> | undefined;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }
  return { ok: res.ok, status: res.status, latencyMs, body };
}

export async function getMyOrders(): Promise<Order[]> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${ORDER_URL}/api/orders/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to load orders: ${res.status}`);
  return res.json();
}
