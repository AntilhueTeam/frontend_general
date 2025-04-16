import axios from 'axios';

// Instancia de axios con la URL de la API desde la variable de entorno
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL, // Usando la variable de entorno
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Importante: permitir el envío de cookies
});

// Interceptor para manejar el error 401 (cuando el token ha expirado)
axiosInstance.interceptors.response.use(
  response => response,  // Si la respuesta es exitosa, la retorna tal cual
  async error => {
    const originalRequest = error.config;

    // Si el error es 401 (no autorizado) y la solicitud aún no ha sido intentada
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar obtener un nuevo access_token usando el refresh_token
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_AUTH_URL}/refresh`,
          {},
          { withCredentials: true } // Incluir cookies
        );

        // Obtener el nuevo token desde la respuesta
        const newAccessToken = refreshResponse.data.token;

        // Almacenar el nuevo access_token en las cookies (o donde prefieras)
        document.cookie = `access_token=${newAccessToken}; path=/`;

        // Reintentar la solicitud original con el nuevo access_token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Reintentar la solicitud original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación del token, redirigir al login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Si no es un error 401, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

export default axiosInstance;
