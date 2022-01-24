# Fila de atribuição de responsável

## Datasets custmumizados: 

Na ordem de execução: 

```
comercialProcessos.js
comercialInstancias.js
comercialFilaVendedores.js
comercialFila.js
```

### Dataset Processos 
Funciona como uma *view* que relaciona os datasets internos *workflowProcess* e *processTask*. 
O objetivo é conseguir desempenho filtrando apenas o processo desejado, no caso o **comercial_fila**. 

### Dataset Instancias
Outra *view* relacionados os datasets *comercialProcessos*, dessa vez sem filtros, e o *processTaskPK*, sendo filtrado através do campo *processInstanceId* do dataset customizado *comercialProcessos*. 
Obs: Há um filtro que excluí da relação as instâncias de processos onde o responsável pela abertura também faz parte de um dos nomes da fila de atribuição. Caso contrário, sempre que um dos membros da fila iniciasse uma tarefa, a fila seria reinicia a partir deste usuário.

### Dataset Fila Vendedores (estático/automatizado)
Esse dataset customizado relaciona todos os usuários que possuem o papel **(roleId)**:*comercialVendas*, cadastrado no dataset *workflowColleagueRole*, e a cada um atribuí uma posição na fila que será usada para definir a ordem de atendimento. 

### Dataset Fila (dinâmico)
Esse dataset é o que faz toda a mágica. Ele busca no dataset *comercialInstancias* o *collegueId* do último vendedor. 
Com base nisto o dataset compara se o último usuário a ser atribuído é o último da fila, se for, ele atribuí a próxima atividade para o primeiro da fila no dataset *comercialFilaVendedores*. Senão for o último, atribuí a próxima tarefa ao próximo nome da lista.  

## Mecanismo de atribuição personalizado: 

```
comercial_fila.js
```
Este mecanismo simplesmente identifica através de um campo oculto no formulário se o perfil que está iniciando a tarefa possuí o papel *comercialVendas*, se sim, o mecanismo atribuí a tarefa ao mesmo usuário, senão, vai para fila e procura pelo próximo collegueId no dataset da fila dinâmica. 

## Formulário 
```
comercial_fila.html
displayFields.js
```

O formulário possuí apenas um campo do tipo oculto (hidden), que recebe o collegueId de quem está iniciando a solicitação. O displayFields se encarrega de preencher este campo com o nome do usuário.  


