# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the Angular build output
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
