import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CartItem } from '../types';

// TODO: Remplacez ces valeurs par votre configuration Firebase réelle
// Vous pouvez les trouver dans la console Firebase > Project Settings > General
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "VOTRE_API_KEY",
  authDomain: "bar-le-jockey.firebaseapp.com",
  projectId: "bar-le-jockey",
  storageBucket: "bar-le-jockey.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialisation de Firebase
// Note: Nous utilisons un try/catch pour éviter que l'app plante si la config est absente
let db: any = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase n'a pas pu être initialisé. Vérifiez votre configuration.", error);
}

export interface OrderData {
  customerName: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: 'DEBIT' | 'CASH';
  language: 'fr' | 'en';
  status: 'pending' | 'completed' | 'cancelled';
}

export const submitOrderToFirebase = async (orderData: OrderData) => {
  if (!db) {
    console.error("Firestore database not initialized");
    // Simulation pour le développement si pas de DB
    // Reduced delay to 500ms for snappier UI
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  try {
    // Nettoyage des données avant envoi (suppression des champs undefined si nécessaire)
    const cleanItems = orderData.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      type: item.type
    }));

    const docRef = await addDoc(collection(db, "orders"), {
      customerName: orderData.customerName,
      items: cleanItems,
      totalPrice: orderData.totalPrice,
      paymentMethod: orderData.paymentMethod,
      language: orderData.language,
      status: 'pending',
      createdAt: serverTimestamp(), // Timestamp serveur pour l'ordre chronologique
      userAgent: navigator.userAgent // Utile pour le debug
    });

    console.log("Order written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};