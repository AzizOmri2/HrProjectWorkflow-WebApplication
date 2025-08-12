# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the Angular build output (matches your angular.json outputPath)
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]