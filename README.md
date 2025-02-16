# Typescript - Tarea 3

## Introducción
En esta tarea se ha realizado una aplicación que genera una librería digital que permite gestionar libros y usuarios. 
Para ello se han utilizado:
- Tipos básicos
- Interfaces
- Clases que respetan los principios básicos de la programación.
- Decorador para debug.

 No se ha utilizado herencia en la realización de esta tarea ya que según las clases existentes no cabe la misma ya que no se ha desarrollado ningún tipo concreto de usuario,libro o librería que podría heredar de estas clases. 
 Por último, los usuarios y libros no persisten ya que no se ha especificado el uso de ninguna base de datos ni guardado en archivos.

 ## Funcionamiento

  La funcionalidad de la app se basa en los usuarios y libros. Mediante forms se puede; por un lado, crear y eliminar usuarios (el propio usuario una vez logueado es el que puede darle al botón de eliminar para eliminarse su perfil) y hacer logIn y logOut con los usuarios creados. 
  Por otro lado, se pueden crear libros añadiendo título, autor, año, género y copias disponibles. Una vez creado un libro, se actualizará la lista de libros con el mismo, 
  donde se podrá eliminar el libro y tomar prestado o devolver el libro si hay un usuario logueado (si no hay usuario logueado no saldrán los botones de tomar prestado y devolver). 

  En caso de no haber copias disponibles en un libro, el usuario al darle al botón de tomar prestado, la aplicación le enviará un aviso de que no hay copias disponibles.
  
  - tsconfig

    Se ha elaborado el tsconfig correspondiente, dejando el resto de opciones comentadas por si en un futuro son necesarias. 
  - Interfaces

    Se han implementado las interfaces de las clases libro y usuario, que contienen los atributos principales de estas.
     ```
     interface IBook {
     title: string;
     author: string;
     year: number;
     genre: string;
     copiesAvailable: number;
     }
     ```
     ```
     interface IUser {
     name: string;
     email: string;
     birthDate: Date;
     }
  - Clases

    Las clases implementadas son la de usuarios, libros y librería. Esta última engloba a las otras dos y actúa como la clase principal de la aplicación.

  - Decorador

    Se ha implementado un decorador que notifica por consola cuando se ejecuta una función y con qué argumentos, dado que es una funcionalidad útil para el debug.
    ```
    function decoratorDebug(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
      ): PropertyDescriptor {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
          console.log(`Ejecutando el método "${propertyKey}" con argumentos: ${args.map(arg => JSON.stringify(arg)).join(', ')}`);
          return originalMethod.apply(this, args);
      };
      return descriptor;
    }
    ```
     
