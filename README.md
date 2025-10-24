# React + TypeScript + Vite

## Introduction

### How to run

1. ```npm install```

2. ```npm run dev```


Please try to study the code structure for easy collaboration.
I included abstractions to mimic a Next.js file router by making use of generouted.

If you need to read on generouted, please visit the [documentation](https://github.com/oedotme/generouted)

I also included ready made components that are easy to use e.g:

- CustomButton: Button component
- FormInput: Input component for basic text. works with React-hook-forms

All project specific components are in @commons/components/project/*

etc.

## Packages:
- Axios
- Prettier
- React-hook-forms
- Icon -  IconSax, HugeIcons
- React hot toast
- Zustand
- Tanstack Query

## Custom Wrappers/Abstractions
- Custom Router (Wrapper around react-router-dom), the router is already setup to work with generouted. <br>Folder: ```commons/router```
  <br> Usage:
  ```jsx
  import { useRouter } from '@router';
  // You can import eevry thing importable from react-router-dom from "@router"
  
  const router = useRouter();
  
  router.push('/users');
  router.replace('/settings');
  ```
- API Object (Wrapper around Axios) <br>File: ```commons/utils/axiosProvider.ts```
  <br>Usage:
  ```jsx
  import {api} from '@utils/axiosProvider';
  api.get('/users').then((res) => console.log(res));
  api.post('/users', {name:"William"}).then((res) => console.log(res));
  ```



"heroku-postbuild": "npm install --include=dev && npm run build",
"postinstall": "npm run build",
"serve-heroku": "vite --host 0.0.0.0 --port $PORT preview"

