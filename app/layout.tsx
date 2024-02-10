import '@/app/ui/global.css'
import { inter } from './ui/fonts';

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
