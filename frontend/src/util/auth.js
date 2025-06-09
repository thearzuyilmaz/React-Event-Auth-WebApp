 import { redirect } from "react-router-dom";

 export function getTokenDuration() {
    // Browser kontrolü ekle
    if (typeof window === 'undefined') {
      return 0; // Server-side'da 0 döndür
    }
    
    const storedExpirationDate = localStorage.getItem('expiration');
    
    if (!storedExpirationDate) {
      return 0; // Expiration yoksa 0 döndür
    }
    
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
 }
 
 export default function getAuthToken() {
    // Browser kontrolü ekle
    if (typeof window === 'undefined') {
      return null;
    }
    
    const token = localStorage.getItem('token');
    const tokenDuration = getTokenDuration();
 
    if (!token) {
        return null; // undefined yerine null döndür
    }
 
    if (tokenDuration < 0) {
        return 'EXPIRED';
    }
 
    return token;
 }
 export function tokenLoader() {
    return getAuthToken();
 }

 export function checkAuthLoader() {

    const token = getAuthToken();
    
    if (!token) {
      return redirect('/auth');
    }
   
    return null; // null döndürmek "veri yok ama problem yok" 
  }