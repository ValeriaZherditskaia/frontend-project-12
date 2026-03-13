import * as yup from 'yup'

export const CHANNEL_SCHEMA = yup.object({
  name: yup
    .string()
    .trim('Имя не может быть пустым')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
})
