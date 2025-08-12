# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the Angular build output (replace 'frontend-app-angular' with your actual folder name)
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy custom Nginx config to enable Angular routing (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]