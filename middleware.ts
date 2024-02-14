
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
//https://nextjs.org/docs/app/building-your-application/routing/middleware
//https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  //'/dashboard/invoices' // указываем пути на которые нельзя без авторизации
  ],
};

// Здесь вы инициализируете NextAuth.js объектом authConfig и экспортируете свойство auth. 
//Вы также используете опцию matcher из Middleware, чтобы указать, что он должен запускаться по определенным путям.

// Преимущество использования Middleware для этой задачи заключается в том, что защищенные маршруты даже не начнут рендеринг, 
//пока Middleware не проверит аутентификацию, что повышает безопасность и производительность вашего приложения.

// Переведено с помощью www.DeepL.com/Translator (бесплатная версия)