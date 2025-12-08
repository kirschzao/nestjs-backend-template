FROM node:24.1-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY prisma ./prisma/
COPY nest-cli.json ./ 
COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npx prisma generate

RUN npm run build

FROM node:24.1-alpine AS production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/nest-cli.json ./  

EXPOSE 3000

CMD [ "node", "dist/main" ]
