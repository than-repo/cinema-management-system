<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
movie-capstone
├─ .prettierrc
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ prisma
│  └─ schema.prisma
├─ README.md
├─ src
│  ├─ admin
│  │  ├─ admin.module.ts
│  │  ├─ bookings
│  │  │  ├─ booking.controller.ts
│  │  │  ├─ booking.module.ts
│  │  │  ├─ booking.service.ts
│  │  │  └─ dto
│  │  │     └─ create-showtime.dto.ts
│  │  ├─ movies
│  │  │  ├─ dto
│  │  │  │  ├─ create-movie.dto.ts
│  │  │  │  ├─ delete-movie.dto.ts
│  │  │  │  └─ update-movie.dto.ts
│  │  │  ├─ movie.controller.ts
│  │  │  ├─ movie.module.ts
│  │  │  └─ movie.service.ts
│  │  ├─ theaters
│  │  └─ users
│  │     ├─ dto
│  │     │  ├─ create-admin.dto.ts
│  │     │  ├─ pagination.dto.ts
│  │     │  ├─ search-no-pag.dto.ts
│  │     │  ├─ search-user.dto.ts
│  │     │  └─ update-user.dto.ts
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     └─ user.service.ts
│  ├─ api
│  │  ├─ api.module.ts
│  │  ├─ bookings
│  │  │  ├─ booking.controller.ts
│  │  │  ├─ booking.module.ts
│  │  │  ├─ booking.service.ts
│  │  │  └─ dto
│  │  │     └─ create-booking.dto.ts
│  │  ├─ movies
│  │  │  ├─ dto
│  │  │  │  ├─ get-movie-list.dto.ts
│  │  │  │  ├─ get-movies-by-date.dto.ts
│  │  │  │  └─ get-movies.dto.ts
│  │  │  ├─ movie.controller.ts
│  │  │  ├─ movie.module.ts
│  │  │  └─ movie.service.ts
│  │  ├─ theaters
│  │  │  ├─ theater.controller.ts
│  │  │  ├─ theater.module.ts
│  │  │  └─ theater.service.ts
│  │  └─ users
│  │     ├─ dto
│  │     │  ├─ create-user.dto.ts
│  │     │  ├─ login.dto.ts
│  │     │  ├─ refresh-token.dto.ts
│  │     │  └─ update-user.dto.ts
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     └─ user.service.ts
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ shared
│  │  ├─ constant
│  │  │  └─ app.constant.ts
│  │  ├─ filters
│  │  │  ├─ http-exception.filter.ts
│  │  │  └─ status-code.helper.ts
│  │  ├─ guards
│  │  │  ├─ auth
│  │  │  │  ├─ auth.module.ts
│  │  │  │  ├─ jwt-auth.guard.ts
│  │  │  │  └─ jwt.strategy.ts
│  │  │  ├─ guard.module.ts
│  │  │  └─ roles
│  │  │     ├─ roles.decorator.ts
│  │  │     ├─ roles.guard.ts
│  │  │     └─ roles.module.ts
│  │  ├─ interceptors
│  │  │  ├─ cloudinary-upload.interceptor.ts
│  │  │  ├─ logging.interceptor.ts
│  │  │  ├─ response.interceptor.ts
│  │  │  └─ token-cookie.interceptor.ts
│  │  ├─ middlewares
│  │  │  └─ token-cookie.middleware.ts
│  │  ├─ pipes
│  │  │  └─ validation.pipe.ts
│  │  └─ types
│  │     └─ express.d.ts
│  └─ sys
│     ├─ cloudinary
│     │  ├─ cloudinary.controller.ts
│     │  ├─ cloudinary.module.ts
│     │  └─ cloudinary.service.ts
│     ├─ config
│     │  └─ config.service.ts
│     ├─ prisma
│     │  ├─ prisma.module.ts
│     │  └─ prisma.service.ts
│     └─ token
│        ├─ token.mudule.ts
│        └─ token.service.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ test.js
├─ tsconfig.build.json
├─ tsconfig.build.tsbuildinfo
├─ tsconfig.json
└─ vercel.json

```
