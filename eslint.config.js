import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,

  {
    // rules - правила
    rules: {
      'no-unused-vars': 'warn', //предупреждение на неиспользованные переменные
      'no-undef': 'warn', // предупреждение  - переменная не найдена
      'no-console': 'off', // Разрешить использование console.log()
    },
    // подсказка для eslint, что мы открываем проект в браузере- объект'document' бывает только в браузере при этом необходимо сделать import globals from 'globals'
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        myCustomGlobal: 'readonly',
      },
    },
  },
]
