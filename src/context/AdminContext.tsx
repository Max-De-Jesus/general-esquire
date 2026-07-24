"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  NewsItem,
  PaymentItem,
  ClientItem,
  INITIAL_NEWS,
  INITIAL_PAYMENTS,
  INITIAL_CLIENTS,
} from "@/data/adminStore";

interface AdminContextType {
  news: NewsItem[];
  payments: PaymentItem[];
  clients: ClientItem[];
  addNewsItem: (item: Omit<NewsItem, "id">) => void;
  updateNewsItem: (id: string, item: Partial<NewsItem>) => void;
  deleteNewsItem: (id: string) => void;
  addPaymentItem: (item: Omit<PaymentItem, "id">) => void;
  addClientItem: (item: Omit<ClientItem, "id">) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_NEWS = "ge_admin_news_v1";
const LOCAL_STORAGE_KEY_PAYMENTS = "ge_admin_payments_v1";
const LOCAL_STORAGE_KEY_CLIENTS = "ge_admin_clients_v1";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [clients, setClients] = useState<ClientItem[]>(INITIAL_CLIENTS);

  // Load from localStorage on client side
  useEffect(() => {
    try {
      const savedNews = localStorage.getItem(LOCAL_STORAGE_KEY_NEWS);
      if (savedNews) {
        setNews(JSON.parse(savedNews));
      }

      const savedPayments = localStorage.getItem(LOCAL_STORAGE_KEY_PAYMENTS);
      if (savedPayments) {
        setPayments(JSON.parse(savedPayments));
      }

      const savedClients = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      }
    } catch (e) {
      console.error("Error reading admin store from localStorage", e);
    }
  }, []);

  // Save changes to localStorage
  const saveNewsToStorage = (updated: NewsItem[]) => {
    setNews(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NEWS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save news to localStorage", e);
    }
  };

  const addNewsItem = (item: Omit<NewsItem, "id">) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
    };
    const updated = [newItem, ...news];
    saveNewsToStorage(updated);
  };

  const updateNewsItem = (id: string, updatedFields: Partial<NewsItem>) => {
    const updated = news.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveNewsToStorage(updated);
  };

  const deleteNewsItem = (id: string) => {
    const updated = news.filter((item) => item.id !== id);
    saveNewsToStorage(updated);
  };

  const addPaymentItem = (item: Omit<PaymentItem, "id">) => {
    const newPayment: PaymentItem = {
      ...item,
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    const updated = [newPayment, ...payments];
    setPayments(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PAYMENTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save payments to localStorage", e);
    }
  };

  const addClientItem = (item: Omit<ClientItem, "id">) => {
    const newClient: ClientItem = {
      ...item,
      id: `CLI-${Math.floor(100 + Math.random() * 900)}`,
    };
    const updated = [newClient, ...clients];
    setClients(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save clients to localStorage", e);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        news,
        payments,
        clients,
        addNewsItem,
        updateNewsItem,
        deleteNewsItem,
        addPaymentItem,
        addClientItem,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
