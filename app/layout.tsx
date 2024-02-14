import '@/app/ui/global.css'
import { inter } from './ui/fonts';
import { Metadata } from 'next';
//Добавление метадаты
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', //Знак %s в шаблоне будет заменен на название конкретной страницы.
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

//добавление созданного шрифта в body
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //console.log('font :', inter)
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
