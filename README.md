# Top mejores videojuegos

## Sincronizar el proyecto
```
git switch main
git pull
```

## Crear una nueva rama
```
git switch -c feature/09-xxxx
```

## Añadir una funcionalidad
```
<escribe el codigo>
git add .
git commit -m "feat: xxxx"

<escribe el codigo>
git add .
git commit -m "feat: yyyy"

...

```

## Sube la rama
```
git push -u origin feature/09-xxxx
```


## Crear una pull request

En github: New Pull Request
- Origin: feature/09-xxxx
- Destino: main

Si pones close #21  (donde 21 es el id del issue), la tarea se cierra automatimente cuando se acepta

Mueve en el proyecto la historia de usuario a la columna InReview

Un compañero revisará la pull y si es adecuada la mergueará
- Approve (si la acepta)
- Request changes (si no la acepta)

## Corregir los cambios si no te aceptan la pull request

```
<corregir el problema>
git add .
git commit -m "fix: xxxx"
git push
```
No hace falta crear otro PR, este se actualizará automaticamente


## Merge

Cuando esté aprobado: Merge pull request
y el código pasará a main (la tarea queda cerrada automaticamente)



