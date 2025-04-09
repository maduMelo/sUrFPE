# Análise de Atletas sUrFPE

**sUrFPE Athlete Analysis** é uma aplicação web desenvolvida para apoiar instrutores e monitores da organização **sUrFPE**. O sistema gera relatórios com base em arquivos CSV contendo as notas de avaliações de treinamentos práticos de surf, fornecendo uma visão analítica sobre o desempenho dos estudantes. Através da análise de indicadores como manobras, lado da onda, base do surfista, entre outros, o app contribui para um acompanhamento mais preciso da evolução de cada atleta.

---

## 🚀 Status do Projeto

O projeto está atualmente em **desenvolvimento ativo**:

- ✅ Backend com lógica de análise implementada
- ✅ API do backend implantada no PythonAnywhere
- ✅ Protótipo inicial do frontend no Netlify (upload de CSV + resposta em JSON)
- ✅ Notebook no Google Colab com saída visual para demonstração
- 🔄 Redesenho do frontend em andamento
- 🧪 Testes unitários em desenvolvimento (`pytest` no backend, `jest` no frontend)
- 📦 Geração de relatórios em PDF será implementada futuramente

---

## 📊 O Que a Aplicação Faz

- Recebe um arquivo `.csv` com dados estruturados de avaliação de treinos
- Realiza análise estatística das notas com base em:
  - `Manobras`
  - `Base do Surfista`
  - `Lado da Onda`
  - `Indicador de Manobra`
  - E outros critérios
- Retorna uma visão detalhada do desempenho do atleta
- **(Planejado)**: Exibição dos resultados em gráficos + geração de relatórios em PDF

---

## 📂 Formato do Arquivo CSV

O sistema espera um arquivo `.csv` com as seguintes colunas:

```
['Name', 'Position', 'Duration', 'Atleta', 'Base do Surfista',
 'Classificação', 'Data', 'Id Onda', 'Indicador Manobra', 'Lado Onda',
 'Manobras']
```

> ❗ Arquivos fora desse formato podem não ser processados corretamente.

---

## 🧪 Teste Agora (Demonstração)

Enquanto o frontend final não está pronto, você pode testar a lógica do backend via um **notebook no Google Colab**, com visualização em gráficos:

🔗 **[Abrir Demonstração no Google Colab](https://colab.research.google.com/drive/11RRetspBUfZcAM0Vt_AFy-9a-7IeHD8B?usp=sharing)**  

Envie seu CSV e visualize os resultados da análise em formato gráfico 📁 **[CSV for testing](test-data/data.csv)** 

Ou testar o envio de arquivos e retornos da API através de uma interface web temporária:

🔗 **[Abrir Frontend Temporário](https://elegant-naiad-6a2f2d.netlify.app/)** 

🔗 **[Abrir API](https://meom.pythonanywhere.com/)** 

---

## 🛠 Tecnologias Utilizadas

### Backend (Python + Flask)
- `pandas` e `numpy` para análise de dados
- `Flask` para a API
- Hospedado no **PythonAnywhere**
- Testes unitários: `pytest`

### Frontend (React + TypeScript)
- React + Vite + TypeScript
- `axios` para requisições à API
- `shadcn/ui` para exibição de gráficos
- Primeira versão hospedada no **Netlify**
- Testes unitários: `jest`

---

## 📁 Estrutura do Projeto (Visão Geral)

```
/backend
  ├── app.py                # Ponto de entrada da aplicação Flask
  ├── analysis.py           # Lógica principal de análise
  ├── tests/                # Testes com Pytest

/frontend
  ├── src/
      ├── components/
      ├── pages/
      ├── services/
      ├── App.tsx
      ├── index.tsx
  ├── tests/                # Testes com Jest
```

---

## 📌 Funcionalidades Planejadas

- Redesenho completo da interface com foco em usabilidade
- Dashboard com gráficos interativos
- Geração de feedbacks por IA
- Exportação de relatórios em PDF para cada estudante
- Hospedagem final no domínio da CIn

---

## ⚠️ Limitações Atuais

- Interface atual é temporária e está em desenvolvimento
- A lógica de análise ainda pode ser otimizada e melhor estruturada
- Geração de PDF ainda não implementada
- Cobertura de testes em progresso
