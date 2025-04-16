# Usa una versión compatible con Next.js
FROM node:20-alpine

WORKDIR /app

# Copia los archivos de la aplicación
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto de los archivos
COPY . .

# Construcción de la aplicación
RUN npm run build

# Expone el puerto de Next.js
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "start"]
