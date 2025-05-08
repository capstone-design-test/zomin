# 빌드 단계
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 실행 단계
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
