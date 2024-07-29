# Použij oficiální Node.js image jako základ
FROM node:22-alpine3.19 as build

# Nastav pracovní adresář uvnitř kontejneru
WORKDIR /app

# Zkopíruj package.json a package-lock.json do pracovního adresáře
COPY package*.json ./

# Nainstaluj závislosti
RUN npm install

# Zkopíruj zbytek zdrojového kódu do pracovního adresáře
COPY . .

# Vytvoř produkční build React aplikace
RUN npm run build

# Použij oficiální nginx image jako základ pro produkční server
FROM nginx:1.27.0-alpine

# Zkopíruj sestavený React build z předchozího kroku
COPY --from=build /app/dist /usr/share/nginx/html

# Zkopíruj vlastní konfiguraci Nginx (volitelné)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponuj port, na kterém poběží aplikace
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]