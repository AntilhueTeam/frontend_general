import { create } from 'zustand';
import axios from "@/utils/axiosConfig"; 

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    try {
      const response = await axios.get('validate', {
        withCredentials: true, // Enviar cookies al backend
      });

      set((state) => {
        // Solo actualizamos si el estado de autenticación cambia
        if (state.isAuthenticated !== true) {
          return { isAuthenticated: true };
        }
        return {}; // No actualizamos nada si no hubo cambio
      });
    } catch (error) {
      set((state) => {
        // Solo actualizamos si el estado de autenticación cambia
        if (state.isAuthenticated !== false) {
          return { isAuthenticated: false };
        }
        return {}; // No actualizamos nada si no hubo cambio
      });
    } finally {
      set({ loading: false }); // Siempre marcamos loading como false
    }
  }
}));

export default useAuthStore;
