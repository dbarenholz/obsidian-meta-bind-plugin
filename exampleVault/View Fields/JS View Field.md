---
number1: 23
number2: 5
---
`INPUT[number:number1]`
`INPUT[number:number2]`

```meta-bind-js-view
{number1} as n1
{number2} as n2
---
return `${context.n1 * context.n2} km`;
```

