'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); //получам текущие параметры (что бы их сохранить если они есть)
  const pathname = usePathname(); // получаем текущий путь
  const { replace } = useRouter(); // функия смены url

  const handleSearch=useDebouncedCallback((term: string)=> { // используем установленный use-debounce
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams); // для формирования запроса
    params.set('page','1'); // ставим первую страницу
    if (term) {
      params.set('query', term); //добавляем параметр
    } else {
      params.delete('quary'); // удаляем параметр
    }

    replace(`${pathname}?${params.toString()}`); //обновляем наш текущий URL путь (добавляем параметры)
    //перезагрузка страницы не происходит т.к. используем хук роутера на клиентском компоненте
  },300)//задержка в мс
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get('query')?.toString() //считываем запрос со строки если оно уже там есть
        }
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

// Вот краткое описание происходящего:

// ${pathname} - это текущий путь, в вашем случае "/dashboard/invoices".
// Когда пользователь набирает текст в строке поиска, params.toString() преобразует его в формат, удобный для URL.
// replace(${pathname}?${params.toString()}) обновляет URL с данными поиска пользователя. Например, /dashboard/invoices?query=lee, если пользователь ищет "Lee".
// URL обновляется без перезагрузки страницы, благодаря навигации на стороне клиента Next.js (о которой вы узнали в главе о навигации между страницами).


