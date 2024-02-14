import type { NextAuthConfig } from 'next-auth';
 //https://authjs.dev/reference/nextjs
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

// Обратный вызов authorized используется для проверки того, авторизован ли запрос для доступа к странице через Next.js Middleware. 
//Он вызывается перед завершением запроса и получает объект со свойствами auth и request. 
//Свойство auth содержит сессию пользователя, а свойство request - входящий запрос.

// Свойство providers - это массив, в котором перечислены различные варианты входа в систему. 
//На данный момент это пустой массив, чтобы удовлетворить конфигурацию NextAuth. 
//Подробнее о нем вы узнаете в разделе "Добавление провайдера учетных данных".

// Далее вам нужно будет импортировать объект authConfig в файл Middleware.

// Переведено с помощью www.DeepL.com/Translator (бесплатная версия)