# School Challenge - Solução para Gestão Educacional

Este é um projeto demo minimalista, construído com React e Vite, que resolve o desafio de gerenciar dados de uma instituição de ensino de forma interativa e visual.

## Tecnologias

* **Frontend:** React.js, Vite
* **Estilização:** Tailwind CSS
* **Visualização de Dados:** Recharts
* **Persistência:** `localStorage`

## Funcionalidades

### Tela 1: Alunos
-   **Visualização e Filtros:** Visualize a lista de alunos com filtros dinâmicos por série (degree) e classe.
-   **Edição:** Edite o nome e a classe de cada aluno diretamente na tabela.
-   **Paginação:** Navegue pela lista de alunos com paginação, exibindo 10 alunos por página.
-   **Simulação de Dados:** Adicione 300 novos alunos de forma aleatória com um clique.
-   **Relatório Visual:** Gráfico de barras que exibe a distribuição de alunos por série.

### Tela 2: Professores e Relacionamentos
-   **Visualização e Filtros:** Liste os relacionamentos entre professores, matérias, graus e classes, com filtros aplicáveis.
-   **Adição de Registros:** Use um formulário para adicionar novos relacionamentos de professor.
-   **Validação:** O formulário inclui validação visual para guiar o usuário.
-   **Exclusão:** Remova registros de relacionamentos com um botão de exclusão.
-   **Detalhes de Alunos:** Clique em um botão para ver uma lista paginada de todos os alunos de um determinado grau.

## Como Executar

1.  Certifique-se de ter o Node.js (versão 16 ou superior) e o npm instalados.
2.  No diretório raiz do projeto, execute os seguintes comandos:
    ```bash
    npm install
    npm run dev
    ```
3.  Abra o navegador e acesse: `http://localhost:5173`

Os dados da aplicação são mockados a partir dos arquivos JSON localizados na pasta `src/data`.
