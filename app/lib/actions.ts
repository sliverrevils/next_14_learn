'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from 'auth'; 
import { AuthError } from 'next-auth';
//СЕРВЕРНЫЕ ЭКШЕНЫ
import { z } from 'zod';


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// const FormSchema = z.object({
//   id: z.string(),
//   customerId: z.string(),
//   amount: z.coerce.number(),
//   status: z.enum(['pending', 'paid']),
//   date: z.string(),
// });
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())

  // const rawFormData = {
  //     customerId:formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  // }

  const validatedFields = CreateInvoice.safeParse({
    // const { customerId, amount, status } = CreateInvoice.parse({
    // инициализация и проверка типов
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Если проверка формы не удалась, верните ошибки раньше времени. В противном случае продолжайте работу.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Подготовьте данные для вставки в базу данных
  const { customerId, amount, status } = validatedFields.data;

  //   Хранение значений в центах
  // Обычно в базе данных принято хранить денежные значения в центах, чтобы исключить ошибки JavaScript с плавающей точкой и обеспечить большую точность.
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]; // создаем дату

  try {
    //Выполняем SQL запрос для создания счета-фактуры
    await sql`
  INSERT INTO invoices (customer_id, amount, status, date)
  VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices'); //Поскольку вы обновляете данные, отображаемые в маршруте счетов, вам нужно очистить этот кэш и вызвать новый запрос к серверу.
  redirect('/dashboard/invoices'); //перенаправление
}

//обновление
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  // const { customerId, amount, status } = UpdateInvoice.parse({
  //   //проверям и достаем
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // });

  // const amountInCents = amount * 100; // формируем

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {    
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    //отправляем запрос на обновление
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
    revalidatePath('/dashboard/invoices'); // обновляем кеш
    redirect('/dashboard/invoices'); //перенаправление
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update  Invoice.',
    };
  }
}

//удаление

export async function deleteInvoice(id: string) {
  if (Math.ceil(Math.random() * 10) > 5) {
    throw new Error('Failed to Delete Invoice');
  }

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
